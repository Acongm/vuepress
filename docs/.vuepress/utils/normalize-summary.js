const FALLBACK_SUMMARY = {
  summary: '暂无摘要',
  keyPoints: [],
  keywords: [],
  techStack: [],
  difficulty: '未分级',
  contentType: '综合'
}

function extractJsonString(raw) {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  if (fenced) {
    return fenced[1].trim()
  }
  const objectMatch = trimmed.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    return objectMatch[0]
  }
  return trimmed
}

function toStringArray(value) {
  if (!Array.isArray(value)) {
    return []
  }
  return value.map((item) => String(item).trim()).filter(Boolean)
}

function coerceSummaryObject(parsed) {
  let summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : ''

  if (summary.startsWith('{') || summary.startsWith('[')) {
    try {
      const nested = JSON.parse(extractJsonString(summary))
      if (typeof nested.summary === 'string') {
        return coerceSummaryObject(nested)
      }
    } catch {
      // keep original summary text
    }
  }

  if (!summary || summary.startsWith('{') || summary.includes('"summary"')) {
    return { ...FALLBACK_SUMMARY }
  }

  return {
    summary,
    keyPoints: toStringArray(parsed.keyPoints),
    keywords: toStringArray(parsed.keywords),
    techStack: toStringArray(parsed.techStack),
    difficulty:
      typeof parsed.difficulty === 'string' && parsed.difficulty
        ? parsed.difficulty
        : '未分级',
    contentType:
      typeof parsed.contentType === 'string' && parsed.contentType
        ? parsed.contentType
        : '综合'
  }
}

function tryParseSummary(raw) {
  try {
    const parsed = JSON.parse(extractJsonString(raw))
    if (typeof parsed.summary === 'string') {
      return coerceSummaryObject(parsed)
    }
  } catch {
    // fall through
  }
  return null
}

function extractFieldWithRegex(raw, field) {
  const pattern =
    field === 'summary'
      ? /"summary"\s*:\s*"((?:\\.|[^"\\])*)"/
      : new RegExp(`"${field}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`)
  const match = raw.match(pattern)
  if (!match) {
    return ''
  }
  return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').trim()
}

function extractArrayWithRegex(raw, field) {
  const match = raw.match(new RegExp(`"${field}"\\s*:\\s*\\[([\\s\\S]*?)\\]`))
  if (!match) {
    return []
  }
  return [...match[1].matchAll(/"((?:\\.|[^"\\])*)"/g)]
    .map((item) => item[1].replace(/\\"/g, '"').trim())
    .filter(Boolean)
}

export function normalizeSummaryData(input) {
  if (!input) {
    return { ...FALLBACK_SUMMARY }
  }

  if (typeof input === 'string') {
    const parsed = tryParseSummary(input)
    if (parsed) {
      return parsed
    }

    const summary = extractFieldWithRegex(input, 'summary')
    if (summary) {
      return {
        summary,
        keyPoints: extractArrayWithRegex(input, 'keyPoints'),
        keywords: extractArrayWithRegex(input, 'keywords'),
        techStack: extractArrayWithRegex(input, 'techStack'),
        difficulty: extractFieldWithRegex(input, 'difficulty') || '未分级',
        contentType: extractFieldWithRegex(input, 'contentType') || '综合'
      }
    }

    const plain = input.trim()
    if (plain.startsWith('{') || plain.includes('"summary"')) {
      return { ...FALLBACK_SUMMARY }
    }

    return {
      ...FALLBACK_SUMMARY,
      summary: plain
    }
  }

  if (typeof input === 'object') {
    return coerceSummaryObject(input)
  }

  return { ...FALLBACK_SUMMARY }
}
