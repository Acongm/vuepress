<template>
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

      <div class="ai-assist-panel__tabs">
        <button
          type="button"
          class="ai-assist-panel__tab"
          :class="{ 'is-active': activeTab === 'summary' }"
          @click="setActiveTab('summary')"
        >
          内容提炼
        </button>
        <button
          type="button"
          class="ai-assist-panel__tab"
          :class="{ 'is-active': activeTab === 'chat' }"
          @click="setActiveTab('chat')"
        >
          问答对话
        </button>
      </div>

      <div class="ai-assist-panel__body">
        <AISummaryCard v-if="activeTab === 'summary'" :active="true" />
        <AIChatPanel v-if="activeTab === 'chat'" :active="true" />
      </div>
    </aside>
  </div>
</template>

<script>
import { aiPanelState } from '../../composables/useAiPanelState.js'
import AISummaryCard from './AISummaryCard.vue'
import AIChatPanel from './AIChatPanel.vue'

export default {
  name: 'AIAssistLayout',

  components: {
    AISummaryCard,
    AIChatPanel
  },

  computed: {
    pageTitle() {
      return this.$page?.title || '当前文档'
    },

    panelOpen() {
      return aiPanelState.panelOpen.value
    },

    activeTab() {
      return aiPanelState.activeTab.value
    }
  },

  mounted() {
    aiPanelState.initPanelFromStorage()
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

    setActiveTab(tab) {
      aiPanelState.activeTab.value = tab
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
  max-height: calc(100vh - var(--navbar-height, 3.6rem) - 24px);
  border: 1px solid #e4e8f2;
  border-radius: 16px;
  background: #f8f9fd;
  box-shadow: 0 8px 24px rgba(74, 86, 166, 0.08);
  overflow: hidden;
}

.ai-assist-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
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

.ai-assist-panel__tabs {
  display: flex;
  gap: 8px;
  padding: 12px 16px 0;
}

.ai-assist-panel__tab {
  border: none;
  background: transparent;
  color: #5f6368;
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 10px 10px 0 0;
  cursor: pointer;
}

.ai-assist-panel__tab.is-active {
  background: #fff;
  color: #4a56a6;
  font-weight: 600;
}

.ai-assist-panel__body {
  flex: 1;
  min-height: 320px;
  overflow: auto;
  padding: 16px;
  background: #fff;
}
</style>
