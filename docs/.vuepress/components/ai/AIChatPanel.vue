<template>
  <div class="ai-chat-panel">
    <div class="ai-chat-panel__toolbar">
      <div class="ai-chat-panel__scope">
        <button
          type="button"
          class="ai-chat-panel__scope-btn"
          :class="{ 'is-active': scope === 'article' }"
          @click="scope = 'article'"
        >
          当前文章
        </button>
        <button
          type="button"
          class="ai-chat-panel__scope-btn"
          :class="{ 'is-active': scope === 'module' }"
          @click="scope = 'module'"
        >
          本模块
        </button>
      </div>

      <label class="ai-chat-panel__search">
        <input v-model="enableWebSearch" type="checkbox" />
        <span>联网检索</span>
      </label>
    </div>

    <div ref="messagesEl" class="ai-chat-panel__messages">
      <div
        v-if="summaryLoading"
        class="ai-chat-panel__message assistant"
      >
        <div class="ai-chat-panel__avatar">AI</div>
        <div class="ai-chat-panel__bubble typing">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
        </div>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="message.id"
        :class="['ai-chat-panel__message', message.role]"
      >
        <div class="ai-chat-panel__avatar">
          {{ message.role === 'user' ? '我' : 'AI' }}
        </div>
        <div class="ai-chat-panel__bubble">
          <p class="ai-chat-panel__text">
            <template v-if="message.role === 'assistant' && message.typing">
              {{ message.displayText }}<span class="ai-chat-panel__cursor">|</span>
            </template>
            <template v-else>{{ message.content }}</template>
          </p>

          <div
            v-if="message.sources?.length"
            class="ai-chat-panel__sources"
          >
            <p>参考来源</p>
            <a
              v-for="source in message.sources"
              :key="source.url || source.title"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ source.title || source.url }}
            </a>
          </div>
        </div>
      </div>

      <div v-if="chatLoading" class="ai-chat-panel__message assistant">
        <div class="ai-chat-panel__avatar">AI</div>
        <div class="ai-chat-panel__bubble typing">
          <span class="dot" />
          <span class="dot" />
          <span class="dot" />
        </div>
      </div>
    </div>

    <div class="ai-chat-panel__input">
      <textarea
        v-model="inputText"
        rows="2"
        :placeholder="inputPlaceholder"
        :disabled="chatLoading || summaryLoading"
        @keydown.enter.exact.prevent="sendMessage"
      />
      <button type="button" :disabled="!canSend" @click="sendMessage">
        发送
      </button>
    </div>
  </div>
</template>

<script>
import {
  buildChatContextPayload,
  buildSystemPrompt,
  extractPageContent
} from '../../utils/ai-context.js'
import { formatSummaryMessage } from '../../utils/format-summary-message.js'
import {
  getPrefetchedSummary,
  hasShownSummaryTypewriter,
  isSummaryPrefetching,
  markSummaryTypewriterShown,
  prefetchPageSummary,
  waitForPrefetch
} from '../../utils/summary-prefetch.js'
import {
  getAiChatApiUrl,
  getPagePath,
  sourceLabel
} from '../../utils/summary-service.js'
import {
  loadModuleIndex,
  resolveModuleFromPath
} from '../../utils/resolve-module.js'

const TYPEWRITER_INTERVAL_MS = 16
const TYPEWRITER_MAX_MS = 8000

