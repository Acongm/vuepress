import { normalizePagePath } from './summary-service.js'

let moduleIndexCache = null

export { normalizePagePath }

export function resolveModuleFromPath(pagePath, moduleIndex) {
  if (!moduleIndex?.modules) {
    return fallbackModule(pagePath)
  }

  const normalized = pagePath.startsWith('/') ? pagePath : `/${pagePath}`
  let bestMatch = null

  for (const [key, entry] of Object.entries(moduleIndex.modules)) {
    const prefix = entry.sidebarKey
    if (!prefix) {
      continue
    }
    if (normalized.startsWith(prefix)) {
      if (!bestMatch || prefix.length > bestMatch.entry.sidebarKey.length) {
        bestMatch = { key, entry }
      }
    }
  }

  if (bestMatch) {
    return {
      key: bestMatch.key,
      sidebarKey: bestMatch.entry.sidebarKey,
      description: bestMatch.entry.description || ''
    }
  }

  return fallbackModule(pagePath)
}

function fallbackModule(pagePath) {
  const segments = pagePath.replace(/^\//, '').split('/').filter(Boolean)
  if (!segments.length) {
    return null
  }

  const key = segments[0]
  return {
    key,
    sidebarKey: `/${key}/`,
    description: ''
  }
}

export async function loadModuleIndex(withBase) {
  if (moduleIndexCache) {
    return moduleIndexCache
  }

  try {
    const response = await fetch(withBase('/module-index.json'))
    if (!response.ok) {
      return null
    }
    moduleIndexCache = await response.json()
    return moduleIndexCache
  } catch {
    return null
  }
}

export function clearModuleIndexCache() {
  moduleIndexCache = null
}
