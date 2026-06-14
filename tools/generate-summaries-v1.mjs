#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseEnv } from 'node:util'

import { buildAnalysisPlan, generateSnapshot } from './ai-summary-v1.mjs'

const DEFAULT_MODEL = 'deepseek-v4-pro'
const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const MAX_CONTENT_LENGTH = 3000
const DEFAULT_PROVIDER_TIMEOUT_MS = 60000
const DEFAULT_PROVIDER_ATTEMPTS = 3
const DEFAULT_ANALYSIS_CONCURRENCY = 4

const SYSTEM_PROMPT = `你是技术文档分析助手。必须仅返回一个合法 JSON 对象，不要 Markdown 代码块，不要解释。字段：summary（150字以内字符串）、keyPoints（3-5项字符串数组）、keywords（3-5项字符串数组）、techStack（字符串数组）、difficulty（字符串）、contentType（字符串）。即使文档很短，也必须根据标题、路径和内容生成有效分析。`

export async function loadEnvironmentFile(path, env = process.env) {
  if (!existsSync(path)) return false
  const parsed = parseEnv(await readFile(path, 'utf8'))
  for (const [key, value] of Object.entries(parsed)) {
    if (env[key] === undefined || env[key] === '') env[key] = value
  }
  return true
}

async function readSnapshot(path) {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return null
  }
}

async function writeSnapshot(path, snapshot) {
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporary, `${JSON.stringify(snapshot, null, 2)}\n`)
  await rename(temporary, path)
}

function entryRank(entry, expected) {
  if (
    entry?.status === 'success' &&
    entry.summary &&
    entry.analysisHash === expected?.analysisHash
  ) {
    return 4
  }
  if (entry?.status === 'success' && entry.summary) return 3
  if (entry?.status === 'error') return 2
  return entry ? 1 : 0
}

async function readMergedSnapshot(cachePath, outputPath, expectedFiles) {
  const snapshots = (
    await Promise.all([readSnapshot(outputPath), readSnapshot(cachePath)])
  ).filter(Boolean)
  if (snapshots.length === 0) return null
  const newest = snapshots.sort((a, b) =>
    String(a.generatedAt || '').localeCompare(String(b.generatedAt || ''))
  )[snapshots.length - 1]
  const files = {}
  for (const snapshot of snapshots) {
    for (const [path, entry] of Object.entries(snapshot.files || {})) {
      const current = files[path]
      const expected = expectedFiles.get(path)
      if (
        entryRank(entry, expected) > entryRank(current, expected) ||
        (entryRank(entry, expected) === entryRank(current, expected) &&
          String(entry.processedAt || '') > String(current?.processedAt || ''))
      ) {
        files[path] = entry
      }
    }
  }
  return { ...newest, files }
}

function hasSameAnalysis(left, right) {
  return (
    left &&
    right &&
    JSON.stringify(left.analysis) === JSON.stringify(right.analysis) &&
    JSON.stringify(left.files) === JSON.stringify(right.files)
  )
}

function completionUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/$/, '')
  return normalized.endsWith('/v1')
    ? `${normalized}/chat/completions`
    : `${normalized}/v1/chat/completions`
}

