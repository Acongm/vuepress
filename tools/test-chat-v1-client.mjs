import test from 'node:test'
import assert from 'node:assert/strict'
import { parseSseStream } from '../docs/.vuepress/utils/chat-v1-stream.js'
import {
  loadChatHistory,
  modelHistory,
  saveChatHistory
} from '../docs/.vuepress/utils/chat-v1-history.js'
import {
  deriveTagOptions,
  insertChatTag
} from '../docs/.vuepress/utils/chat-v1-tags.js'

test('parses arbitrary SSE byte chunks', async () => {
  const encoder = new TextEncoder()
  const chunks = ['event: delta\nda', 'ta: {"type":"delta","content":"Hi"}\n\n', 'event: done\ndata: {"type":"done"}\n\n']
  const stream = new ReadableStream({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)))
      controller.close()
    }
  })
  const events = []
  for await (const event of parseSseStream(stream)) events.push(event)
  assert.deepEqual(events, [
    { type: 'delta', content: 'Hi' },
    { type: 'done' }
  ])
})

test('keeps newest 12 model messages and bounded persisted history', () => {
  const messages = Array.from({ length: 20 }, (_, index) => ({
    id: String(index),
    role: index % 2 ? 'assistant' : 'user',
    content: `message-${index}`
  }))
  assert.deepEqual(modelHistory(messages).map((item) => item.content), messages.slice(-12).map((item) => item.content))

  const memory = new Map()
  const storage = {
    getItem: (key) => memory.get(key) || null,
    setItem: (key, value) => memory.set(key, value)
  }
  saveChatHistory(storage, 'page', messages)
  assert.equal(loadChatHistory(storage, 'page').length, 20)
})

test('inserts editable natural-language tags and derives request options', () => {
  assert.equal(insertChatTag('', 'article'), '结合当前文章，')
  assert.equal(
    insertChatTag('请解释 Fiber', 'web'),
    '联网检索最新资料后，请解释 Fiber'
  )
  const prompt = insertChatTag(insertChatTag('', 'module'), 'web')
  assert.equal(prompt, '联网检索最新资料后，结合本模块，')
  assert.deepEqual(deriveTagOptions(prompt), {
    scope: 'module',
    enableWebSearch: true
  })
})
