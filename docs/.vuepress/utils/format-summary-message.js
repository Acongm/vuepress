export function formatSummaryMessage(data, sourceLabel = '') {
  if (typeof data === 'string') {
    return `📋 内容提炼\n\n${data}`
  }

  const lines = ['📋 内容提炼']

  if (sourceLabel) {
    lines.push(`来源：${sourceLabel}`)
  }

  lines.push('', data.summary || '暂无摘要')

  if (data.keyPoints?.length) {
    lines.push('', '💡 核心要点')
    data.keyPoints.forEach((point) => lines.push(`• ${point}`))
  }

  const tags = []
  if (data.keywords?.length) {
    tags.push(...data.keywords)
  }
  if (data.techStack?.length) {
    tags.push(...data.techStack)
  }

  if (tags.length) {
    lines.push('', `🔑 关键词：${[...new Set(tags)].join('、')}`)
  }

  if (data.difficulty && data.difficulty !== '未分级') {
    lines.push(`📌 难度：${data.difficulty}`)
  }

  if (data.contentType && data.contentType !== '综合') {
    lines.push(`📌 类型：${data.contentType}`)
  }

  lines.push('', '—', '你可以继续提问，我会结合当前页面内容回答。')
  return lines.join('\n')
}
