#!/usr/bin/env node
/**
 * 构建模块索引，供前端模块级 AI 对话使用
 * 输出 docs/.vuepress/public/module-index.json
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const KNOWLEDGE_MAP_PATH = resolve(ROOT, 'tools/knowledge-map.json')
const DOCS_INDEX_PATH = resolve(
  ROOT,
  '.agents/skills/ai-doc/references/docs-index.json'
)
const SUMMARIES_PATH = resolve(
  ROOT,
  'docs/.vuepress/public/summaries.json'
)
const OUTPUT_PATH = resolve(ROOT, 'docs/.vuepress/public/module-index.json')

function readJson(path, fallback) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return fallback
  }
}

function normalizeSummary(summary) {
  if (!summary) {
    return { summary: '', keywords: [] }
  }
  if (typeof summary === 'string') {
    return { summary, keywords: [] }
  }
  return {
    summary: summary.summary || '',
    keywords: summary.keywords || []
  }
}

function buildModuleIndex() {
  const knowledgeMap = readJson(KNOWLEDGE_MAP_PATH, { categories: {} })
  const docsIndex = readJson(DOCS_INDEX_PATH, { categories: {} })
  const summariesData = readJson(SUMMARIES_PATH, { summaries: {} })
  const summaries = summariesData.summaries || {}

  const modules = {}

  for (const [key, info] of Object.entries(knowledgeMap.categories || {})) {
    if (!info.sidebarKey) {
      continue
    }

    const categoryDocs = docsIndex.categories?.[key]?.files || []
    const files = categoryDocs.map((filePath) => {
      const summaryEntry = normalizeSummary(summaries[filePath])
      return {
        path: filePath,
        title: filePath.split('/').pop()?.replace(/\.md$/, '') || filePath,
        summary: summaryEntry.summary,
        keywords: summaryEntry.keywords
      }
    })

    modules[key] = {
      sidebarKey: info.sidebarKey,
      description: info.description || '',
      files
    }
  }

  const output = {
    _meta: {
      generatedAt: new Date().toISOString(),
      moduleCount: Object.keys(modules).length
    },
    modules
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf-8')
  console.log(`module-index.json 已生成，共 ${Object.keys(modules).length} 个模块`)
}

buildModuleIndex()
