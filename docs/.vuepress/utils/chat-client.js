const CLIENT_ID_KEY = 'acongm_client_id'

export const CALL_SOURCES = {
  ARTICLE_PANEL: 'vuepress:article-panel',
  MODULE_PANEL: 'vuepress:module-panel',
  ARTICLE_PANEL_WEB: 'vuepress:article-panel:web',
  MODULE_PANEL_WEB: 'vuepress:module-panel:web'
}

export function getClientId() {
  if (typeof localStorage === 'undefined') {
    return 'server-side'
  }

  let id = localStorage.getItem(CLIENT_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CLIENT_ID_KEY, id)
  }
  return id
}

export function getConversationId(pagePath) {
  const normalizedPath = pagePath || '/'
  if (typeof sessionStorage === 'undefined') {
    return normalizedPath
  }

  const key = `acongm_conv_${normalizedPath}`
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export function resolveCallSource(scope, enableWebSearch = false) {
  const isModule = scope === 'module'
  if (enableWebSearch) {
    return isModule
      ? CALL_SOURCES.MODULE_PANEL_WEB
      : CALL_SOURCES.ARTICLE_PANEL_WEB
  }
  return isModule ? CALL_SOURCES.MODULE_PANEL : CALL_SOURCES.ARTICLE_PANEL
}

export function buildChatHeaders({ pagePath, callSource }) {
  return {
    'x-client-id': getClientId(),
    'x-call-source': callSource,
    'x-conversation-id': getConversationId(pagePath)
  }
}
