/* global __AI_SUMMARY_API__, __AI_CHAT_API__ */

import { normalizeSummaryData } from './normalize-summary.js'

export const DEFAULT_AI_SUMMARY_API = 'https://api.acongm.com/api/ai/summary'
export const DEFAULT_AI_CHAT_API = 'https://api.acongm.com/api/ai/chat'
export const LIVE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
export const STATIC_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000

function normalizeApiUrl(url, fallback) {
  const cleaned = String(url || '')
    .trim()
    .replace(/^['"]+|['"]+$/g, '')

  if (/^https?:\/\//i.test(cleaned)) {
    return cleaned
  }

  return fallback
}

export function getAiSummaryApiUrl() {
  const configured =
    typeof __AI_SUMMARY_API__ !== 'undefined' && __AI_SUMMARY_API__
      ? __AI_SUMMARY_API__
      : ''

  return normalizeApiUrl(configured, DEFAULT_AI_SUMMARY_API)
}

export function getAiChatApiUrl() {
  const configured =
    typeof __AI_CHAT_API__ !== 'undefined' && __AI_CHAT_API__
      ? __AI_CHAT_API__
      : ''

  return normalizeApiUrl(configured, DEFAULT_AI_CHAT_API)
}

export function getPagePath(pagePath, base = '/') {
  let path = pagePath
  if (base !== '/' && path.startsWith(base)) {
    path = path.slice(base.length - 1)
  }
  if (path.endsWith('.html')) {
    path = path.replace(/\.html$/, '.md')
  }
  if (!path.endsWith('.md') && !path.endsWith('/')) {
    path = `${path}.md`
  }
  if (path.endsWith('/')) {
    path = `${path}index.md`
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return path
}

export function findSummaryByPath(summaries, pagePath) {
  const variations = [
    pagePath,
    pagePath.replace(/\.md$/, '.html'),
    pagePath.replace(/^\//, ''),
    pagePath.replace(/\.md$/, ''),
    pagePath.replace(/\/index\.md$/, '/README.md'),
    pagePath.replace(/\/index\.md$/, '/')
  ]

  for (const variant of variations) {
    if (summaries[variant]) {
      return normalizeSummaryData(summaries[variant])
    }
  }

  return null
}

export function getCachedSummary(path) {
  const key = `ai-summary:${path}`
  const cached = localStorage.getItem(key)

  if (!cached) {
    return null
  }

  try {
    const data = JSON.parse(cached)
    const ttl = data.source === 'live' ? LIVE_CACHE_TTL_MS : STATIC_CACHE_TTL_MS
    if (Date.now() - data.timestamp < ttl) {
      return {
        summary: normalizeSummaryData(data.summary),
        source: data.source === 'live' ? 'live' : 'cache'
      }
    }
  } catch {
    // ignore
  }

  return null
}

export function setCachedSummary(path, summary, source = 'static') {
  localStorage.setItem(
    `ai-summary:${path}`,
    JSON.stringify({
      summary,
      source,
      timestamp: Date.now()
    })
  )
}

export async function loadStaticSummary(withBase, pagePath) {
  const response = await fetch(withBase('/summaries.json'))
  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return findSummaryByPath(data.summaries || {}, pagePath)
}

export async function loadLiveSummary(options) {
  const response = await fetch(getAiSummaryApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: options.pagePath,
      title: options.title,
      content: options.content
    })
  })

  if (!response.ok) {
    let message = '实时摘要请求失败'
    try {
      const errorBody = await response.json()
      if (errorBody?.message) {
        message = Array.isArray(errorBody.message)
          ? errorBody.message.join(', ')
          : errorBody.message
      }
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  const data = await response.json()
  return normalizeSummaryData(data)
}

export function sourceLabel(source) {
  if (source === 'live') {
    return '实时生成'
  }
  if (source === 'local') {
    return '页面提取'
  }
  if (source === 'cache') {
    return '本地缓存'
  }
  return 'CI 预生成'
}
