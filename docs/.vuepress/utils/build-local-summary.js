export function buildLocalFallbackSummary({ title, content, tags = [] }) {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (!normalized || normalized.length < 20) {
    return null
  }

  const keyPoints = []
  const root = document.querySelector('.theme-default-content')
  if (root) {
    root.querySelectorAll('h2, h3').forEach((element) => {
      const text = element.textContent?.trim()
      if (text) {
        keyPoints.push(text)
      }
    })
  }

  const summary =
    normalized.length > 220 ? `${normalized.slice(0, 220)}…` : normalized

  return {
    summary: summary || title || '暂无摘要',
    keyPoints: keyPoints.slice(0, 6),
    keywords: Array.isArray(tags) ? tags.slice(0, 8) : [],
    techStack: [],
    difficulty: '未分级',
    contentType: '综合'
  }
}

export function shouldTryLiveSummary() {
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    return false
  }
  return true
}
