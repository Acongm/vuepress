<template>
  <Transition name="fade">
    <div v-if="shouldShow" class="ai-summary-wrapper">
      <Transition name="scale">
        <button
          v-if="!showPanel"
          class="ai-summary-btn"
          title="AI 内容提炼"
          @click="togglePanel"
        >
          <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span class="btn-text">AI 提炼</span>
        </button>
      </Transition>

      <Transition name="slide-panel">
        <aside v-if="showPanel" class="summary-panel" aria-label="AI 内容提炼对话">
          <div class="panel-header">
            <h3>
              <svg class="header-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
              AI 内容提炼
            </h3>
            <button class="close-btn" title="关闭" @click="togglePanel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div ref="messagesEl" class="panel-body chat-messages">
            <div v-if="loading && messages.length === 0" class="loading-state">
              <div class="spinner" />
              <p>{{ loadingMessage }}</p>
            </div>

            <div v-else-if="error && messages.length === 0" class="error-state">
              <p>{{ error }}</p>
              <button class="retry-btn" @click="loadSummary">重试</button>
            </div>

            <template v-else>
              <div
                v-for="(message, index) in messages"
                :key="message.id"
                :class="['chat-message', message.role]"
              >
                <div class="message-avatar">
                  {{ message.role === 'user' ? '我' : 'AI' }}
                </div>
                <div class="message-bubble">
                  <p class="message-text">
                    <template v-if="message.role === 'assistant' && message.typing">
                      {{ message.displayText }}<span class="typewriter-cursor">|</span>
                    </template>
                    <template v-else>{{ message.content }}</template>
                  </p>
                </div>
              </div>

              <div v-if="chatLoading" class="chat-message assistant">
                <div class="message-avatar">AI</div>
                <div class="message-bubble typing-bubble">
                  <span class="typing-dot" />
                  <span class="typing-dot" />
                  <span class="typing-dot" />
                </div>
              </div>
            </template>
          </div>

          <div class="chat-input-bar">
            <textarea
              ref="inputEl"
              v-model="inputText"
              class="chat-input"
              rows="1"
              placeholder="基于当前页面提问…"
              :disabled="loading || chatLoading || isTyping"
              @keydown.enter.exact.prevent="sendMessage"
            />
            <button
              class="send-btn"
              :disabled="!canSend"
              title="发送"
              @click="sendMessage"
            >
              发送
            </button>
          </div>
        </aside>
      </Transition>
    </div>
  </Transition>
</template>

<script>
/* global __AI_SUMMARY_API__, __AI_CHAT_API__ */

const DEFAULT_AI_SUMMARY_API = 'https://api.acongm.com/api/ai/summary'
const DEFAULT_AI_CHAT_API = 'https://api.acongm.com/api/ai/chat'
const LIVE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const STATIC_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const TYPEWRITER_INTERVAL_MS = 16

function getAiSummaryApiUrl() {
  if (typeof __AI_SUMMARY_API__ !== 'undefined' && __AI_SUMMARY_API__) {
    return __AI_SUMMARY_API__
  }
  return DEFAULT_AI_SUMMARY_API
}

function getAiChatApiUrl() {
  if (typeof __AI_CHAT_API__ !== 'undefined' && __AI_CHAT_API__) {
    return __AI_CHAT_API__
  }
  return DEFAULT_AI_CHAT_API
}

