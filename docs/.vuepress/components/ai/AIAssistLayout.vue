<template>
  <Transition name="ai-panel-slide" @after-leave="handleAfterLeave">
    <div v-if="panelOpen" class="ai-assist-root">
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

  watch: {
    '$page.path'() {
      if (aiPanelState.panelOpen.value) {
        this.$nextTick(() => {
          aiPanelState.syncPageSplitClass(true)
        })
      }
    }
  },

  methods: {
    closePanel() {
      aiPanelState.closePanel()
    },

    handleAfterLeave() {
      aiPanelState.finishPanelClose()
    }
  }
}
</script>

<style scoped>
.ai-assist-root {
  width: 100%;
}

.ai-assist-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--navbar-height, 3.6rem) - 12px);
  max-height: calc(100vh - var(--navbar-height, 3.6rem) - 12px);
  border: 1px solid #e4e8f2;
  border-radius: 0;
  background: #f5f7fb;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.ai-assist-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  border-radius: 4px;
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
