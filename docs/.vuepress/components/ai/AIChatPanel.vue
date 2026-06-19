<template>
  <section class="ai-chat-panel">
    <div ref="messagesEl" class="ai-chat-panel__messages" aria-live="polite">
      <article v-if="summaryLoading" class="ai-summary-card is-loading">
        <span class="ai-summary-card__eyebrow">构建期 AI 提炼</span>
        <p>正在读取静态摘要…</p>
      </article>

      <article
        v-for="message in messages"
        :key="message.id"
        :class="[
          message.isSummary ? 'ai-summary-card' : 'ai-chat-message',
          `is-${message.role}`,
          { 'is-error': message.isError }
        ]"
      >
        <template v-if="message.isSummary">
          <span class="ai-summary-card__eyebrow">构建期 AI 提炼</span>
          <p class="ai-summary-card__content">{{ message.content }}</p>
        </template>
        <template v-else>
          <div class="ai-chat-message__meta">
            <span>{{ message.role === 'user' ? '你' : 'AI' }}</span>
            <button
              v-if="message.role === 'assistant' && message.content"
              type="button"
              @click="copyMessage(message.content)"
            >
              复制
            </button>
          </div>
          <p>
            {{ message.content
            }}<span v-if="message.streaming" class="ai-chat-cursor" />
          </p>
        </template>
      </article>
    </div>

    <footer class="ai-chat-composer">
      <div class="ai-chat-composer__topline">
        <div class="ai-chat-quick-tags" aria-label="提问快捷选项">
          <button
            v-for="tag in quickTags"
            :key="tag.key"
            type="button"
            @click="applyQuickTag(tag.key)"
          >
            + {{ tag.label }}
          </button>
        </div>
        <button type="button" class="ai-chat-clear" @click="clearConversation">
          清空
        </button>
      </div>

      <div class="ai-chat-composer__box">
        <textarea
          ref="inputEl"
          v-model="inputText"
          rows="2"
          placeholder="结合文档提问，快捷选项可继续编辑…"
          @keydown.enter.exact.prevent="sendMessage()"
        />
        <button
          v-if="chatLoading"
          type="button"
          class="is-stop"
          @click="stopGeneration"
        >
          停止
        </button>
        <button
          v-else
          type="button"
          :disabled="!inputText.trim()"
          @click="sendMessage()"
        >
          发送
        </button>
      </div>

      <div
        v-if="lastFailedQuestion || lastCompletedQuestion"
        class="ai-chat-composer__actions"
      >
        <button v-if="lastFailedQuestion" type="button" @click="retryLast">
          重试
        </button>
        <button
          v-if="lastCompletedQuestion"
          type="button"
          @click="regenerateLast"
        >
          重新生成
        </button>
      </div>
      <p class="ai-chat-composer__hint">
        仅发送消息时调用 AI 接口；页面摘要来自构建缓存。
      </p>
    </footer>
  </section>
</template>

<script>
import { extractPageContent } from '../../utils/ai-context.js'
import { resolveCallSource } from '../../utils/chat-client.js'
import {
  clearChatHistory,
  loadChatHistory,
  modelHistory,
  saveChatHistory
} from '../../utils/chat-v1-history.js'
import { streamChatV1 } from '../../utils/chat-v1-stream.js'
import {
  CHAT_V1_TAGS,
  deriveTagOptions,
  insertChatTag
} from '../../utils/chat-v1-tags.js'
import { formatSummaryMessage } from '../../utils/format-summary-message.js'
import {
  getPrefetchedSummary,
  getPrefetchError,
  isSummaryPrefetching,
  prefetchPageSummary,
  waitForPrefetch
} from '../../utils/summary-prefetch.js'
import { getPagePath, sourceLabel } from '../../utils/summary-service.js'
import { summaryV1StatusText } from '../../utils/summary-v1-service.js'
import {
  loadModuleIndex,
  resolveModuleFromPath
} from '../../utils/resolve-module.js'

