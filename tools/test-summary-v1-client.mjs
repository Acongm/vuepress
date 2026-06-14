import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  findSummaryV1ByPath,
  normalizeSummaryV1Path,
  summaryV1StatusText
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
    '/failed.md': { status: 'error', reason: 'provider-timeout' },
    '/mark/01-React核心原理.md': { status: 'error', reason: 'provider-timeout' }
  }
}

test('normalizes html, md and directory routes to snapshot keys', () => {
  assert.equal(normalizeSummaryV1Path('/react/react16.html'), '/react/react16.md')
  assert.equal(normalizeSummaryV1Path('/react/react16.md'), '/react/react16.md')
  assert.equal(normalizeSummaryV1Path('/guide/'), '/guide/README.md')
  assert.equal(
    normalizeSummaryV1Path(
      '/mark/01-React%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86.html'
    ),
    '/mark/01-React核心原理.md'
  )
})

test('returns explicit success, excluded, short, error and missing states', () => {
  assert.equal(findSummaryV1ByPath(snapshot, '/react/react16.html').status, 'success')
  assert.equal(findSummaryV1ByPath(snapshot, '/guide/').status, 'short')
  assert.equal(findSummaryV1ByPath(snapshot, '/draft.html').status, 'excluded')
  assert.equal(findSummaryV1ByPath(snapshot, '/failed.html').status, 'error')
  assert.equal(
    findSummaryV1ByPath(
      snapshot,
      '/mark/01-React%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86.html'
    ).status,
    'error'
  )
  assert.deepEqual(findSummaryV1ByPath(snapshot, '/missing.html'), {
    status: 'missing',
    summary: null,
    reason: 'summary-not-built'
  })
})

test('summaryV1StatusText distinguishes snapshot and section states', () => {
  assert.equal(
    summaryV1StatusText(null, { snapshotMissing: true }),
    '摘要快照未部署，请稍后刷新。'
  )
  assert.equal(
    summaryV1StatusText({ status: 'excluded', reason: 'section-index' }),
    '章节索引页，请打开具体文章查看摘要。'
  )
  assert.equal(summaryV1StatusText({ status: 'missing' }), '本文暂无构建期摘要。')
  assert.equal(
    summaryV1StatusText({ status: 'error' }),
    '本文摘要生成失败，将在后续构建自动重试。'
  )
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