export default {
  name: 'AIChatPanel',

  props: {
    active: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      scope: 'article',
      enableWebSearch: false,
      pageContext: '',
      moduleInfo: null,
      moduleDocs: [],
      messages: [],
      inputText: '',
      chatLoading: false,
      summaryLoading: false,
      typewriterTimer: null,
      typewriterIndex: null
    }
  },

  computed: {
    scopeLabel() {
      return this.scope === 'module' ? '本模块内容' : '当前文章内容'
    },

    inputPlaceholder() {
      return this.scope === 'module'
        ? '基于本模块提问…'
        : '基于当前文章提问…'
    },

    pageTags() {
      const tags = this.$page?.frontmatter?.tags
      return Array.isArray(tags) ? tags : []
    },

    isTyping() {
      return this.messages.some((message) => message.typing)
    },

    canSend() {
      return (
        Boolean(this.inputText.trim()) &&
        !this.chatLoading &&
        !this.summaryLoading &&
        Boolean(this.pageContext)
      )
    }
  },

  watch: {
    active: {
      immediate: true,
      handler(isActive) {
        if (isActive) {
          this.bootstrap()
        }
      }
    },

    '$page.path'() {
      this.resetConversation()
      if (this.active) {
        this.bootstrap()
      }
    },

    scope() {
      this.prepareContext()
    }
  },

  beforeUnmount() {
    this.clearTypewriter()
  },

  methods: {
    async bootstrap() {
      await this.prepareContext()
      if (this.messages.length === 0) {
        await this.loadSummaryAsFirstMessage()
      }
    },

    resetConversation() {
      this.clearTypewriter()
      this.messages = []
      this.inputText = ''
    },

    async prepareContext() {
      this.pageContext = extractPageContent()
      const pagePath = getPagePath(this.$page.path, this.$site.base || '/')
      const moduleIndex = await loadModuleIndex(this.$withBase)
      this.moduleInfo = resolveModuleFromPath(pagePath, moduleIndex)

      if (moduleIndex?.modules && this.moduleInfo) {
        this.moduleDocs = moduleIndex.modules[this.moduleInfo.key]?.files || []
      } else {
        this.moduleDocs = []
      }
    },

    async loadSummaryAsFirstMessage() {
      if (this.summaryLoading) {
        return
      }

      const pagePath = getPagePath(this.$page.path, this.$site.base || '/')
      let result = getPrefetchedSummary(pagePath)

      if (!result) {
        this.summaryLoading = true
      }

      try {
        if (!result && isSummaryPrefetching(pagePath)) {
          result = await waitForPrefetch(pagePath)
        }

        if (!result) {
          result = await prefetchPageSummary(this)
        }

        if (!result?.summary) {
          throw new Error('暂无可用摘要，请稍后重试')
        }

        this.presentSummaryMessage(result.summary, pagePath, result.source)
      } catch (err) {
        console.error('加载摘要失败:', err)
        this.messages.push({
          id: `summary-error-${Date.now()}`,
          role: 'assistant',
          content: err.message || '加载提炼内容失败，请稍后重试',
          displayText: err.message || '加载提炼内容失败，请稍后重试',
          typing: false
        })
        this.scrollToBottom()
      } finally {
        this.summaryLoading = false
      }
    },

    presentSummaryMessage(summaryData, pagePath, source) {
      const text = formatSummaryMessage(summaryData, sourceLabel(source))
      const showTypewriter =
        !hasShownSummaryTypewriter(pagePath) &&
        typeof document !== 'undefined' &&
        !document.hidden
      const messageIndex = this.messages.length

      this.messages.push({
        id: `summary-${pagePath}`,
        role: 'assistant',
        content: text,
        displayText: showTypewriter ? '' : text,
        typing: showTypewriter,
        isSummary: true
      })

      if (showTypewriter) {
        markSummaryTypewriterShown(pagePath)
        this.$nextTick(() => {
          this.startTypewriter(messageIndex)
          this.scrollToBottom()
        })
        return
      }

      this.scrollToBottom()
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
        typing: false
      })

      this.chatLoading = true
      this.scrollToBottom()

      try {
        const reply = await this.askAboutPage(question)
        const messageIndex = this.messages.length
        this.messages.push({
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply.content,
          displayText: '',
          typing: true,
          sources: reply.sources || []
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
          typing: false
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
            !message.isSummary &&
            !String(message.id).startsWith('summary-')
        )
        .map((message) => ({
          role: message.role,
          content: message.content
        }))

      const pagePath = getPagePath(this.$page.path, this.$site.base || '/')
      const systemPrompt = buildSystemPrompt({
        title: this.$page?.title || '当前文档',
        pagePath,
        tags: this.pageTags,
        pageContent: this.pageContext || extractPageContent(),
        scope: this.scope,
        moduleInfo: this.moduleInfo,
        moduleDocs: this.moduleDocs,
        enableWebSearch: this.enableWebSearch
      })

      const payload = {
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        context: buildChatContextPayload({
          scope: this.scope,
          pagePath,
          moduleInfo: this.moduleInfo,
          title: this.$page?.title || '当前文档',
          tags: this.pageTags
        }),
        enableWebSearch: this.enableWebSearch
      }

      let response
      try {
        response = await fetch(getAiChatApiUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch {
        throw new Error('网络请求失败，请刷新页面后重试')
      }

      if (!response.ok) {
        let message = '对话请求失败'
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
      return {
        content:
          data.message || data.choices?.[0]?.message?.content || '暂无回复',
        sources: data.sources || []
      }
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
      const startedAt = Date.now()

      this.typewriterTimer = setInterval(() => {
        if (Date.now() - startedAt > TYPEWRITER_MAX_MS) {
          this.clearTypewriter()
          return
        }

        cursor += 1
        message.displayText = fullText.slice(0, cursor)
        this.scrollToBottom()

        if (cursor >= fullText.length) {
          this.clearTypewriter()
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
    }
  }
}
</script>

<style scoped>
.ai-chat-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 12px 16px 16px;
  background: #fff;
}

.ai-chat-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.ai-chat-panel__scope {
  display: inline-flex;
  padding: 2px;
  border-radius: 4px;
  background: #f0f2f8;
}

.ai-chat-panel__scope-btn {
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.ai-chat-panel__scope-btn.is-active {
  background: #fff;
  color: #4a56a6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.ai-chat-panel__search {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #5f6368;
}

.ai-chat-panel__messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

.ai-chat-panel__message {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.ai-chat-panel__message.user {
  flex-direction: row-reverse;
}

.ai-chat-panel__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #667eea;
  color: #fff;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-chat-panel__message.user .ai-chat-panel__avatar {
  background: #4caf50;
}

.ai-chat-panel__bubble {
  max-width: calc(100% - 40px);
  padding: 10px 12px;
  border-radius: 4px;
  background: #f5f7fb;
  box-shadow: none;
  border: 1px solid #e8ecf3;
}

.ai-chat-panel__message.user .ai-chat-panel__bubble {
  background: #667eea;
  color: #fff;
  border-color: transparent;
}

.ai-chat-panel__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.ai-chat-panel__cursor {
  animation: ai-blink 0.8s step-end infinite;
}

.ai-chat-panel__sources {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #edf0f5;
  font-size: 12px;
}

.ai-chat-panel__sources p {
  margin: 0 0 4px;
  color: #7b8190;
}

.ai-chat-panel__sources a {
  display: block;
  color: #4a56a6;
  text-decoration: none;
  margin-top: 2px;
}

.ai-chat-panel__bubble.typing {
  display: flex;
  gap: 4px;
}

.ai-chat-panel__bubble.typing .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
  animation: ai-bounce 1.2s infinite ease-in-out;
}

.ai-chat-panel__bubble.typing .dot:nth-child(2) {
  animation-delay: 0.15s;
}

.ai-chat-panel__bubble.typing .dot:nth-child(3) {
  animation-delay: 0.3s;
}

.ai-chat-panel__input {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-shrink: 0;
}

.ai-chat-panel__input textarea {
  flex: 1;
  resize: none;
  border: 1px solid #dfe3eb;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
}

.ai-chat-panel__input button {
  border: none;
  border-radius: 4px;
  padding: 0 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  cursor: pointer;
}

.ai-chat-panel__input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes ai-blink {
  50% {
    opacity: 0;
  }
}

@keyframes ai-bounce {
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
</style>
