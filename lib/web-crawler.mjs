#!/usr/bin/env node
/**
 * Clawra - Web Crawler for Knowledge Base
 * Web content extraction and conversion to markdown
 * 
 * 功能：
 * - 从 URL 提取网页内容
 * - HTML 转 Markdown（零依赖）
 * - 元数据提取（标题、日期、描述）
 * - 内容清理和格式化
 * 
 * 遵循 lib/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ============ HTML to Markdown 转换器 ============

/**
 * 简单的 HTML 到 Markdown 转换器（零依赖）
 * @param {string} html - HTML 内容
 * @returns {string} Markdown 内容
 */
function htmlToMarkdown(html) {
  let markdown = html
  
  // 移除脚本和样式标签
  markdown = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  markdown = markdown.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // 移除注释
  markdown = markdown.replace(/<!--[\s\S]*?-->/g, '')
  
  // 转换标题 (h1-h6)
  for (let i = 6; i >= 1; i--) {
    const regex = new RegExp(`<h${i}[^>]*>(.*?)</h${i}>`, 'gi')
    markdown = markdown.replace(regex, (match, content) => {
      const clean = stripHtml(content)
      return '\n' + '#'.repeat(i) + ' ' + clean + '\n\n'
    })
  }
  
  // 转换段落
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, (match, content) => {
    const clean = stripHtml(content)
    return clean ? clean + '\n\n' : ''
  })
  
  // 转换链接
  markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, (match, url, text) => {
    const clean = stripHtml(text)
    return `[${clean}](${url})`
  })
  
  // 转换图片
  markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)')
  markdown = markdown.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)')
  
  // 转换列表
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return '\n' + items.map(item => {
      const clean = stripHtml(item.replace(/<\/?li[^>]*>/gi, ''))
      return `- ${clean}`
    }).join('\n') + '\n\n'
  })
  
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (match, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []
    return '\n' + items.map((item, index) => {
      const clean = stripHtml(item.replace(/<\/?li[^>]*>/gi, ''))
      return `${index + 1}. ${clean}`
    }).join('\n') + '\n\n'
  })
  
  // 转换代码块
  markdown = markdown.replace(/<pre[^>]*><code[^>]*class=["']language-([^"']*)["'][^>]*>(.*?)<\/code><\/pre>/gis, 
    (match, lang, code) => {
      const clean = decodeHtml(code)
      return '\n```' + lang + '\n' + clean + '\n```\n\n'
    })
  
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, 
    (match, code) => {
      const clean = decodeHtml(code)
      return '\n```\n' + clean + '\n```\n\n'
    })
  
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, (match, code) => {
    const clean = stripHtml(code)
    return '`' + clean + '`'
  })
  
  // 转换强调
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, (match, content) => {
    const clean = stripHtml(content)
    return `**${clean}**`
  })
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, (match, content) => {
    const clean = stripHtml(content)
    return `**${clean}**`
  })
  
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, (match, content) => {
    const clean = stripHtml(content)
    return `*${clean}*`
  })
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, (match, content) => {
    const clean = stripHtml(content)
    return `*${clean}*`
  })
  
  // 转换换行
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n')
  
  // 转换块引用
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (match, content) => {
    const clean = stripHtml(content)
    return '\n> ' + clean.split('\n').join('\n> ') + '\n\n'
  })
  
  // 转换水平线
  markdown = markdown.replace(/<hr\s*\/?>/gi, '\n---\n\n')
  
  // 移除剩余的 HTML 标签
  markdown = stripHtml(markdown)
  
  // 清理多余的空行
  markdown = markdown.replace(/\n{3,}/g, '\n\n')
  
  // 解码 HTML 实体
  markdown = decodeHtml(markdown)
  
  return markdown.trim()
}

/**
 * 移除 HTML 标签
 */
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * 解码 HTML 实体
 */
function decodeHtml(html) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '...',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  }
  
  let decoded = html
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }
  
  // 解码数字实体
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
  
  return decoded
}

// ============ 元数据提取 ============

/**
 * 从 HTML 提取元数据
 * @param {string} html - HTML 内容
 * @param {string} url - 原始 URL
 * @returns {object} 元数据对象
 */
