<template>
  <div v-if="shouldShow" class="ai-summary-entry">
    <AIAssistTrigger />
    <AIAssistLayout />
  </div>
</template>

<script>
import AIAssistTrigger from './ai/AIAssistTrigger.vue'
import AIAssistLayout from './ai/AIAssistLayout.vue'
import { isDocumentPage } from '../utils/is-document-page.js'

export default {
  name: 'AISummaryButton',

  components: {
    AIAssistTrigger,
    AIAssistLayout
  },

  computed: {
    shouldShow() {
      return isDocumentPage(this.$page)
    }
  }
}
</script>
