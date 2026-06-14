import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  findSummaryV1ByPath,
  normalizeSummaryV1Path
} from '../docs/.vuepress/utils/summary-v1-service.js'

const snapshot = {
  version: 1,
  files: {
    '/react/react16.md': {
      status: 'success',
      summary: { summary: 'Fiber 架构概览', keywords: ['Fiber'] }
    },
    '/guide/README.md': { status: 'short', reason: 'content-too-short' },
    '/draft.md': { status: 'excluded', reason: 'excluded-by-policy' },
    '/failed.md': { status: 'error', reason: 'provider-timeout' }
  }
}

test('normalizes html, md and directory routes to snapshot keys', () => {
  assert.equal(normalizeSummaryV1Path('/react/react16.html'), '/react/react16.md')
  assert.equal(normalizeSummaryV1Path('/react/react16.md'), '/react/react16.md')
  assert.equal(normalizeSummaryV1Path('/guide/'), '/guide/README.md')
})

test('returns explicit success, excluded, short, error and missing states', () => {
  assert.equal(findSummaryV1ByPath(snapshot, '/react/react16.html').status, 'success')
  assert.equal(findSummaryV1ByPath(snapshot, '/guide/').status, 'short')
  assert.equal(findSummaryV1ByPath(snapshot, '/draft.html').status, 'excluded')
  assert.equal(findSummaryV1ByPath(snapshot, '/failed.html').status, 'error')
  assert.deepEqual(findSummaryV1ByPath(snapshot, '/missing.html'), {
    status: 'missing',
    summary: null,
    reason: 'summary-not-built'
  })
})

test('assistant bootstrap has no runtime summary API fallback', async () => {
  const files = [
    'docs/.vuepress/utils/summary-prefetch.js',
    'docs/.vuepress/components/AIAssistShell.vue',
    'docs/.vuepress/components/ai/AIChatPanel.vue'
  ]
  const source = (
    await Promise.all(files.map((file) => readFile(file, 'utf8')))
  ).join('\n')
  assert.doesNotMatch(source, /\/api\/ai\/summary/)
  assert.doesNotMatch(source, /loadLiveSummary|shouldTryLiveSummary/)
})
