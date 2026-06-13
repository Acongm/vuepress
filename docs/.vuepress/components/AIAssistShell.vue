import { isDocumentPage } from '../utils/is-document-page.js'
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

  beforeUnmount() {
    const base = this.$site.base || '/'
    const pagePath = getPagePath(this.$page.path, base)
    cancelPrefetch(pagePath)
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
