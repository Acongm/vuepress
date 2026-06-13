import { computed, reactive } from 'vue'

const state = reactive({
  panelOpen: false,
  activeTab: 'summary'
})

const STORAGE_KEY = 'aiSummaryPanelOpen'

function readStoredOpen() {
  if (typeof sessionStorage === 'undefined') {
    return false
  }
  return sessionStorage.getItem(STORAGE_KEY) === 'true'
}

function persistOpen(open) {
  if (typeof sessionStorage === 'undefined') {
    return
  }
  sessionStorage.setItem(STORAGE_KEY, String(open))
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
      persistOpen(value)
      syncPageSplitClass(value)
    }
  })

  const activeTab = computed({
    get: () => state.activeTab,
    set: (value) => {
      state.activeTab = value
    }
  })

  return {
    panelOpen,
    activeTab,
    togglePanel() {
      panelOpen.value = !panelOpen.value
    },
    openPanel(tab = 'summary') {
      activeTab.value = tab
      panelOpen.value = true
    },
    closePanel() {
      panelOpen.value = false
    },
    initPanelFromStorage() {
      if (readStoredOpen()) {
        state.panelOpen = true
        syncPageSplitClass(true)
      }
    },
    syncPageSplitClass
  }
}

export const aiPanelState = createPanelApi()

export function useAiPanelState() {
  return aiPanelState
}
