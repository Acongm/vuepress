import { reactive } from 'vue'
import { extractPageContent } from './ai-context.js'
import {
  buildLocalFallbackSummary,
  shouldTryLiveSummary
} from './build-local-summary.js'
import {
  getCachedSummary,
  getPagePath,
  loadLiveSummary,
  loadStaticSummary,
  setCachedSummary
} from './summary-service.js'

const cache = reactive({})
const loading = reactive({})
const waiters = reactive({})
const typewriterShown = new Set()

export function hasShownSummaryTypewriter(pagePath) {
  return typewriterShown.has(pagePath)
}

export function markSummaryTypewriterShown(pagePath) {
  typewriterShown.add(pagePath)
}

export function clearSummarySession(pagePath) {
  delete cache[pagePath]
  delete loading[pagePath]
  delete waiters[pagePath]
  typewriterShown.delete(pagePath)
}

export function getPrefetchedSummary(pagePath) {
  return cache[pagePath] || null
}

export function isSummaryPrefetching(pagePath) {
  return Boolean(loading[pagePath])
}

export async function waitForPrefetch(pagePath) {
  if (cache[pagePath]) {
    return cache[pagePath]
  }

  if (!loading[pagePath]) {
    return null
  }

  return new Promise((resolve) => {
    const queue = waiters[pagePath] || []
    queue.push(resolve)
    waiters[pagePath] = queue
  })
}

function resolveWaiters(pagePath, result) {
  const queue = waiters[pagePath] || []
  queue.forEach((resolve) => resolve(result))
  delete waiters[pagePath]
}

async function resolveSummary(ctx, pagePath) {
  const cached = getCachedSummary(pagePath)
  if (cached) {
    return {
      summary: cached.summary,
      source: cached.source
    }
  }

  const staticSummary = await loadStaticSummary(ctx.$withBase, pagePath)
  if (staticSummary) {
    setCachedSummary(pagePath, staticSummary, 'static')
    return { summary: staticSummary, source: 'static' }
  }

  const localSummary = buildLocalFallbackSummary({
    title: ctx.$page?.title,
    tags: ctx.$page?.frontmatter?.tags || []
  })
  if (localSummary) {
    setCachedSummary(pagePath, localSummary, 'local')
    return { summary: localSummary, source: 'local' }
  }

  if (!shouldTryLiveSummary()) {
    return null
  }

  const content = extractPageContent()
  if (!content || content.length < 50) {
    return null
  }

  const liveSummary = await loadLiveSummary({
    pagePath,
    title: ctx.$page?.title,
    content
  })
  setCachedSummary(pagePath, liveSummary, 'live')
  return { summary: liveSummary, source: 'live' }
}

export async function prefetchPageSummary(ctx) {
  const pagePath = getPagePath(ctx.$page.path, ctx.$site.base || '/')

  if (cache[pagePath]) {
    return cache[pagePath]
  }

  if (loading[pagePath]) {
    return waitForPrefetch(pagePath)
  }

  loading[pagePath] = true

  try {
    const result = await resolveSummary(ctx, pagePath)
    if (result) {
      cache[pagePath] = result
    }
    resolveWaiters(pagePath, result)
    return result
  } catch (err) {
    console.error('预取摘要失败:', err)
    resolveWaiters(pagePath, null)
    return null
  } finally {
    loading[pagePath] = false
  }
}
