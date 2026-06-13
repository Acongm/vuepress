<template>
  <div class="ai-assist-trigger">
    <button
      class="ai-assist-trigger__btn"
      :class="{ 'is-active': panelOpen }"
      type="button"
      @click="togglePanel"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <span>{{ panelOpen ? '收起 AI 助手' : 'AI 助手' }}</span>
    </button>
    <span v-if="panelOpen" class="ai-assist-trigger__hint">文章与 AI 面板并排显示</span>
  </div>
</template>

<script>
import { aiPanelState } from '../../composables/useAiPanelState.js'

export default {
  name: 'AIAssistTrigger',

  computed: {
    panelOpen() {
      return aiPanelState.panelOpen.value
    }
  },

  methods: {
    togglePanel() {
      aiPanelState.togglePanel()
    }
  }
}
</script>

<style scoped>
.ai-assist-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8ebf0;
}

.ai-assist-trigger__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid #d7dcf0;
  border-radius: 999px;
  background: #fff;
  color: #4a56a6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ai-assist-trigger__btn svg {
  width: 18px;
  height: 18px;
}

.ai-assist-trigger__btn:hover,
.ai-assist-trigger__btn.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: #fff;
}

.ai-assist-trigger__hint {
  font-size: 12px;
  color: #7b8190;
}
</style>
