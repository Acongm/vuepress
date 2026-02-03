#!/usr/bin/env node
/**
 * 知识库查询 API
 * Knowledge Base Query API for AI-powered retrieval
 * 
 * 提供程序化接口，供 AI 快速检索知识库内容
 * 
 * 功能：
 * - 按分类查询文档
 * - 按关键词/标签搜索
 * - 获取文档索引
 * - 获取分类信息
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = resolve(ROOT, 'docs')
const KNOWLEDGE_MAP_PATH = resolve(ROOT, 'tools/knowledge-map.json')
const DOCS_INDEX_PATH = resolve(ROOT, '.agents/skills/ai-doc/references/docs-index.json')

// ============ 数据加载 ============

let knowledgeMapCache = null
let docsIndexCache = null

/**
 * 加载知识图谱
 */
function loadKnowledgeMap() {
  if (!knowledgeMapCache) {
    if (!existsSync(KNOWLEDGE_MAP_PATH)) {
      throw new Error(`Knowledge map not found: ${KNOWLEDGE_MAP_PATH}`)
    }
    knowledgeMapCache = JSON.parse(readFileSync(KNOWLEDGE_MAP_PATH, 'utf-8'))
  }
  return knowledgeMapCache
}

/**
 * 加载文档索引
 */
function loadDocsIndex() {
  if (!docsIndexCache) {
    if (!existsSync(DOCS_INDEX_PATH)) {
      throw new Error(`Docs index not found: ${DOCS_INDEX_PATH}`)
    }
    docsIndexCache = JSON.parse(readFileSync(DOCS_INDEX_PATH, 'utf-8'))
  }
  return docsIndexCache
}

/**
 * 解析 Markdown frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) return {}
  
  const frontmatter = {}
  const lines = match[1].split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    
    // 处理数组
    if (value.startsWith('[') && value.endsWith(']')) {
      frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  
  return frontmatter
}

/**
 * 读取文档内容和元数据
 */