function extractMetadata(html, url) {
  const metadata = {
    title: '',
    description: '',
    author: '',
    date: '',
    tags: [],
    url: url
  }
  
  // 提取标题
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
  if (titleMatch) {
    metadata.title = stripHtml(titleMatch[1]).trim()
  }
  
  // 从 meta 标签提取
  const metaTags = html.match(/<meta[^>]*>/gi) || []
  
  for (const tag of metaTags) {
    // Open Graph 标题
    if (/property=["']og:title["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']*)["']/i)
      if (contentMatch && !metadata.title) {
        metadata.title = decodeHtml(contentMatch[1])
      }
    }
    
    // 描述
    if (/name=["']description["']/i.test(tag) || /property=["']og:description["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']*)["']/i)
      if (contentMatch) {
        metadata.description = decodeHtml(contentMatch[1])
      }
    }
    
    // 作者
    if (/name=["']author["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']*)["']/i)
      if (contentMatch) {
        metadata.author = decodeHtml(contentMatch[1])
      }
    }
    
    // 发布日期
    if (/property=["']article:published_time["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']*)["']/i)
      if (contentMatch) {
        try {
          const date = new Date(contentMatch[1])
          metadata.date = date.toISOString().split('T')[0]
        } catch (e) {
          // 忽略无效日期
        }
      }
    }
    
    // 关键词
    if (/name=["']keywords["']/i.test(tag)) {
      const contentMatch = tag.match(/content=["']([^"']*)["']/i)
      if (contentMatch) {
        const keywords = contentMatch[1].split(',').map(k => k.trim()).filter(Boolean)
        metadata.tags.push(...keywords)
      }
    }
  }
  
  // 如果没有找到标题，尝试从 h1 提取
  if (!metadata.title) {
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i)
    if (h1Match) {
      metadata.title = stripHtml(h1Match[1]).trim()
    }
  }
  
  // 如果还是没有标题，使用 URL
  if (!metadata.title) {
    metadata.title = url.split('/').pop() || 'Untitled'
  }
  
  // 如果没有日期，使用当前日期
  if (!metadata.date) {
    metadata.date = new Date().toISOString().split('T')[0]
  }
  
  return metadata
}

// ============ 内容提取 ============

/**
 * 提取主要内容区域
 * @param {string} html - HTML 内容
 * @returns {string} 清理后的 HTML
 */
