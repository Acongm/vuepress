import { computed, reactive } from 'vue'

const state = reactive({
  panelOpen: false
})

if (typeof sessionStorage !== 'undefined') {
  sessionStorage.removeItem('aiSummaryPanelOpen')
}

export function syncPageSplitClass(open) {
  if (typeof document === 'undefined') {
    return
  }

  document.querySelectorAll('.page').forEach((page) => {
    page.classList.toggle('ai-split-active', open)
  })
}

function createPanelApi() {
  const panelOpen = computed({
    get: () => state.panelOpen,
    set: (value) => {
      state.panelOpen = value
      syncPageSplitClass(value)
    }
  })

  return {
    panelOpen,
    togglePanel() {
      panelOpen.value = !panelOpen.value
    },
    openPanel() {
      panelOpen.value = true
    },
    closePanel() {
      panelOpen.value = false
    },
    syncPageSplitClass
  }
}

export const aiPanelState = createPanelApi()

export function useAiPanelState() {
  return aiPanelState
}