export function createProviderAnalyzer({
  apiKey,
  baseUrl,
  model,
  fetchImpl = fetch,
  timeoutMs = DEFAULT_PROVIDER_TIMEOUT_MS,
  attempts = DEFAULT_PROVIDER_ATTEMPTS
}) {
  return async ({ path, content }) => {
    let lastError
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)
      try {
        const response = await fetchImpl(completionUrl(baseUrl), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${apiKey}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model,
            temperature: 0,
            max_tokens: 1200,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              {
                role: 'user',
                content: `文档路径：${path}\n\n${content.slice(0, MAX_CONTENT_LENGTH)}`
              }
            ]
          })
        })
        if (!response.ok) {
          throw new Error(`AI provider failed (${response.status}): ${(await response.text()).slice(0, 200)}`)
        }
        const data = await response.json()
        const raw = data.choices?.[0]?.message?.content?.trim()
        if (!raw) throw new Error(`AI provider returned empty content (attempt ${attempt})`)
        const json = raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || raw.match(/\{[\s\S]*\}/)?.[0] || raw
        const parsed = JSON.parse(json.trim())
        if (!parsed.summary) throw new Error('AI summary is missing summary')
        return {
          summary: parsed.summary,
          keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
          techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
          difficulty: parsed.difficulty || '未分级',
          contentType: parsed.contentType || '综合'
        }
      } catch (error) {
        lastError = new Error(
          `${path} attempt ${attempt}/${attempts}: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      } finally {
        clearTimeout(timeout)
      }
    }
    throw lastError
  }
}

export async function runSummaryBuild({
  docsDir,
  cachePath,
  outputPath,
  model = DEFAULT_MODEL,
  apiKey = '',
  baseUrl = DEFAULT_BASE_URL,
  dryRun = false,
  full = false,
  analyze,
  analysisConcurrency = DEFAULT_ANALYSIS_CONCURRENCY,
  checkpoint = true
}) {
  const startedAt = Date.now()
  const expectedFiles = new Map(
    buildAnalysisPlan({ docsDir, snapshot: null, model }).files.map(file => [
      file.path,
      file
    ])
  )
  const existing = full
    ? null
    : await readMergedSnapshot(cachePath, outputPath, expectedFiles)
  const plan = buildAnalysisPlan({ docsDir, snapshot: existing, model })

  console.log(
    `[ai-v1-plan] total=${plan.files.length} reusable=${plan.reusable.length} analyze=${plan.toAnalyze.length} full=${full}`
  )

  if (dryRun) {
    return {
      ...(existing || { version: 1, files: {} }),
      stats: {
        totalFiles: plan.files.length,
        reusedFiles: plan.reusable.length,
        pendingFiles: plan.toAnalyze.length,
        skippedFiles: plan.short.length,
        failedFiles: 0,
        aiCalls: 0,
        hitRate: plan.files.length ? plan.reusable.length / plan.files.length : 1,
        durationMs: 0
      }
    }
  }

  if (existing && plan.toAnalyze.length === 0) {
    const [cacheSnapshot, outputSnapshot] = await Promise.all([
      readSnapshot(cachePath),
      readSnapshot(outputPath)
    ])
    if (!hasSameAnalysis(cacheSnapshot, existing)) {
      await writeSnapshot(cachePath, existing)
    }
    if (!hasSameAnalysis(outputSnapshot, existing)) {
      await writeSnapshot(outputPath, existing)
    }
    return {
      ...existing,
      stats: {
        ...existing.stats,
        totalFiles: plan.files.length,
        reusedFiles: plan.reusable.length,
        pendingFiles: 0,
        completedFiles: plan.files.length,
        skippedFiles: 0,
        failedFiles: 0,
        aiCalls: 0,
        hitRate: 1,
        durationMs: Date.now() - startedAt
      }
    }
  }

  if (!apiKey && plan.toAnalyze.length > 0) {
    if (!existing) {
      throw new Error('AI_API_KEY is required because no reusable v1 snapshot exists')
    }
    await writeSnapshot(outputPath, existing)
    return {
      ...existing,
      stats: {
        ...existing.stats,
        aiCalls: 0,
        durationMs: Date.now() - startedAt
      }
    }
  }

  const providerAnalyze =
    analyze || createProviderAnalyzer({ apiKey, baseUrl, model })
  let checkpointQueue = Promise.resolve()
  const snapshot = await generateSnapshot({
    docsDir,
    model,
    snapshot: existing,
    analyze: providerAnalyze,
    analysisConcurrency,
    onProgress: checkpoint
      ? ({ path, entry, completed, total, snapshot: partial }) => {
          console.log(
            `[ai-v1-progress] ${completed}/${total} ${entry.status} ${path}`
          )
          checkpointQueue = checkpointQueue.then(async () => {
            await writeSnapshot(cachePath, partial)
            await writeSnapshot(outputPath, partial)
          })
          return checkpointQueue
        }
      : undefined
  })
  await checkpointQueue
  await writeSnapshot(cachePath, snapshot)
  await writeSnapshot(outputPath, snapshot)
  return snapshot
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  await loadEnvironmentFile(resolve(root, '.env'))
  const dryRun = process.argv.includes('--dry-run') || process.env.AI_SUMMARY_DRY_RUN === '1'
  const full = process.argv.includes('--full')
  const snapshot = await runSummaryBuild({
    docsDir: resolve(root, 'docs'),
    cachePath: resolve(root, '.cache/ai-summaries-v1.json'),
    outputPath: resolve(root, 'docs/.vuepress/public/summaries-v1.json'),
    model: process.env.AI_MODEL || DEFAULT_MODEL,
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || DEFAULT_BASE_URL,
    dryRun,
    full,
    analysisConcurrency: Number(
      process.env.AI_SUMMARY_CONCURRENCY || DEFAULT_ANALYSIS_CONCURRENCY
    )
  })
  console.log(`[ai-v1-stats] ${JSON.stringify(snapshot.stats)}`)
}
