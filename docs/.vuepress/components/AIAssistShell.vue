<template>
  <AIAssistTrigger />
  <AIAssistLayout />
</template>

<script>
import AIAssistTrigger from './ai/AIAssistTrigger.vue'
import AIAssistLayout from './ai/AIAssistLayout.vue'

export default {
  name: 'AIAssistShell',

  components: {
    AIAssistTrigger,
    AIAssistLayout
  }
}
</script>
