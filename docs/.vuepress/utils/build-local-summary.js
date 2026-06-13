function getContentRoot() {
  return document.querySelector('.theme-default-content')
}

function isNoiseElement(element) {
  if (!element) {
    return true
  }

  return Boolean(
    element.closest('.adsbygoogle-box') ||
      element.classList?.contains('adsbygoogle') ||
      element.classList?.contains('page-nav') ||
      element.classList?.contains('footer')
  )
}

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim()
}

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text
  }
  return `${text.slice(0, maxLength)}…`
}

export function extractStructuredPageContent() {
  const root = getContentRoot()
  if (!root) {
    return null
  }

  const introParagraphs = []
  const sections = []
  let currentSection = null

  for (const child of root.children) {
    if (isNoiseElement(child)) {
      continue
    }

    const tag = child.tagName?.toLowerCase()

    if (tag === 'h1') {
      continue
    }

    if (tag === 'h2' || tag === 'h3') {
      const title = cleanText(child.textContent || '')
      if (!title) {
        continue
      }

      currentSection = {
        title,
        lead: '',
        points: []
      }
      sections.push(currentSection)
      continue
    }

    if (tag === 'p') {
      const text = cleanText(child.textContent || '')
      if (!text || text.length < 24) {
        continue
      }

      if (currentSection) {
        if (!currentSection.lead) {
          currentSection.lead = text
        } else if (currentSection.points.length < 2) {
          currentSection.points.push(truncate(text, 120))
        }
      } else {
        introParagraphs.push(text)
      }
      continue
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = [...child.querySelectorAll(':scope > li')]
        .map((item) => cleanText(item.textContent || ''))
        .filter((item) => item.length >= 8)

      if (currentSection) {
        currentSection.points.push(...items.slice(0, 3))
      } else if (items.length) {
        introParagraphs.push(items[0])
      }
    }
  }

  if (!introParagraphs.length && !sections.length) {
    return null
  }

  return {
    introParagraphs,
    sections
  }
}

export function buildLocalFallbackSummary({ title, tags = [] }) {
  const structured = extractStructuredPageContent()
  if (!structured) {
    return null
  }

  const { introParagraphs, sections } = structured
  const summaryCandidates = [
    introParagraphs[0],
    sections[0]?.lead,
    introParagraphs[1]
  ].filter(Boolean)

  if (!summaryCandidates.length && sections.length) {
    const sectionTitles = sections.map((section) => section.title).slice(0, 4)
    summaryCandidates.push(
      `${title || '当前页面'}收录 ${sectionTitles.join('、')} 等 ${
        sections.length
      } 个主题`
    )
  }

  if (!summaryCandidates.length && title) {
    summaryCandidates.push(title)
  }

  const summary = truncate(summaryCandidates[0] || '暂无摘要', 320)

  const keyPoints = []
  for (const section of sections) {
    if (section.title) {
      keyPoints.push(section.title)
    }

    if (section.points.length && keyPoints.length < 8) {
      keyPoints.push(...section.points.slice(0, 2))
    }

    if (keyPoints.length >= 6) {
      break
    }
  }

  if (!keyPoints.length && introParagraphs[1]) {
    keyPoints.push(truncate(introParagraphs[1], 96))
  }

  return {
    summary,
    keyPoints: [...new Set(keyPoints)].slice(0, 6),
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