function readDocument(filePath) {
  const fullPath = resolve(DOCS_DIR, filePath.replace(/^\//, ''))
  
  if (!existsSync(fullPath)) {
    return null
  }
  
  const content = readFileSync(fullPath, 'utf-8')
  const frontmatter = parseFrontmatter(content)
  
  // 提取第一个标题作为 title（如果 frontmatter 没有）
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = frontmatter.title || (titleMatch ? titleMatch[1] : basename(filePath, '.md'))
  
  return {
    path: filePath,
    title,
    frontmatter,
    content: content.replace(/^---\n[\s\S]*?\n---\n/, ''), // 移除 frontmatter
    preview: content.slice(0, 500) // 前 500 字符预览
  }
}

// ============ 查询 API ============

/**
 * 获取所有可归档分类
 */
export function getArchivableCategories() {
  const km = loadKnowledgeMap()
  const categories = {}
  
  for (const [name, info] of Object.entries(km.categories)) {
    if (info.archivable) {
      categories[name] = {
        description: info.description,
        keywords: info.keywords,
        path: info.path
      }
    }
  }
  
  return categories
}

/**
 * 获取分类信息
 */
export function getCategory(categoryName) {
  const km = loadKnowledgeMap()
  return km.categories[categoryName] || null
}

/**
 * 按分类查询文档
 */
export function queryByCategory(categoryName, options = {}) {
  const { includeContent = false, limit = 100 } = options
  
  const index = loadDocsIndex()
  const categoryDocs = index.categories[categoryName]
  
  if (!categoryDocs) {
    return []
  }
  
  const files = categoryDocs.files.slice(0, limit)
  
  if (!includeContent) {
    return files.map(path => ({ path }))
  }
  
  return files.map(path => readDocument(path)).filter(doc => doc !== null)
}

/**
 * 按关键词搜索文档
 */
export function searchByKeywords(keywords, options = {}) {
  const { includeContent = false, limit = 50, matchAll = false } = options
  
  const km = loadKnowledgeMap()
  const index = loadDocsIndex()
  const keywordList = Array.isArray(keywords) ? keywords : [keywords]
  const normalizedKeywords = keywordList.map(k => k.toLowerCase())
  
  const results = []
  
  // 搜索所有分类
  for (const [categoryName, categoryInfo] of Object.entries(km.categories)) {
    if (!categoryInfo.keywords) continue
    
    const categoryKeywords = categoryInfo.keywords.map(k => k.toLowerCase())
    
    // 检查关键词匹配
    const matchingKeywords = normalizedKeywords.filter(k => 
      categoryKeywords.some(ck => ck.includes(k) || k.includes(ck))
    )
    
    if (matchAll ? matchingKeywords.length === normalizedKeywords.length : matchingKeywords.length > 0) {
      // 获取该分类的文档
      const categoryDocs = index.categories[categoryName]
      if (categoryDocs && categoryDocs.files) {
        for (const filePath of categoryDocs.files) {
          if (results.length >= limit) break
          
          const doc = includeContent ? readDocument(filePath) : { path: filePath }
          
          if (doc) {
            results.push({
              ...doc,
              category: categoryName,
              matchedKeywords: matchingKeywords,
              relevance: matchingKeywords.length / normalizedKeywords.length
            })
          }
        }
      }
    }
  }
  
  // 按相关性排序
  results.sort((a, b) => b.relevance - a.relevance)
  
  return results.slice(0, limit)
}

/**
 * 按标签搜索文档
 */
export function searchByTags(tags, options = {}) {
  const { includeContent = false, limit = 50, matchAll = false } = options
  
  const index = loadDocsIndex()
  const tagList = Array.isArray(tags) ? tags : [tags]
  const normalizedTags = tagList.map(t => t.toLowerCase())
  
  const results = []
  
  // 搜索所有文档
  if (index.documents) {
    for (const doc of index.documents) {
      if (results.length >= limit) break
      
      const docTags = (doc.tags || []).map(t => t.toLowerCase())
      const matchingTags = normalizedTags.filter(t => docTags.includes(t))
      
      if (matchAll ? matchingTags.length === normalizedTags.length : matchingTags.length > 0) {
        const fullDoc = includeContent ? readDocument(doc.path) : { path: doc.path }
        
        if (fullDoc) {
          results.push({
            ...fullDoc,
            matchedTags: matchingTags,
            relevance: matchingTags.length / normalizedTags.length
          })
        }
      }
    }
  }
  
  results.sort((a, b) => b.relevance - a.relevance)
  
  return results
}

/**
 * 全文搜索（简单实现）
 */
export function searchFullText(query, options = {}) {
  const { limit = 20, caseSensitive = false } = options
  
  const index = loadDocsIndex()
  const searchQuery = caseSensitive ? query : query.toLowerCase()
  const results = []
  
  // 遍历所有分类的文档
  for (const [categoryName, categoryDocs] of Object.entries(index.categories)) {
    if (!categoryDocs.files) continue
    
    for (const filePath of categoryDocs.files) {
      if (results.length >= limit) break
      
      const doc = readDocument(filePath)
      if (!doc) continue
      
      const contentToSearch = caseSensitive ? doc.content : doc.content.toLowerCase()
      const titleToSearch = caseSensitive ? doc.title : doc.title.toLowerCase()
      
      if (contentToSearch.includes(searchQuery) || titleToSearch.includes(searchQuery)) {
        // 找到匹配的上下文片段
        const index = contentToSearch.indexOf(searchQuery)
        const start = Math.max(0, index - 100)
        const end = Math.min(doc.content.length, index + 200)
        const snippet = doc.content.slice(start, end)
        
        results.push({
          path: filePath,
          title: doc.title,
          category: categoryName,
          snippet: '...' + snippet + '...',
          frontmatter: doc.frontmatter
        })
      }
    }
  }
  
  return results
}

/**
 * 获取完整文档索引
 */
export function getFullIndex() {
  return loadDocsIndex()
}

/**
 * 获取文档统计信息
 */
export function getStats() {
  const index = loadDocsIndex()
  const km = loadKnowledgeMap()
  
  const stats = {
    totalDocuments: index._meta?.totalFiles || 0,
    lastGenerated: index._meta?.generatedAt,
    categories: {},
    archivableCategories: 0
  }
  
  for (const [name, info] of Object.entries(km.categories)) {
    const categoryDocs = index.categories[name]
    stats.categories[name] = {
      archivable: info.archivable,
      documentCount: categoryDocs?.count || 0,
      description: info.description
    }
    
    if (info.archivable) {
      stats.archivableCategories++
    }
  }
  
  return stats
}

/**
 * 智能分类推荐
 * 根据内容关键词推荐最佳分类
 */
export function suggestCategory(contentOrKeywords) {
  const km = loadKnowledgeMap()
  const keywords = Array.isArray(contentOrKeywords) 
    ? contentOrKeywords 
    : contentOrKeywords.toLowerCase().split(/\s+/)
  
  const scores = {}
  
  for (const [categoryName, categoryInfo] of Object.entries(km.categories)) {
    if (!categoryInfo.archivable || !categoryInfo.keywords) continue
    
    let score = 0
    const categoryKeywords = categoryInfo.keywords.map(k => k.toLowerCase())
    
    for (const keyword of keywords) {
      for (const ck of categoryKeywords) {
        if (ck === keyword) {
          score += 10 // 精确匹配
        } else if (ck.includes(keyword) || keyword.includes(ck)) {
          score += 5 // 部分匹配
        }
      }
    }
    
    if (score > 0) {
      scores[categoryName] = score
    }
  }
  
  // 按分数排序
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([category, score]) => ({
      category,
      score,
      confidence: Math.min(score / 50, 1.0), // 归一化到 0-1
      description: km.categories[category].description
    }))
  
  return sorted.slice(0, 5)
}

/**
 * 查找相似文档
 * 基于标签和关键词的简单相似度计算
 */
export function findSimilarDocuments(filePath, options = {}) {
  const { limit = 5 } = options
  
  const doc = readDocument(filePath)
  if (!doc) return []
  
  const tags = doc.frontmatter.tags || []
  const index = loadDocsIndex()
  const results = []
  
  // 遍历所有文档计算相似度
  for (const [categoryName, categoryDocs] of Object.entries(index.categories)) {
    if (!categoryDocs.files) continue
    
    for (const otherPath of categoryDocs.files) {
      if (otherPath === filePath) continue // 跳过自己
      
      const otherDoc = readDocument(otherPath)
      if (!otherDoc) continue
      
      const otherTags = otherDoc.frontmatter.tags || []
      
      // 计算标签重叠度
      const commonTags = tags.filter(t => otherTags.includes(t))
      const similarity = commonTags.length / Math.max(tags.length, otherTags.length, 1)
      
      if (similarity > 0) {
        results.push({
          path: otherPath,
          title: otherDoc.title,
          category: categoryName,
          similarity,
          commonTags
        })
      }
    }
  }
  
  // 按相似度排序
  results.sort((a, b) => b.similarity - a.similarity)
  
  return results.slice(0, limit)
}

// ============ CLI 接口 ============

function printHelp() {
  console.log(`
知识库查询 API (Knowledge Base Query API)

用法:
  node lib/kb-query.mjs <command> [options]

命令:
  categories              列出所有可归档分类
  category <name>         获取指定分类信息
  query <category>        查询指定分类的文档
  search <keywords>       按关键词搜索
  tags <tags>             按标签搜索
  fulltext <query>        全文搜索
  stats                   获取统计信息
  suggest <keywords>      智能分类推荐
  similar <file>          查找相似文档

选项:
  --content              包含文档内容（默认只返回路径）
  --limit <n>            限制结果数量（默认 50）
  --match-all            匹配所有关键词（默认匹配任一）

示例:
  node lib/kb-query.mjs categories
  node lib/kb-query.mjs query JavaScript --content --limit 5
  node lib/kb-query.mjs search "react hooks" --content
  node lib/kb-query.mjs tags react,hooks --match-all
  node lib/kb-query.mjs suggest "react useState useEffect"
  node lib/kb-query.mjs similar /react/react-render.md
`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp()
    process.exit(0)
  }
  
  const command = args[0]
  const options = {
    includeContent: args.includes('--content'),
    limit: parseInt(args.find((arg, i) => args[i - 1] === '--limit') || '50'),
    matchAll: args.includes('--match-all')
  }
  
  try {
    let result
    
    switch (command) {
      case 'categories':
        result = getArchivableCategories()
        break
      
      case 'category':
        if (args.length < 2) {
          console.error('错误: 需要指定分类名称')
          process.exit(1)
        }
        result = getCategory(args[1])
        break
      
      case 'query':
        if (args.length < 2) {
          console.error('错误: 需要指定分类名称')
          process.exit(1)
        }
        result = queryByCategory(args[1], options)
        break
      
      case 'search':
        if (args.length < 2) {
          console.error('错误: 需要指定关键词')
          process.exit(1)
        }
        const keywords = args[1].split(/[,\s]+/)
        result = searchByKeywords(keywords, options)
        break
      
      case 'tags':
        if (args.length < 2) {
          console.error('错误: 需要指定标签')
          process.exit(1)
        }
        const tags = args[1].split(',')
        result = searchByTags(tags, options)
        break
      
      case 'fulltext':
        if (args.length < 2) {
          console.error('错误: 需要指定搜索词')
          process.exit(1)
        }
        result = searchFullText(args[1], options)
        break
      
      case 'stats':
        result = getStats()
        break
      
      case 'suggest':
        if (args.length < 2) {
          console.error('错误: 需要指定关键词')
          process.exit(1)
        }
        result = suggestCategory(args[1])
        break
      
      case 'similar':
        if (args.length < 2) {
          console.error('错误: 需要指定文档路径')
          process.exit(1)
        }
        result = findSimilarDocuments(args[1], options)
        break
      
      default:
        console.error(`未知命令: ${command}`)
        printHelp()
        process.exit(1)
    }
    
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
}
