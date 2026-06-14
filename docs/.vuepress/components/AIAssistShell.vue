<template>
  <AIAssistTrigger />
  <AIAssistLayout />
</template>

<script>
import { isDocumentPage } from '../utils/is-document-page.js'
import { aiPanelState } from '../composables/useAiPanelState.js'
import {
  cancelPrefetch,
  clearSummarySession,
  prefetchPageSummary
} from '../utils/summary-prefetch.js'
import { getPagePath } from '../utils/summary-service.js'
import AIAssistTrigger from './ai/AIAssistTrigger.vue'
import AIAssistLayout from './ai/AIAssistLayout.vue'

export default {
  name: 'AIAssistShell',

  components: {
    AIAssistTrigger,
    AIAssistLayout
  },

  mounted() {
    this.schedulePrefetch()
    this.syncPanelLayout()
  },

  watch: {
    '$page.path'(nextPath, prevPath) {
      if (prevPath) {
        const base = this.$site.base || '/'
        clearSummarySession(getPagePath(prevPath, base))
      }
      if (prevPath && aiPanelState.panelOpen.value) {
        if (typeof window !== 'undefined' && window.innerWidth < 1180) {
          aiPanelState.closePanel()
          aiPanelState.finishPanelClose()
        } else {
          this.$nextTick(() => aiPanelState.syncPageSplitClass(true))
        }
      }
      this.syncPanelLayout()
      this.schedulePrefetch()
    }
  },

  beforeUnmount() {
    const base = this.$site.base || '/'
    const pagePath = getPagePath(this.$page.path, base)
    cancelPrefetch(pagePath)
    document.body.classList.remove('ai-assist-overlay-lock')
    if (aiPanelState.panelOpen.value) {
      aiPanelState.closePanel()
      aiPanelState.finishPanelClose()
    }
  },

  methods: {
    syncPanelLayout() {
      if (aiPanelState.panelOpen.value) {
        this.$nextTick(() => aiPanelState.syncPageSplitClass(true))
      }
    },

    schedulePrefetch() {
      if (!isDocumentPage(this.$page)) {
        return
      }

      this.$nextTick(() => {
        prefetchPageSummary(this)
      })
    }
  }
}
</script>
