<template>
  <AIAssistTrigger />
  <AIAssistLayout />
</template>

<script>
import { aiPanelState } from '../composables/useAiPanelState.js'
import AIAssistTrigger from './ai/AIAssistTrigger.vue'
import AIAssistLayout from './ai/AIAssistLayout.vue'

export default {
  name: 'AIAssistShell',

  components: {
    AIAssistTrigger,
    AIAssistLayout
  },

  mounted() {
    aiPanelState.initPanelFromStorage()
  }
}
</script>
