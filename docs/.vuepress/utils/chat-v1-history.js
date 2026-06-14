const MAX_STORED_MESSAGES = 40
const MAX_STORED_CHARS = 60000
const MAX_MODEL_MESSAGES = 12

function clean(messages) {
  return (Array.isArray(messages) ? messages : []).filter(
    (message) =>
      (message.role === 'user' || message.role === 'assistant') &&
      typeof message.content === 'string' &&
      message.content.trim()
  )
}

export function modelHistory(messages) {
  return clean(messages)
    .filter((message) => !message.isSummary && !message.isError)
    .slice(-MAX_MODEL_MESSAGES)
    .map(({ role, content }) => ({ role, content }))
}

export function saveChatHistory(storage, key, messages) {
  const selected = clean(messages).slice(-MAX_STORED_MESSAGES)
  const bounded = []
  let chars = 0
  for (let index = selected.length - 1; index >= 0; index -= 1) {
    const message = selected[index]
    if (chars + message.content.length > MAX_STORED_CHARS) break
    bounded.unshift({
      id: message.id,
      role: message.role,
      content: message.content,
      isSummary: Boolean(message.isSummary)
    })
    chars += message.content.length
  }
  storage?.setItem(`ai-chat-v1:${key}`, JSON.stringify(bounded))
}

export function loadChatHistory(storage, key) {
  try {
    return clean(JSON.parse(storage?.getItem(`ai-chat-v1:${key}`) || '[]'))
  } catch {
    return []
  }
}

export function clearChatHistory(storage, key) {
  storage?.removeItem?.(`ai-chat-v1:${key}`)
}