export default {
  name: 'AIChatPanel',
  props: { active: { type: Boolean, default: false } },
  data() {
    return {
      quickTags: CHAT_V1_TAGS,
      messages: [],
      inputText: '',
      pageContext: '',
      moduleInfo: null,
      moduleDocs: [],
      summaryLoading: false,
      chatLoading: false,
      chatAbortController: null,
      lastFailedQuestion: '',
      lastCompletedQuestion: ''
    }
  },
  computed: {
    pagePath() {
      return getPagePath(this.$page.path, this.$site.base || '/')
    },
    pageTags() {
      return Array.isArray(this.$page?.frontmatter?.tags)
        ? this.$page.frontmatter.tags
        : []
    }
  },
  watch: {
    active: {
      immediate: true,
      handler(value) {
        if (value) this.bootstrap()
      }
    },
    '$page.path'() {
      this.stopGeneration()
      this.messages = []
      this.inputText = ''
      if (this.active) this.bootstrap()
    }
  },
  beforeUnmount() {
    this.stopGeneration()
  },
  methods: {
    async bootstrap() {
      this.pageContext = extractPageContent()
      const index = await loadModuleIndex(this.$withBase)
      this.moduleInfo = resolveModuleFromPath(this.pagePath, index)
      this.moduleDocs = this.moduleInfo
        ? index?.modules?.[this.moduleInfo.key]?.files || []
        : []
      if (!this.messages.length && typeof sessionStorage !== 'undefined') {
        this.messages = loadChatHistory(sessionStorage, this.pagePath)
      }
      if (!this.messages.some((message) => message.isSummary)) {
        await this.loadBuildSummary()
      }
      this.scrollToBottom()
    },
    async loadBuildSummary() {
      this.summaryLoading = true
      let result = getPrefetchedSummary(this.pagePath)
      if (!result && isSummaryPrefetching(this.pagePath)) {
        result = await waitForPrefetch(this.pagePath)
      }
      if (!result) result = await prefetchPageSummary(this)
      const prefetchError = getPrefetchError(this.pagePath)
      const content = result?.summary
        ? formatSummaryMessage(result.summary, sourceLabel('static'))
        : result
        ? summaryV1StatusText(result)
        : prefetchError || summaryV1StatusText(null, { snapshotMissing: true })
      this.messages.unshift({
        id: `summary-${this.pagePath}`,
        role: 'assistant',
        content,
        isSummary: true
      })
      this.summaryLoading = false
      this.persist()
    },
    applyQuickTag(key) {
      this.inputText = insertChatTag(this.inputText, key)
      this.$nextTick(() => this.$refs.inputEl?.focus())
    },
    async sendMessage(questionOverride = '', options = {}) {
      const question = String(questionOverride || this.inputText).trim()
      if (!question || this.chatLoading) return
      if (!options.reuseUserMessage) {
        this.messages.push({
          id: `user-${Date.now()}`,
          role: 'user',
          content: question
        })
      }
      this.inputText = ''
      this.lastFailedQuestion = ''
      const answer = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        streaming: true
      }
      this.messages.push(answer)
      this.chatLoading = true
      this.scrollToBottom()

      const controller = new AbortController()
      this.chatAbortController = controller
      const tagOptions = deriveTagOptions(question)
      const callSource = resolveCallSource(
        tagOptions.scope,
        tagOptions.enableWebSearch
      )
      try {
        const events = await streamChatV1(
          {
            messages: modelHistory(
              this.messages.filter((item) => item !== answer)
            ),
            context: {
              scope: tagOptions.scope,
              pagePath: this.pagePath,
              moduleKey: this.moduleInfo?.key || '',
              title: this.$page?.title || '当前文档',
              tags: this.pageTags,
              content: this.pageContext
            },
            enableWebSearch: tagOptions.enableWebSearch
          },
          { signal: controller.signal, callSource }
        )
        for await (const event of events) {
          if (event.type === 'delta') answer.content += event.content || ''
          if (event.type === 'error')
            throw new Error(event.message || '回答失败')
          this.scrollToBottom()
        }
        answer.streaming = false
        this.lastCompletedQuestion = question
      } catch (error) {
        answer.streaming = false
        if (!answer.content) {
          answer.content =
            error?.name === 'AbortError'
              ? '已停止生成。'
              : error?.message || '回答失败，请重试。'
        }
        answer.isError = error?.name !== 'AbortError'
        if (answer.isError) this.lastFailedQuestion = question
      } finally {
        if (this.chatAbortController === controller)
          this.chatAbortController = null
        this.chatLoading = false
        this.persist()
      }
    },
    stopGeneration() {
      this.chatAbortController?.abort()
      this.chatAbortController = null
    },
    retryLast() {
      const question = this.lastFailedQuestion
      const last = this.messages[this.messages.length - 1]
      if (last?.isError) this.messages.pop()
      this.sendMessage(question, { reuseUserMessage: true })
    },
    regenerateLast() {
      const question = this.lastCompletedQuestion
      const last = this.messages[this.messages.length - 1]
      if (last?.role === 'assistant' && !last.isSummary) this.messages.pop()
      this.sendMessage(question, { reuseUserMessage: true })
    },
    async copyMessage(content) {
      await navigator.clipboard?.writeText(content)
    },
    clearConversation() {
      this.stopGeneration()
      this.messages = this.messages.filter((message) => message.isSummary)
      this.lastFailedQuestion = ''
      this.lastCompletedQuestion = ''
      if (typeof sessionStorage !== 'undefined') {
        clearChatHistory(sessionStorage, this.pagePath)
      }
      this.persist()
    },
    persist() {
      if (typeof sessionStorage !== 'undefined') {
        saveChatHistory(sessionStorage, this.pagePath, this.messages)
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const element = this.$refs.messagesEl
        if (element) element.scrollTop = element.scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.ai-chat-panel {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  background: #f8f9fc;
}
.ai-chat-panel__messages {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px;
}
.ai-summary-card,
.ai-chat-message {
  margin: 0 0 14px;
  border: 1px solid #e4e7ef;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(24, 32, 56, 0.05);
}
.ai-summary-card {
  padding: 18px;
  background: linear-gradient(145deg, #fff 0%, #f3f1ff 100%);
}
.ai-summary-card__eyebrow {
  color: #6750a4;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.ai-summary-card__content {
  margin: 10px 0 0;
  white-space: pre-wrap;
  line-height: 1.7;
}
.ai-chat-message {
  max-width: 88%;
  padding: 12px 14px;
}
.ai-chat-message.is-user {
  margin-left: auto;
  background: #6750a4;
  color: #fff;
  border-color: transparent;
}
.ai-chat-message.is-error {
  border-color: #f1b5b5;
}
.ai-chat-message__meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 11px;
  opacity: 0.72;
}
.ai-chat-message__meta button,
.ai-chat-clear,
.ai-chat-composer__actions button {
  border: 0;
  background: none;
  color: inherit;
  cursor: pointer;
}
.ai-chat-message p {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.65;
}
.ai-chat-cursor {
  display: inline-block;
  width: 7px;
  height: 1em;
  margin-left: 3px;
  background: #6750a4;
  animation: ai-cursor 1s steps(1) infinite;
  vertical-align: -2px;
}
.ai-chat-composer {
  flex: 0 0 auto;
  padding: 10px 14px max(14px, env(safe-area-inset-bottom));
  border-top: 1px solid #e5e7ee;
  background: rgba(255, 255, 255, 0.96);
}
.ai-chat-composer__topline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ai-chat-quick-tags {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 7px;
  overflow-x: auto;
  padding: 2px 0 8px;
  scrollbar-width: none;
}
.ai-chat-quick-tags button {
  flex: 0 0 auto;
  border: 1px solid #dad4eb;
  border-radius: 999px;
  padding: 6px 10px;
  background: #fff;
  color: #5f4a8b;
  cursor: pointer;
}
.ai-chat-clear {
  flex: 0 0 auto;
  font-size: 12px;
  color: #6b7280;
}
.ai-chat-composer__box {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  border: 1px solid #d9dce5;
  border-radius: 14px;
  padding: 8px;
  background: #fff;
}
.ai-chat-composer textarea {
  flex: 1;
  min-width: 0;
  resize: none;
  border: 0;
  outline: 0;
  font: inherit;
  line-height: 1.5;
}
.ai-chat-composer__box button {
  min-width: 58px;
  border: 0;
  border-radius: 10px;
  padding: 9px 12px;
  background: #6750a4;
  color: #fff;
  cursor: pointer;
}
.ai-chat-composer__box button:disabled {
  opacity: 0.45;
  cursor: default;
}
.ai-chat-composer__box button.is-stop {
  background: #2f3342;
}
.ai-chat-composer__actions {
  display: flex;
  gap: 10px;
  margin-top: 7px;
  font-size: 12px;
  color: #6750a4;
}
.ai-chat-composer__hint {
  margin: 7px 2px 0;
  color: #8a8f9c;
  font-size: 10px;
}
@keyframes ai-cursor {
  50% {
    opacity: 0;
  }
}
@media (max-width: 420px) {
  .ai-chat-panel__messages {
    padding: 12px;
  }
  .ai-chat-message {
    max-width: 94%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ai-chat-cursor {
    animation: none;
  }
}
</style>
