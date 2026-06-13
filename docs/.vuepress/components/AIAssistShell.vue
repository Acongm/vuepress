<template>
  <AIAssistTrigger />
  <AIAssistLayout />
</template>

<script>
import { isDocumentPage } from '../utils/is-document-page.js'
import { prefetchPageSummary, clearSummarySession } from '../utils/summary-prefetch.js'
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
  },

  watch: {
    '$page.path'(nextPath, prevPath) {
      if (prevPath) {
        const base = this.$site.base || '/'
        clearSummarySession(getPagePath(prevPath, base))
      }
      this.schedulePrefetch()
    }
  },

  methods: {
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
