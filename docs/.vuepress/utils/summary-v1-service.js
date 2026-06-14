import { normalizeSummaryData } from './normalize-summary.js'

let snapshotPromise = null

export function normalizeSummaryV1Path(pagePath, base = '/') {
  let path = String(pagePath || '/').split(/[?#]/)[0]
  if (base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length - 1)
  }
  if (!path.startsWith('/')) path = `/${path}`
  if (path.endsWith('.html')) path = path.replace(/\.html$/, '.md')
  if (path.endsWith('/')) path = `${path}README.md`
  if (!path.endsWith('.md')) path = `${path}.md`
  return path
}

function pathVariants(pagePath, base = '/') {
  const normalized = normalizeSummaryV1Path(pagePath, base)
  const variants = [normalized]
  if (normalized.endsWith('/README.md')) {
    variants.push(normalized.replace(/\/README\.md$/, '/index.md'))
  }
  if (normalized.endsWith('/index.md')) {
    variants.push(normalized.replace(/\/index\.md$/, '/README.md'))
  }
  return variants
}

export function findSummaryV1ByPath(snapshot, pagePath, base = '/') {
  const files = snapshot?.files || {}
  const entry = pathVariants(pagePath, base)
    .map((path) => files[path] || files[path.replace(/^\//, '')])
    .find(Boolean)

  if (!entry) {
    return { status: 'missing', summary: null, reason: 'summary-not-built' }
  }
  return {
    status: entry.status || 'missing',
    summary:
      entry.status === 'success' && entry.summary
        ? normalizeSummaryData(entry.summary)
        : null,
    reason: entry.reason || entry.error || ''
  }
}

export function clearSummaryV1Snapshot() {
  snapshotPromise = null
}

export async function loadSummaryV1Snapshot(withBase, options = {}) {
  if (!snapshotPromise) {
    snapshotPromise = fetch(withBase('/summaries-v1.json'), {
      signal: options.signal
    })
      .then((response) => {
        if (!response.ok) throw new Error('摘要快照加载失败')
        return response.json()
      })
      .catch((error) => {
        snapshotPromise = null
        throw error
      })
  }
  return snapshotPromise
}

export async function loadSummaryV1(withBase, pagePath, options = {}) {
  const snapshot = await loadSummaryV1Snapshot(withBase, options)
  return findSummaryV1ByPath(snapshot, pagePath, options.base || '/')
}

export function summaryV1StatusText(result) {
  if (result?.status === 'short') return '本文较短，暂无独立 AI 摘要。'
  if (result?.status === 'excluded') return '本文未纳入 AI 摘要范围。'
  if (result?.status === 'error')
    return '本文摘要生成失败，将在后续构建自动重试。'
  return '本文暂无构建期摘要。'
}
