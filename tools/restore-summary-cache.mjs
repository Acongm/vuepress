#!/usr/bin/env node

import { existsSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ensureCacheDir,
  loadFallbackSummaries,
  resolveCacheSummariesPath,
  resolveManifestPath
} from './ai-summary-cache.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

async function main() {
  const cacheSummaries = resolveCacheSummariesPath(ROOT)
  const manifestPath = resolveManifestPath(ROOT)

  if (existsSync(cacheSummaries) && existsSync(manifestPath)) {
    console.log('[restore-summary-cache] local cache present, skip restore')
    return
  }

  const fallbackBase =
    process.env.SUMMARIES_FALLBACK_URL || 'https://www.acongm.com'

  console.log('[restore-summary-cache] seeding cache from', fallbackBase)
  ensureCacheDir(ROOT)
  const restored = await loadFallbackSummaries(fallbackBase)
  const count = Object.keys(restored.summaries || {}).length

  if (!count) {
    console.warn('[restore-summary-cache] fallback restore failed or empty')
    return
  }

  const payload = {
    _meta: {
      ...restored.meta,
      restoredFrom: fallbackBase,
      restoredAt: new Date().toISOString()
    },
    summaries: restored.summaries
  }

  writeFileSync(cacheSummaries, JSON.stringify(payload, null, 2))
  console.log('[restore-summary-cache] restored', count, 'summaries into cache')
}

main().catch((err) => {
  console.error('[restore-summary-cache] failed:', err.message)
  process.exit(0)
})
