export const DEFAULT_AI_CHAT_V1_STREAM_API =
  'https://api.acongm.com/api/ai/v1/chat/stream'

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
  const response = await fetch(options.url || DEFAULT_AI_CHAT_V1_STREAM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: options.signal
  })
  if (!response.ok || !response.body) {
    throw new Error(`对话请求失败 (${response.status})`)
  }
  return parseSseStream(response.body)
}
