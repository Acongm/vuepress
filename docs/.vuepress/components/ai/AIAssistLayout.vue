<template>
  <Transition name="ai-panel-slide" @after-leave="handleAfterLeave">
    <div v-if="panelOpen" class="ai-assist-root">
      <button
        class="ai-assist-backdrop"
        type="button"
        aria-label="关闭 AI 阅读助手"
        @click="closePanel"
      />
      <aside class="ai-assist-panel" aria-label="AI 阅读助手">
        <div class="ai-assist-panel__header">
          <div>
            <h3>AI 阅读助手</h3>
            <p>{{ pageTitle }}</p>
          </div>
          <button type="button" class="ai-assist-panel__close" @click="closePanel">
            收起
          </button>
        </div>

        <AIChatPanel class="ai-assist-panel__body" :active="panelOpen" />
      </aside>
    </div>
  </Transition>
</template>

<script>
import { aiPanelState } from '../../composables/useAiPanelState.js'
import AIChatPanel from './AIChatPanel.vue'

export default {
  name: 'AIAssistLayout',

  components: {
    AIChatPanel
  },

  setup() {
    return {
      panelOpen: aiPanelState.panelOpen
    }
  },

  computed: {
    pageTitle() {
      return this.$page?.title || '当前文档'
    }
  },

  mounted() {
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('resize', this.syncOverlayLock)
    this.syncOverlayLock()
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
    window.removeEventListener('resize', this.syncOverlayLock)
    document.body.classList.remove('ai-assist-overlay-lock')
  },

  watch: {
    panelOpen() {
      this.$nextTick(this.syncOverlayLock)
    },
    '$page.path'() {
      if (aiPanelState.panelOpen.value) {
        this.$nextTick(() => {
          aiPanelState.syncPageSplitClass(true)
        })
      }
    }
  },

  methods: {
    handleKeydown(event) {
      if (event.key === 'Escape' && aiPanelState.panelOpen.value) {
        aiPanelState.closePanel()
      }
    },

    closePanel() {
      aiPanelState.closePanel()
      this.$nextTick(() => document.querySelector('.ai-assist-fab')?.focus())
    },

    handleAfterLeave() {
      aiPanelState.finishPanelClose()
      document.body.classList.remove('ai-assist-overlay-lock')
    },

    syncOverlayLock() {
      document.body.classList.toggle(
        'ai-assist-overlay-lock',
        aiPanelState.panelOpen.value && window.innerWidth < 1180
      )
    }
  }
}
</script>

<style scoped>
.ai-assist-root {
  width: 100%;
}

.ai-assist-backdrop {
  display: none;
}

.ai-assist-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--navbar-height, 3.6rem) - 12px);
  max-height: calc(100vh - var(--navbar-height, 3.6rem) - 12px);
  border: 1px solid #e4e8f2;
  border-radius: 18px;
  background: #f5f7fb;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.ai-assist-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #25283a 0%, #6750a4 100%);
  color: #fff;
  flex-shrink: 0;
}

.ai-assist-panel__header h3 {
  margin: 0;
  font-size: 15px;
}

.ai-assist-panel__header p {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.ai-assist-panel__close {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}

.ai-assist-panel__body {
  flex: 1;
  min-height: 0;
}
</style>
