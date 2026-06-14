#!/usr/bin/env node

import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildAnalysisPlan, generateSnapshot } from './ai-summary-v1.mjs'

const DEFAULT_MODEL = 'deepseek-v4-pro'
const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const MAX_CONTENT_LENGTH = 3000
const PROVIDER_TIMEOUT_MS = 45000
const PROVIDER_ATTEMPTS = 2

const SYSTEM_PROMPT = `你是技术文档分析助手。仅返回 JSON：summary（150字以内）、keyPoints（3-5项）、keywords（3-5项）、techStack、difficulty、contentType。`

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
  await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`)
}

function completionUrl(baseUrl) {
  const normalized = baseUrl.replace(/\/$/, '')
  return normalized.endsWith('/v1')
    ? `${normalized}/chat/completions`
    : `${normalized}/v1/chat/completions`
}

export function createProviderAnalyzer({ apiKey, baseUrl, model, fetchImpl = fetch }) {
  return async ({ path, content }) => {
    let lastError
    for (let attempt = 1; attempt <= PROVIDER_ATTEMPTS; attempt += 1) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)
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
            temperature: 0.2,
            max_tokens: 700,
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
        if (!raw) throw new Error('AI provider returned empty content')
        const json = raw.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || raw.match(/\{[\s\S]*\}/)?.[0] || raw
        const parsed = JSON.parse(json)
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
        lastError = error
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
  analyze
}) {
  const existing = await readSnapshot(cachePath)
  const plan = buildAnalysisPlan({ docsDir, snapshot: existing, model })

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

  if (!apiKey && plan.toAnalyze.length > 0) {
    if (!existing) {
      throw new Error('AI_API_KEY is required because no reusable v1 snapshot exists')
    }
    await writeSnapshot(outputPath, existing)
    return { ...existing, stats: { ...existing.stats, aiCalls: 0 } }
  }

  const providerAnalyze =
    analyze || createProviderAnalyzer({ apiKey, baseUrl, model })
  const snapshot = await generateSnapshot({
    docsDir,
    model,
    snapshot: existing,
    analyze: providerAnalyze
  })
  await writeSnapshot(cachePath, snapshot)
  await writeSnapshot(outputPath, snapshot)
  return snapshot
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const dryRun = process.argv.includes('--dry-run') || process.env.AI_SUMMARY_DRY_RUN === '1'
  const snapshot = await runSummaryBuild({
    docsDir: resolve(root, 'docs'),
    cachePath: resolve(root, '.cache/ai-summaries-v1.json'),
    outputPath: resolve(root, 'docs/.vuepress/public/summaries-v1.json'),
    model: process.env.AI_MODEL || DEFAULT_MODEL,
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || DEFAULT_BASE_URL,
    dryRun
  })
  console.log(`[ai-v1-stats] ${JSON.stringify(snapshot.stats)}`)
}