function extractMainContent(html) {
  // 尝试查找主要内容区域
  const contentSelectors = [
    /<article[^>]*>(.*?)<\/article>/is,
    /<main[^>]*>(.*?)<\/main>/is,
    /<div[^>]*class=["'][^"']*content[^"']*["'][^>]*>(.*?)<\/div>/is,
    /<div[^>]*class=["'][^"']*post[^"']*["'][^>]*>(.*?)<\/div>/is,
    /<div[^>]*class=["'][^"']*entry[^"']*["'][^>]*>(.*?)<\/div>/is,
    /<div[^>]*id=["']content["'][^>]*>(.*?)<\/div>/is
  ]
  
  for (const selector of contentSelectors) {
    const match = html.match(selector)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  // 如果找不到特定内容区域，移除常见的非内容元素
  let cleaned = html
  
  // 移除导航、页眉、页脚、侧边栏
  const removeSelectors = [
    /<nav[^>]*>.*?<\/nav>/gis,
    /<header[^>]*>.*?<\/header>/gis,
    /<footer[^>]*>.*?<\/footer>/gis,
    /<aside[^>]*>.*?<\/aside>/gis,
    /<div[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*>.*?<\/div>/gis,
    /<div[^>]*class=["'][^"']*menu[^"']*["'][^>]*>.*?<\/div>/gis
  ]
  
  for (const selector of removeSelectors) {
    cleaned = cleaned.replace(selector, '')
  }
  
  return cleaned
}

// ============ 主要导出函数 ============

/**
 * 从 URL 抓取内容并转换为 Markdown
 * @param {string} url - 要抓取的 URL
 * @param {object} options - 选项
 * @returns {Promise<object>} { markdown, metadata, html }
 */
export async function crawlUrl(url, options = {}) {
  const {
    timeout = 10000,
    userAgent = 'Mozilla/5.0 (compatible; Clawra/1.0; +https://github.com/Acongm/vuepress)',
    includeRawHtml = false
  } = options
  
  try {
    // 使用 Node.js 内置 fetch (Node >= 18)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const html = await response.text()
    
    // 提取元数据
    const metadata = extractMetadata(html, url)
    
    // 提取主要内容
    const mainContent = extractMainContent(html)
    
    // 转换为 Markdown
    const markdown = htmlToMarkdown(mainContent)
    
    const result = {
      markdown,
      metadata,
      success: true
    }
    
    if (includeRawHtml) {
      result.html = mainContent
    }
    
    return result
  } catch (error) {
    return {
      success: false,
      error: error.message,
      markdown: '',
      metadata: {}
    }
  }
}

/**
 * 生成带 frontmatter 的完整 Markdown 文档
 * @param {object} crawlResult - crawlUrl 的返回结果
 * @param {object} overrides - 覆盖元数据
 * @returns {string} 完整的 Markdown 文档
 */
export function generateDocument(crawlResult, overrides = {}) {
  if (!crawlResult.success) {
    throw new Error(`无法生成文档: ${crawlResult.error}`)
  }
  
  const { markdown, metadata } = crawlResult
  const finalMetadata = { ...metadata, ...overrides }
  
  // 生成 frontmatter
  const frontmatter = [
    '---',
    `title: ${finalMetadata.title}`,
    `date: ${finalMetadata.date}`,
    `ai_generated: true`,
    `ai_model: Clawra Web Crawler`,
    `source_url: ${finalMetadata.url}`,
  ]
  
  if (finalMetadata.author) {
    frontmatter.push(`author: ${finalMetadata.author}`)
  }
  
  if (finalMetadata.description) {
    frontmatter.push(`description: ${finalMetadata.description}`)
  }
  
  if (finalMetadata.tags && finalMetadata.tags.length > 0) {
    frontmatter.push(`tags: [${finalMetadata.tags.join(', ')}]`)
  }
  
  frontmatter.push('---')
  frontmatter.push('')
  
  // 添加来源说明
  const header = [
    `# ${finalMetadata.title}`,
    '',
    `> 原文链接: [${finalMetadata.url}](${finalMetadata.url})`,
    '',
    '---',
    ''
  ]
  
  return frontmatter.join('\n') + '\n' + header.join('\n') + '\n' + markdown
}

/**
 * 批量抓取多个 URL
 * @param {string[]} urls - URL 列表
 * @param {object} options - 选项
 * @returns {Promise<object[]>} 结果数组
 */
export async function crawlMultiple(urls, options = {}) {
  const { concurrency = 3, delay = 1000 } = options
  const results = []
  
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)
    const promises = batch.map(url => crawlUrl(url, options))
    const batchResults = await Promise.all(promises)
    results.push(...batchResults)
    
    // 延迟以避免过载服务器
    if (i + concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  return results
}

// ============ CLI 支持 ============

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
Clawra - Web Crawler for Knowledge Base

用法:
  node lib/web-crawler.mjs <url> [options]

选项:
  --output, -o <file>    输出文件路径
  --timeout <ms>         请求超时时间（默认 10000ms）
  --raw                  包含原始 HTML
  --help, -h             显示帮助信息

示例:
  node lib/web-crawler.mjs https://example.com/article
  node lib/web-crawler.mjs https://example.com/article -o /tmp/article.md
  node lib/web-crawler.mjs https://example.com/article --timeout 20000
`)
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp()
    process.exit(0)
  }
  
  const url = args[0]
  const outputIndex = args.indexOf('--output') !== -1 ? args.indexOf('--output') : args.indexOf('-o')
  const outputFile = outputIndex !== -1 ? args[outputIndex + 1] : null
  const timeoutIndex = args.indexOf('--timeout')
  const timeout = timeoutIndex !== -1 ? parseInt(args[timeoutIndex + 1]) : 10000
  const includeRawHtml = args.includes('--raw')
  
  console.log(`🕷️  开始抓取: ${url}`)
  
  crawlUrl(url, { timeout, includeRawHtml })
    .then(result => {
      if (!result.success) {
        console.error(`❌ 抓取失败: ${result.error}`)
        process.exit(1)
      }
      
      console.log(`✅ 抓取成功`)
      console.log(`   标题: ${result.metadata.title}`)
      console.log(`   日期: ${result.metadata.date}`)
      console.log(`   长度: ${result.markdown.length} 字符`)
      
      const document = generateDocument(result)
      
      if (outputFile) {
        writeFileSync(outputFile, document, 'utf-8')
        console.log(`📄 已保存到: ${outputFile}`)
      } else {
        console.log('\n--- Markdown 输出 ---\n')
        console.log(document)
      }
    })
    .catch(error => {
      console.error(`❌ 错误: ${error.message}`)
      process.exit(1)
    })
}
