const MAX_ARTICLE_CHARS = 8000
const MAX_MODULE_CHARS = 4000

export function buildSystemPrompt(options) {
  const lines = [
    '你是当前知识库文档页面的 AI 助手。请基于提供的文档内容回答用户问题，回答简洁、准确、有条理。',
    '优先使用当前文章内容；若用户选择模块范围，可结合同模块其他文档摘要作为补充。',
    options.enableWebSearch
      ? '已开启联网检索，可结合检索结果辅助理解，并在回答中标注外部来源。'
      : '未开启联网检索，仅基于站内文档内容回答。',
    '',
    `文档标题：${options.title}`,
    `文档路径：${options.pagePath}`
  ]

  if (options.tags.length) {
    lines.push(`文档标签：${options.tags.join('、')}`)
  }

  lines.push(
    '',
    '【当前文章内容】',
    trimContent(options.pageContent, MAX_ARTICLE_CHARS)
  )

  if (options.scope === 'module' && options.moduleDocs.length) {
    lines.push('', '【本模块扩展内容】')
    if (options.moduleInfo) {
      lines.push(
        `模块：${options.moduleInfo.key}`,
        options.moduleInfo.description || ''
      )
    }

    let used = 0
    for (const doc of options.moduleDocs) {
      if (doc.path === options.pagePath) {
        continue
      }
      const block = [
        `- ${doc.title} (${doc.path})`,
        doc.summary || '暂无摘要',
        doc.keywords.length ? `关键词：${doc.keywords.join('、')}` : ''
      ]
        .filter(Boolean)
        .join('\n')

      if (used + block.length > MAX_MODULE_CHARS) {
        break
      }
      lines.push(block)
      used += block.length
    }
  }

  return lines.filter(Boolean).join('\n')
}

export function buildChatContextPayload(options) {
  return {
    scope: options.scope,
    pagePath: options.pagePath,
    moduleKey: options.moduleInfo?.key || '',
    title: options.title,
    tags: options.tags
  }
}

function trimContent(content, maxChars) {
  const normalized = content.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxChars) {
    return normalized
  }
  return `${normalized.slice(0, maxChars)}…`
}

export function extractPageContent() {
  const selectors = ['.theme-default-content', '.page-content', '.page']
  for (const selector of selectors) {
    const element = document.querySelector(selector)
    if (element && element.textContent) {
      return trimContent(element.textContent, MAX_ARTICLE_CHARS)
    }
  }
  return ''
}
