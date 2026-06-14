#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = resolve(__dirname, '../vuepress/summaries-v1.json')

const SAMPLE_PATHS = [
  '/mark/01-React核心原理.md',
  '/react/react16.md',
  '/JavaScript/call、apply与bind.md'
]

function main() {
  if (!existsSync(OUTPUT_PATH)) {
    console.error('[smoke-summaries-v1] missing:', OUTPUT_PATH)
    process.exit(1)
  }

  let snapshot
  try {
    snapshot = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'))
  } catch (error) {
    console.error('[smoke-summaries-v1] invalid JSON:', error.message)
    process.exit(1)
  }

  if (snapshot.version !== 1 || !snapshot.files) {
    console.error('[smoke-summaries-v1] invalid snapshot shape')
    process.exit(1)
  }

  const successCount = Object.values(snapshot.files).filter(
    (entry) => entry?.status === 'success' && entry.summary
  ).length

  if (successCount < 10) {
    console.error(
      `[smoke-summaries-v1] too few success entries: ${successCount}`
    )
    process.exit(1)
  }

  const missingSamples = SAMPLE_PATHS.filter((path) => {
    const entry = snapshot.files[path]
    return !(entry?.status === 'success' && entry.summary)
  })

  if (missingSamples.length === SAMPLE_PATHS.length) {
    console.warn(
      '[smoke-summaries-v1] warning: sample paths missing, checking any success entry'
    )
    const anySuccess = Object.keys(snapshot.files).find((path) => {
      const entry = snapshot.files[path]
      return entry?.status === 'success' && entry.summary
    })
    if (!anySuccess) {
      console.error('[smoke-summaries-v1] no success entries found')
      process.exit(1)
    }
  }

  console.log(`[smoke-summaries-v1] passed (${successCount} success entries)`)
}

main()
