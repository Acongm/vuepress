#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = resolve(__dirname, '../vuepress/assets/js')
const CHAT_PANEL = resolve(
  __dirname,
  '../docs/.vuepress/components/ai/AIChatPanel.vue'
)
const CHAT_TAGS = resolve(
  __dirname,
  '../docs/.vuepress/utils/chat-v1-tags.js'
)

const BAD_PATTERNS = [/fetch\(\s*["']\\"https?:\/\/api\.acongm\.com/]

function collectJsFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      files.push(...collectJsFiles(fullPath))
      continue
    }
    if (entry.endsWith('.js')) {
      files.push(fullPath)
    }
  }
  return files
}

function main() {
  const panelSource = [CHAT_PANEL, CHAT_TAGS]
    .map((file) => readFileSync(file, 'utf-8'))
    .join('\n')
  const requiredMarkers = [
    'streamChatV1',
    '当前文章',
    '本模块',
    '联网检索',
    '停止',
    '重新生成',
    '重试',
    '复制',
    '清空',
    'loadChatHistory'
  ]
  const missingMarkers = requiredMarkers.filter(
    (marker) => !panelSource.includes(marker)
  )
  if (missingMarkers.length) {
    console.error('[smoke-ai] missing v1 chat markers:', missingMarkers.join(', '))
    process.exit(1)
  }
  if (panelSource.includes('startTypewriter') || panelSource.includes('setInterval')) {
    console.error('[smoke-ai] fake answer typewriter is still present')
    process.exit(1)
  }

  let files = []
  try {
    files = collectJsFiles(ASSETS_DIR)
  } catch (err) {
    console.error('[smoke-ai] assets directory missing:', ASSETS_DIR)
    console.error(err.message)
    process.exit(1)
  }

  const offenders = []
  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    if (!content.includes('api.acongm.com') && !content.includes('api/ai/')) {
      continue
    }
    for (const pattern of BAD_PATTERNS) {
      if (pattern.test(content)) {
        offenders.push({ file, pattern: pattern.toString() })
        break
      }
    }
  }

  if (offenders.length) {
    console.error('[smoke-ai] found malformed AI API URLs in bundle:')
    offenders.forEach(({ file, pattern }) => {
      console.error(`  - ${file} (${pattern})`)
    })
    process.exit(1)
  }

  const hasNormalize = files.some((file) => {
    const content = readFileSync(file, 'utf-8')
    return (
      content.includes('api.acongm.com/api/ai/chat') &&
      (content.includes('https?:\\/\\/') || content.includes('replace(/^'))
    )
  })

  if (!hasNormalize) {
    console.warn(
      '[smoke-ai] warning: no URL normalization detected near AI chat endpoint'
    )
  }

  console.log('[smoke-ai] AI bundle checks passed')
}

main()
