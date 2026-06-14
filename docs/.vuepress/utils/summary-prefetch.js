import { reactive } from 'vue'
import { getPagePath } from './summary-service.js'
import { loadSummaryV1, summaryV1StatusText } from './summary-v1-service.js'

const cache = reactive({})
const loading = reactive({})
const errors = reactive({})
const waiters = reactive({})
const abortControllers = reactive({})
const typewriterShown = new Set()

export const hasShownSummaryTypewriter = (path) => typewriterShown.has(path)
export const markSummaryTypewriterShown = (path) => typewriterShown.add(path)
export const getPrefetchedSummary = (path) => cache[path] || null
export const getPrefetchError = (path) => errors[path] || null
export const isSummaryPrefetching = (path) => Boolean(loading[path])

export function getPrefetchStatus(path) {
  if (cache[path]) return cache[path].status === 'success' ? 'ready' : 'empty'
  if (errors[path]) return 'error'
  return loading[path] ? 'loading' : 'idle'
}

export function cancelPrefetch(path) {
  abortControllers[path]?.abort()
  delete abortControllers[path]
}

export function clearSummarySession(path) {
  cancelPrefetch(path)
  delete cache[path]
  delete loading[path]
  delete errors[path]
  delete waiters[path]
  typewriterShown.delete(path)
}

export function waitForPrefetch(path) {
  if (cache[path]) return Promise.resolve(cache[path])
  if (!loading[path]) return Promise.resolve(null)
  return new Promise((resolve) => {
    waiters[path] = [...(waiters[path] || []), resolve]
  })
}

function finish(path, result) {
  for (const resolve of waiters[path] || []) resolve(result)
  delete waiters[path]
}

export async function prefetchPageSummary(ctx) {
  const path = getPagePath(ctx.$page.path, ctx.$site.base || '/')
  if (cache[path]) return cache[path]
  if (loading[path]) return waitForPrefetch(path)

  const controller = new AbortController()
  abortControllers[path] = controller
  loading[path] = true
  delete errors[path]
  try {
    const result = await loadSummaryV1(ctx.$withBase, path, {
      signal: controller.signal,
      base: ctx.$site.base || '/'
    })
    cache[path] = result
    if (result.status !== 'success') errors[path] = summaryV1StatusText(result)
    finish(path, result)
    return result
  } catch (error) {
    if (error?.name !== 'AbortError') {
      errors[path] = error?.message || '摘要快照加载失败'
    }
    finish(path, null)
    return null
  } finally {
    loading[path] = false
    delete abortControllers[path]
  }
}

export function retryPrefetch(ctx) {
  const path = getPagePath(ctx.$page.path, ctx.$site.base || '/')
  delete cache[path]
  delete errors[path]
  return prefetchPageSummary(ctx)
}
