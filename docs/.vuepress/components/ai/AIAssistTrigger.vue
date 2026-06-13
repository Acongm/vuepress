<template>
  <Transition name="ai-fab-fade">
    <button
      v-if="!panelOpen"
      class="ai-assist-fab"
      type="button"
      title="AI 内容提炼"
      @click="openPanel"
    >
      <svg class="ai-assist-fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
      <span class="ai-assist-fab__text">AI 提炼</span>
    </button>
  </Transition>
</template>

<script>
import { aiPanelState } from '../../composables/useAiPanelState.js'

export default {
  name: 'AIAssistTrigger',

  setup() {
    return {
      panelOpen: aiPanelState.panelOpen
    }
  },

  methods: {
    openPanel() {
      aiPanelState.openPanel()
    }
  }
}
</script>

<style scoped>
.ai-assist-fab {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 999;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-assist-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.ai-assist-fab__icon {
  width: 20px;
  height: 20px;
}

.ai-fab-fade-enter-active,
.ai-fab-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.ai-fab-fade-enter-from,
.ai-fab-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .ai-assist-fab {
    bottom: 60px;
    right: 16px;
  }

  .ai-assist-fab__text {
    display: none;
  }
}
</style>
