/* global __AI_CHAT_API__ */

import { buildChatHeaders } from './chat-client.js'

export const DEFAULT_AI_CHAT_V1_STREAM_API =
  'https://api.acongm.com/api/ai/v1/chat/stream'
export const DEV_AI_CHAT_V1_STREAM_API = '/api/ai/v1/chat/stream'

function prefersDevProxy() {
  if (typeof window === 'undefined') return false
  const { hostname } = window.location
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
  )
}

function normalizeChatStreamPath(configured) {
  if (/\/api\/ai\/v1\/chat\/stream\/?$/.test(configured)) return configured
  return configured.replace(/\/api\/ai\/chat\/?$/, '/api/ai/v1/chat/stream')
}

export function getAiChatV1StreamUrl() {
  const configured =
    typeof __AI_CHAT_API__ !== 'undefined' ? String(__AI_CHAT_API__).trim() : ''

  if (prefersDevProxy() && /^https?:\/\//i.test(configured)) {
    return DEV_AI_CHAT_V1_STREAM_API
  }

  if (configured.startsWith('/')) {
    return normalizeChatStreamPath(configured)
  }
  if (!/^https?:\/\//i.test(configured)) {
    return prefersDevProxy()
      ? DEV_AI_CHAT_V1_STREAM_API
      : DEFAULT_AI_CHAT_V1_STREAM_API
  }
  return normalizeChatStreamPath(configured)
}

export async function* parseSseStream(stream) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const frames = buffer.split(/\r?\n\r?\n/)
    buffer = frames.pop() || ''
    for (const frame of frames) {
      const data = frame
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart())
        .join('\n')
      if (!data) continue
      try {
        yield JSON.parse(data)
      } catch {
        // Ignore malformed provider frames; a later error/done frame can recover.
      }
    }
    if (done) break
  }
}

export async function streamChatV1(payload, options = {}) {
  const pagePath = payload?.context?.pagePath ?? '/'
  const callSource = options.callSource || 'vuepress:reading-assistant'
  const response = await fetch(options.url || getAiChatV1StreamUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...buildChatHeaders({ pagePath, callSource })
    },
    body: JSON.stringify(payload),
    signal: options.signal
  })
  if (!response.ok || !response.body) {
    throw new Error(`对话请求失败 (${response.status})`)
  }
  return parseSseStream(response.body)
}
