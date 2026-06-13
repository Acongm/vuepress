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
const errors = reactive({})
const status = reactive({})
const waiters = reactive({})
const abortControllers = reactive({})
const typewriterShown = new Set()

export function hasShownSummaryTypewriter(pagePath) {
  return typewriterShown.has(pagePath)
}

export function markSummaryTypewriterShown(pagePath) {
  typewriterShown.add(pagePath)
}

export function getPrefetchedSummary(pagePath) {
  return cache[pagePath] || null
}

export function getPrefetchStatus(pagePath) {
  if (cache[pagePath]) {
    return 'ready'
  }
  if (errors[pagePath]) {
    return 'error'
  }
  if (loading[pagePath]) {
    return 'loading'
  }
  return status[pagePath] || 'idle'
}

export function getPrefetchError(pagePath) {
  return errors[pagePath] || null
}

export function isSummaryPrefetching(pagePath) {
  return Boolean(loading[pagePath])
}

export function cancelPrefetch(pagePath) {
  const controller = abortControllers[pagePath]
  if (controller) {
    controller.abort()
    delete abortControllers[pagePath]
  }
}

export function clearSummarySession(pagePath) {
  cancelPrefetch(pagePath)
  delete cache[pagePath]
  delete loading[pagePath]
  delete errors[pagePath]
  delete status[pagePath]
  delete waiters[pagePath]
  typewriterShown.delete(pagePath)
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

async function resolveSummary(ctx, pagePath, signal) {
  const cached = getCachedSummary(pagePath)
  if (cached) {
    return {
      summary: cached.summary,
      source: cached.source
    }
  }

  const staticSummary = await loadStaticSummary(ctx.$withBase, pagePath, {
    signal
  })
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
    content,
    signal
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

  cancelPrefetch(pagePath)
  const controller = new AbortController()
  abortControllers[pagePath] = controller
  loading[pagePath] = true
  delete errors[pagePath]
  status[pagePath] = 'loading'

  try {
    const result = await resolveSummary(ctx, pagePath, controller.signal)
    if (result) {
      cache[pagePath] = result
      status[pagePath] = 'ready'
    } else {
      errors[pagePath] = '暂无可用摘要'
      status[pagePath] = 'error'
    }
    resolveWaiters(pagePath, result)
    return result
  } catch (err) {
    if (err?.name === 'AbortError') {
      resolveWaiters(pagePath, null)
      return null
    }

    const message = err?.message || '预取摘要失败'
    console.error('预取摘要失败:', err)
    errors[pagePath] = message
    status[pagePath] = 'error'
    resolveWaiters(pagePath, null)
    return null
  } finally {
    loading[pagePath] = false
    delete abortControllers[pagePath]
  }
}

export function retryPrefetch(ctx) {
  const pagePath = getPagePath(ctx.$page.path, ctx.$site.base || '/')
  delete cache[pagePath]
  delete errors[pagePath]
  status[pagePath] = 'idle'
  return prefetchPageSummary(ctx)
}