export default {
  name: 'AISummaryButton',

  data() {
    return {
      showPanel: false,
      loading: false,
      chatLoading: false,
      loadingMessage: '正在加载提炼内容…',
      summaryData: null,
      error: null,
      isEnhanced: false,
      pageContext: '',
      messages: [],
      inputText: '',
      typewriterTimer: null,
      typewriterIndex: null,
    }
  },

  computed: {
    shouldShow() {
      return this.$page && this.$page.path && this.$page.path.endsWith('.html')
    },

    isTyping() {
      return this.messages.some((message) => message.typing)
    },

    canSend() {
      return (
        Boolean(this.inputText.trim()) &&
        !this.loading &&
        !this.chatLoading &&
        !this.isTyping &&
        Boolean(this.pageContext)
      )
    },
  },

  mounted() {
    const panelState = sessionStorage.getItem('aiSummaryPanelOpen')
    if (panelState === 'true') {
      this.showPanel = true
      this.loadSummary()
    }
  },

  beforeUnmount() {
    this.clearTypewriter()
  },

  methods: {
    togglePanel() {
      this.showPanel = !this.showPanel
      sessionStorage.setItem('aiSummaryPanelOpen', this.showPanel)

      if (this.showPanel) {
        this.pageContext = this.extractPageContent()
        if (!this.summaryData && !this.loading && !this.error) {
          this.loadSummary()
        }
      }
    },

    async loadSummary() {
      this.loading = true
      this.loadingMessage = '正在加载提炼内容…'
      this.error = null
      this.pageContext = this.extractPageContent()

      try {
        const pagePath = this.getPagePath()

        const cached = this.getCachedSummary(pagePath)
        if (cached) {
          this.presentSummary(cached, pagePath, 'static')
          return
        }

        const staticSummary = await this.loadStaticSummary(pagePath)
        if (staticSummary) {
          this.presentSummary(staticSummary, pagePath, 'static')
          return
        }

        this.loadingMessage = '正在实时分析页面…'
        const liveSummary = await this.loadLiveSummary(pagePath)
        this.presentSummary(liveSummary, pagePath, 'live')
      } catch (err) {
        console.error('加载摘要失败:', err)
        this.error = err.message || '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },

    presentSummary(summaryData, pagePath, source) {
      this.summaryData = summaryData
      this.checkIfEnhanced()
      this.setCachedSummary(pagePath, summaryData, source)

      const content = this.formatSummaryMessage(summaryData)
      this.messages = [
        {
          id: `summary-${Date.now()}`,
          role: 'assistant',
          content,
          displayText: '',
          typing: true,
        },
      ]

      this.$nextTick(() => {
        this.startTypewriter(0)
        this.scrollToBottom()
      })
    },

    formatSummaryMessage(data) {
      if (typeof data === 'string') {
        return `📋 内容提炼\n\n${data}`
      }

      const lines = ['📋 内容提炼', '', data.summary || '暂无摘要']

      if (data.keyPoints?.length) {
        lines.push('', '💡 核心要点')
        data.keyPoints.forEach((point) => lines.push(`• ${point}`))
      }

      if (data.keywords?.length) {
        lines.push('', `🔑 关键词：${data.keywords.join('、')}`)
      }

      if (data.techStack?.length) {
        lines.push(`🛠️ 技术栈：${data.techStack.join('、')}`)
      }

      if (data.difficulty || data.contentType) {
        const meta = [data.difficulty, data.contentType].filter(Boolean).join(' · ')
        lines.push('', `📌 ${meta}`)
      }

      lines.push('', '—', '你可以继续提问，我会结合当前页面内容回答。')
      return lines.join('\n')
    },

    async sendMessage() {
      const question = this.inputText.trim()
      if (!question || !this.canSend) {
        return
      }

      this.inputText = ''
      this.messages.push({
        id: `user-${Date.now()}`,
        role: 'user',
        content: question,
        displayText: question,
        typing: false,
      })

      this.chatLoading = true
      this.scrollToBottom()

      try {
        const reply = await this.askAboutPage(question)
        const messageIndex = this.messages.length
        this.messages.push({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          displayText: '',
          typing: true,
        })

        this.$nextTick(() => {
          this.startTypewriter(messageIndex)
          this.scrollToBottom()
        })
      } catch (err) {
        this.messages.push({
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: err.message || '回答失败，请稍后重试',
          displayText: err.message || '回答失败，请稍后重试',
          typing: false,
        })
        this.scrollToBottom()
      } finally {
        this.chatLoading = false
      }
    },

    async askAboutPage(question) {
      const history = this.messages
        .filter(
          (message) =>
            !message.typing &&
            message.content &&
            !String(message.id).startsWith('summary-'),
        )
        .map((message) => ({
          role: message.role,
          content: message.content,
        }))

      const response = await fetch(getAiChatApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: this.buildSystemPrompt(),
            },
            ...history,
          ],
        }),
      })

      if (!response.ok) {
        let message = '对话请求失败'
        try {
          const errorBody = await response.json()
          if (errorBody?.message) {
            message = Array.isArray(errorBody.message)
              ? errorBody.message.join(', ')
              : errorBody.message
          }
        } catch (e) {
          // ignore
        }
        throw new Error(message)
      }

      const data = await response.json()
      return data.message || data.choices?.[0]?.message?.content || '暂无回复'
    },

    buildSystemPrompt() {
      const title = this.$page?.title || '当前文档'
      return [
        '你是当前文档页面的 AI 助手。请基于提供的文档内容回答用户问题，回答简洁、准确、有条理。',
        '如果问题与文档关系不大，请简要说明并尽量关联文档内容。',
        '',
        `文档标题：${title}`,
        '文档内容：',
        this.pageContext || this.extractPageContent(),
      ].join('\n')
    },

    startTypewriter(messageIndex) {
      const message = this.messages[messageIndex]
      if (!message || message.role !== 'assistant') {
        return
      }

      this.clearTypewriter()
      this.typewriterIndex = messageIndex
      message.typing = true
      message.displayText = ''

      let cursor = 0
      const fullText = message.content

      this.typewriterTimer = setInterval(() => {
        cursor += 1
        message.displayText = fullText.slice(0, cursor)
        this.scrollToBottom()

        if (cursor >= fullText.length) {
          this.clearTypewriter()
          message.typing = false
          message.displayText = fullText
        }
      }, TYPEWRITER_INTERVAL_MS)
    },

    clearTypewriter() {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer)
        this.typewriterTimer = null
      }

      if (this.typewriterIndex !== null) {
        const message = this.messages[this.typewriterIndex]
        if (message) {
          message.typing = false
          message.displayText = message.content
        }
        this.typewriterIndex = null
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesEl
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    extractPageContent() {
      const selectors = ['.theme-default-content', '.page-content', '.page']
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element && element.innerText) {
          return element.innerText.replace(/\s+/g, ' ').trim().slice(0, 8000)
        }
      }
      return ''
    },

    async loadStaticSummary(pagePath) {
      const summariesUrl = this.$withBase('/summaries.json')
      const response = await fetch(summariesUrl)
      if (!response.ok) {
        return null
      }

      const data = await response.json()
      this.isEnhanced = Boolean(data._meta?.enhanced)
      return this.findSummaryByPath(data.summaries || {}, pagePath)
    },

    async loadLiveSummary(pagePath) {
      const content = this.pageContext || this.extractPageContent()
      if (!content || content.length < 50) {
        throw new Error('页面内容太短，无法生成摘要')
      }

      const response = await fetch(getAiSummaryApiUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pagePath,
          title: this.$page.title,
          content,
        }),
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
        } catch (e) {
          // ignore
        }
        throw new Error(message)
      }

      return response.json()
    },

    checkIfEnhanced() {
      this.isEnhanced = Boolean(
        typeof this.summaryData === 'object' && this.summaryData.summary,
      )
    },

    getPagePath() {
      let path = this.$page.path
      const base = this.$site.base || '/'
      if (base !== '/' && path.startsWith(base)) {
        path = path.slice(base.length - 1)
      }
      if (path.endsWith('.html')) {
        path = path.replace(/\.html$/, '.md')
      }
      return path
    },

    findSummaryByPath(summaries, pagePath) {
      const variations = [
        pagePath,
        pagePath.replace(/\.md$/, '.html'),
        pagePath.replace(/^\//, ''),
        pagePath.replace(/\.md$/, ''),
      ]

      if (pagePath.endsWith('/index.md')) {
        const dirPath = pagePath.replace(/\/index\.md$/, '')
        variations.push(`${dirPath}/README.md`)
      }

      for (const variant of variations) {
        if (summaries[variant]) {
          return summaries[variant]
        }
      }

      return null
    },

    getCachedSummary(path) {
      const key = `ai-summary:${path}`
      const cached = localStorage.getItem(key)

      if (cached) {
        try {
          const data = JSON.parse(cached)
          const ttl = data.source === 'live' ? LIVE_CACHE_TTL_MS : STATIC_CACHE_TTL_MS
          if (Date.now() - data.timestamp < ttl) {
            return data.summary
          }
        } catch (e) {
          // ignore
        }
      }

      return null
    },

    setCachedSummary(path, summary, source = 'static') {
      localStorage.setItem(
        `ai-summary:${path}`,
        JSON.stringify({
          summary,
          source,
          timestamp: Date.now(),
        }),
      )
    },
  },
}
</script>

<style scoped>
.ai-summary-wrapper {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 999;
}

.ai-summary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 28px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-summary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.ai-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.summary-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 100vw;
  height: 100vh;
  background: #fff;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  width: 20px;
  height: 20px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

.panel-body.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.chat-message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-message.user .message-avatar {
  background: #4caf50;
}

.message-bubble {
  max-width: calc(100% - 48px);
  padding: 12px 14px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.chat-message.user .message-bubble {
  background: #667eea;
  color: #fff;
}

.message-text {
  margin: 0;
  line-height: 1.7;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.typewriter-cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 0.8s step-end infinite;
  color: #667eea;
}

.chat-message.user .typewriter-cursor {
  color: #fff;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 24px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  animation: bounce 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.chat-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e8ebf0;
  background: #fff;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  resize: none;
  border: 1px solid #dfe3eb;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  font-family: inherit;
  min-height: 42px;
  max-height: 120px;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.send-btn {
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 48px 16px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  border: 3px solid #eef0f5;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .ai-summary-wrapper {
    bottom: 60px;
    right: 16px;
  }

  .summary-panel {
    width: 100vw;
  }

  .btn-text {
    display: none;
  }
}
</style>
