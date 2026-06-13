#!/usr/bin/env node
/**
 * 文档摘要生成工具（DeepSeek + 增量 manifest）
 * 构建时运行，输出 docs/.vuepress/public/summaries.json
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildProcessingPlan,
  extractMarkdownContent,
  hashContent,
  loadCachedSummaries,
  loadFallbackSummaries,
  loadManifest,
  saveManifest,
  updateManifestEntry,
  writeSummariesOutput,
} from './ai-summary-cache.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = resolve(ROOT, 'docs')
const OUTPUT_PATH = resolve(ROOT, 'docs/.vuepress/public/summaries.json')

const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-v4-pro'
const DELAY_BETWEEN_REQUESTS = 500
const MAX_CONTENT_LENGTH = 3000

const SUMMARY_SYSTEM_PROMPT = `你是一个技术文档分析专家。请对技术文档进行全面的内容提炼和分析。

输出要求：
1. 返回 JSON 格式
2. summary: 详细摘要（150-200字），包含核心概念、关键特性和应用场景
3. keyPoints: 3-5个核心要点，每个要点简洁明了
4. keywords: 3-5个关键技术词
5. techStack: 相关技术栈（如：React、TypeScript、Node.js等）
6. difficulty: 难度等级（入门/进阶/高级）
7. contentType: 内容类型（概念/实践/原理/工具）

返回格式示例：
{
  "summary": "React 16 引入了革命性的 Fiber 架构...",
  "keyPoints": ["要点1", "要点2", "要点3"],
  "keywords": ["React", "Fiber", "Hooks"],
  "techStack": ["React", "JavaScript"],
  "difficulty": "进阶",
  "contentType": "原理 + 实践"
}`

function log(msg, level = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌',
  }[level] || ''
  console.log(`[${timestamp}] ${prefix} ${msg}`)
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms))
}

function getChatCompletionsUrl(baseUrl) {
  const trimmed = baseUrl.replace(/\/$/, '')
  if (trimmed.endsWith('/v1')) {
    return `${trimmed}/chat/completions`
  }
  return `${trimmed}/v1/chat/completions`
}

function getAiConfig() {
  return {
    apiKey: process.env.AI_API_KEY || '',
    baseUrl: process.env.AI_BASE_URL || DEFAULT_BASE_URL,
    model: process.env.AI_MODEL || DEFAULT_MODEL,
  }
}

function parseSummaryResponse(rawContent) {
  let jsonStr = rawContent.trim()
  const jsonMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }

  const parsed = JSON.parse(jsonStr)
  if (!parsed.summary) {
    throw new Error('缺少 summary 字段')
  }

  return {
    summary: parsed.summary,
    keyPoints: parsed.keyPoints || [],
    keywords: parsed.keywords || [],
    techStack: parsed.techStack || [],
    difficulty: parsed.difficulty || '未分级',
    contentType: parsed.contentType || '综合',
  }
}

async function generateSummary(content, config) {
  const response = await fetch(getChatCompletionsUrl(config.baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `请分析以下技术文档并提炼关键信息，以 JSON 格式返回：\n\n${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API 请求失败 (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  if (data.error) {
    throw new Error(`API 返回错误: ${JSON.stringify(data.error)}`)
  }

  const rawContent = data.choices?.[0]?.message?.content?.trim()
  if (!rawContent) {
    throw new Error('API 未返回摘要内容')
  }

  try {
    return parseSummaryResponse(rawContent)
  } catch (parseError) {
    log(`JSON 解析失败，使用原始内容: ${parseError.message}`, 'warning')
    return {
      summary: rawContent,
      keyPoints: [],
      keywords: [],
      techStack: [],
      difficulty: '未分级',
      contentType: '综合',
    }
  }
}

function createEmptyOutput(message) {
  writeSummariesOutput({
    rootDir: ROOT,
    outputPath: OUTPUT_PATH,
    summaries: {},
    meta: {
      generatedAt: new Date().toISOString(),
      totalFiles: 0,
      enabled: false,
      message,
    },
  })
}

function buildShortContentSummary() {
  return {
    summary: '内容太短，暂无摘要',
    keyPoints: [],
    keywords: [],
    techStack: [],
    difficulty: '未分级',
    contentType: '综合',
  }
}

function buildFailureSummary() {
  return {
    summary: '生成失败，请稍后重试',
    keyPoints: [],
    keywords: [],
    techStack: [],
    difficulty: '未分级',
    contentType: '综合',
  }
}

async function generateAllSummaries(options = {}) {
  const forceFull = options.forceFull || process.env.AI_SUMMARY_FULL === '1'
  const config = getAiConfig()

  log('开始生成文档摘要（增量模式）...')

  if (!config.apiKey) {
    log('AI_API_KEY 未配置，跳过摘要生成', 'warning')
    createEmptyOutput('AI 摘要功能未启用。请配置 AI_API_KEY 环境变量。')
    return
  }

  let manifest = loadManifest(ROOT)
  let { summaries } = loadCachedSummaries(ROOT)

  if (!manifest || Object.keys(summaries).length === 0) {
    const fallback = await loadFallbackSummaries(process.env.SUMMARIES_FALLBACK_URL)
    if (Object.keys(fallback.summaries).length > 0) {
      summaries = { ...fallback.summaries, ...summaries }
      log(`从 SUMMARIES_FALLBACK_URL 加载 ${Object.keys(fallback.summaries).length} 条摘要`, 'info')
    }
  }

  const plan = buildProcessingPlan({
    rootDir: ROOT,
    docsDir: DOCS_DIR,
    manifest,
    summaries,
    forceFull,
  })

  if (!manifest) {
    manifest = {
      version: 1,
      lastCommitSha: null,
      lastProcessedAt: null,
      files: {},
    }
  }

  log(
    `文档总数 ${plan.files.length}，增量处理 ${plan.toProcess.length}，跳过 ${plan.toReuse.length}，删除 ${plan.deletedCount}`,
  )

  let processedThisRun = 0
  let successCount = plan.toReuse.length
  let errorCount = 0

  for (let index = 0; index < plan.toProcess.length; index += 1) {
    const file = plan.toProcess[index]
    const markdown = readFileSync(file.fullPath, 'utf-8')
    const content = file.content || extractMarkdownContent(markdown, MAX_CONTENT_LENGTH)
    const contentHash = file.contentHash || hashContent(content)

    log(`[${index + 1}/${plan.toProcess.length}] 处理: ${file.path}`)

    try {
      if (!content || content.length < 50) {
        summaries[file.path] = buildShortContentSummary()
      } else {
        summaries[file.path] = await generateSummary(content, config)
        processedThisRun += 1
      }

      updateManifestEntry(manifest, file.path, contentHash)
      successCount += 1
      log(`  ✓ 完成`, 'success')
    } catch (error) {
      errorCount += 1
      summaries[file.path] = buildFailureSummary()
      log(`  ✗ 失败: ${error.message}`, 'error')
    }

    if (index < plan.toProcess.length - 1) {
      await sleep(DELAY_BETWEEN_REQUESTS)
    }
  }

  manifest.lastCommitSha = plan.currentCommitSha
  manifest.lastProcessedAt = new Date().toISOString()
  saveManifest(ROOT, manifest)

  const meta = {
    version: '2.0',
    generatedAt: new Date().toISOString(),
    totalFiles: plan.files.length,
    successCount,
    errorCount,
    enabled: true,
    model: config.model,
    provider: 'deepseek',
    enhanced: true,
    incremental: true,
    lastCommitSha: plan.currentCommitSha,
    processedThisRun,
    skippedThisRun: plan.toReuse.length,
    deletedThisRun: plan.deletedCount,
    features: [
      'summary',
      'keyPoints',
      'keywords',
      'techStack',
      'difficulty',
      'contentType',
    ],
  }

  writeSummariesOutput({
    rootDir: ROOT,
    outputPath: OUTPUT_PATH,
    summaries,
    meta,
  })

  log(
    `完成！本次 AI 调用 ${processedThisRun} 次，累计 ${Object.keys(summaries).length} 篇，失败 ${errorCount}`,
    'success',
  )
  log(`摘要文件已保存: ${OUTPUT_PATH}`)
}

function printHelp() {
  console.log(`
文档摘要生成工具（DeepSeek + 增量 manifest）

用法:
  node tools/generate-summaries.mjs [--full]

环境变量:
  AI_API_KEY              DeepSeek API Key（必需）
  AI_BASE_URL             默认 https://api.deepseek.com
  AI_MODEL                默认 deepseek-v4-pro
  AI_SUMMARY_FULL=1       强制全量重建
  SUMMARIES_FALLBACK_URL  缓存丢失时拉取线上 summaries.json 的站点根 URL

输出:
  docs/.vuepress/public/summaries.json
  .cache/ai-summaries/manifest.json
`)
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  generateAllSummaries({ forceFull: args.includes('--full') })
    .then(() => process.exit(0))
    .catch((error) => {
      log(error.message, 'error')
      process.exit(1)
    })
}

export { generateAllSummaries, getAiConfig }
