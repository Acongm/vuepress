#!/usr/bin/env node
/**
 * 文档验证工具
 * Document Validator for AI-generated documents
 * 
 * 在将文档提交到知识库前，进行质量检查：
 * - frontmatter 完整性
 * - 标题格式
 * - 内容长度
 * - 标签合理性
 * - 重复检测
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = resolve(ROOT, 'docs')
const KNOWLEDGE_MAP_PATH = resolve(ROOT, 'tools/knowledge-map.json')

// ============ 验证规则 ============

const VALIDATION_RULES = {
  minContentLength: 100, // 最小内容长度（不含 frontmatter）
  maxContentLength: 50000, // 最大内容长度
  minTitleLength: 5,
  maxTitleLength: 100,
  requiredFrontmatter: ['title', 'date'],
  recommendedFrontmatter: ['tags', 'ai_generated', 'ai_model'],
  similarityThreshold: 0.8 // 相似度阈值（80%以上认为重复）
}

// ============ 工具函数 ============

/**
 * 解析 frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) return null
  
  const frontmatter = {}
  const lines = match[1].split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.slice(0, colonIndex).trim()
    const value = line.slice(colonIndex + 1).trim()
    
    if (value.startsWith('[') && value.endsWith(']')) {
      frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  
  return frontmatter
}

/**
 * 计算两个字符串的相似度（简单实现）
 */
function calculateSimilarity(str1, str2) {
  const len1 = str1.length
  const len2 = str2.length
  
  if (len1 === 0 || len2 === 0) return 0
  
  // 简化：计算共同单词的比例
  const words1 = str1.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const words2 = str2.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  
  if (words1.length === 0 || words2.length === 0) return 0
  
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  
  let commonWords = 0
  for (const word of set1) {
    if (set2.has(word)) commonWords++
  }
  
  return (2 * commonWords) / (set1.size + set2.size)
}

/**
 * 查找相似文档
 */
function findSimilarDocuments(content, category) {
  const categoryPath = resolve(DOCS_DIR, category)
  if (!existsSync(categoryPath)) return []
  
  const similar = []
  const files = readdirSync(categoryPath).filter(f => f.endsWith('.md'))
  
  for (const file of files) {
    const filePath = resolve(categoryPath, file)
    const existingContent = readFileSync(filePath, 'utf-8')
    
    // 移除 frontmatter 后比较
    const contentToCompare = content.replace(/^---\n[\s\S]*?\n---\n/, '')
    const existingToCompare = existingContent.replace(/^---\n[\s\S]*?\n---\n/, '')
    
    const similarity = calculateSimilarity(contentToCompare, existingToCompare)
    
    if (similarity >= VALIDATION_RULES.similarityThreshold) {
      similar.push({
        file: `${category}/${file}`,
        similarity: (similarity * 100).toFixed(1) + '%'
      })
    }
  }
  
  return similar
}

/**
 * 加载知识图谱获取有效标签
 */
function getValidTags() {
  const km = JSON.parse(readFileSync(KNOWLEDGE_MAP_PATH, 'utf-8'))
  const tags = new Set()
  
  for (const [, info] of Object.entries(km.categories)) {
    if (info.keywords) {
      info.keywords.forEach(k => tags.add(k.toLowerCase()))
    }
  }
  
  return tags
}

// ============ 验证函数 ============

/**
 * 验证文档
 */
export function validateDocument(content, options = {}) {
  const {
    filePath = 'unknown',
    category = null,
    checkDuplicates = true
  } = options
  
  const errors = []
  const warnings = []
  const info = []
  
  // 1. 检查 frontmatter 存在性
  const frontmatter = parseFrontmatter(content)
  if (!frontmatter) {
    errors.push('缺少 frontmatter')
    return { valid: false, errors, warnings, info }
  }
  
  info.push('✓ frontmatter 存在')
  
  // 2. 检查必需字段
  for (const field of VALIDATION_RULES.requiredFrontmatter) {
    if (!frontmatter[field]) {
      errors.push(`缺少必需字段: ${field}`)
    } else {
      info.push(`✓ 包含必需字段: ${field}`)
    }
  }
  
  // 3. 检查推荐字段
  for (const field of VALIDATION_RULES.recommendedFrontmatter) {
    if (!frontmatter[field]) {
      warnings.push(`缺少推荐字段: ${field}`)
    }
  }
  
  // 4. 验证标题
  const title = frontmatter.title
  if (title) {
    if (title.length < VALIDATION_RULES.minTitleLength) {
      errors.push(`标题太短 (${title.length} < ${VALIDATION_RULES.minTitleLength})`)
    } else if (title.length > VALIDATION_RULES.maxTitleLength) {
      warnings.push(`标题过长 (${title.length} > ${VALIDATION_RULES.maxTitleLength})`)
    } else {
      info.push(`✓ 标题长度合适 (${title.length} 字符)`)
    }
  }
  
  // 5. 验证日期格式
  const date = frontmatter.date
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`日期格式错误: ${date} (应为 YYYY-MM-DD)`)
  } else if (date) {
    info.push('✓ 日期格式正确')
  }
  
  // 6. 检查内容长度
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '')
  const contentLength = contentWithoutFrontmatter.trim().length
  
  if (contentLength < VALIDATION_RULES.minContentLength) {
    errors.push(`内容太短 (${contentLength} < ${VALIDATION_RULES.minContentLength} 字符)`)
  } else if (contentLength > VALIDATION_RULES.maxContentLength) {
    warnings.push(`内容过长 (${contentLength} > ${VALIDATION_RULES.maxContentLength} 字符)`)
  } else {
    info.push(`✓ 内容长度合适 (${contentLength} 字符)`)
  }
  
  // 7. 检查至少有一个标题
  const hasTitle = /^#\s+.+$/m.test(contentWithoutFrontmatter)
  if (!hasTitle) {
    warnings.push('内容中缺少一级标题 (#)')
  } else {
    info.push('✓ 包含一级标题')
  }
  
  // 8. 验证标签
  const tags = frontmatter.tags
  if (tags && Array.isArray(tags)) {
    if (tags.length === 0) {
      warnings.push('tags 数组为空')
    } else if (tags.length > 10) {
      warnings.push(`标签过多 (${tags.length} > 10)`)
    } else {
      info.push(`✓ 包含 ${tags.length} 个标签`)
      
      // 检查标签有效性
      const validTags = getValidTags()
      const invalidTags = tags.filter(t => !validTags.has(t.toLowerCase()))
      if (invalidTags.length > 0) {
        warnings.push(`包含未知标签: ${invalidTags.join(', ')}`)
      }
    }
  }
  
  // 9. AI 生成标记
  if (frontmatter.ai_generated === 'true' || frontmatter.ai_generated === true) {
    if (!frontmatter.ai_model) {
      warnings.push('标记为 AI 生成但缺少 ai_model 字段')
    } else {
      info.push(`✓ AI 生成文档 (${frontmatter.ai_model})`)
    }
  }
  
  // 10. 重复检测
  if (checkDuplicates && category) {
    const similar = findSimilarDocuments(content, category)
    if (similar.length > 0) {
      warnings.push(`发现相似文档: ${similar.map(s => `${s.file} (${s.similarity})`).join(', ')}`)
    } else {
      info.push('✓ 未发现重复内容')
    }
  }
  
  const valid = errors.length === 0
  
  return { valid, errors, warnings, info, frontmatter }
}

/**
 * 验证文件
 */
export function validateFile(filePath, options = {}) {
  if (!existsSync(filePath)) {
    return {
      valid: false,
      errors: [`文件不存在: ${filePath}`],
      warnings: [],
      info: []
    }
  }
  
  const content = readFileSync(filePath, 'utf-8')
  return validateDocument(content, { ...options, filePath })
}

// ============ CLI 接口 ============

function printHelp() {
  console.log(`
文档验证工具 (Document Validator)

用法:
  node lib/doc-validator.mjs <file> [options]

选项:
  --category <name>       指定分类（用于重复检测）
  --no-duplicates         跳过重复检测
  --json                  JSON 格式输出
  --strict                警告也作为错误

示例:
  node lib/doc-validator.mjs docs/JavaScript/promise.md
  node lib/doc-validator.mjs docs/react/hooks.md --category react
  node lib/doc-validator.mjs docs/vue/computed.md --strict --json
`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp()
    process.exit(0)
  }
  
  const filePath = args[0]
  const category = args[args.indexOf('--category') + 1]
  const checkDuplicates = !args.includes('--no-duplicates')
  const jsonOutput = args.includes('--json')
  const strict = args.includes('--strict')
  
  try {
    const result = validateFile(filePath, { category, checkDuplicates })
    
    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      console.log('\n=== 文档验证结果 ===\n')
      console.log(`文件: ${filePath}`)
      console.log(`状态: ${result.valid ? '✓ 通过' : '✗ 失败'}\n`)
      
      if (result.errors.length > 0) {
        console.log('❌ 错误:')
        result.errors.forEach(err => console.log(`   - ${err}`))
        console.log()
      }
      
      if (result.warnings.length > 0) {
        console.log('⚠️  警告:')
        result.warnings.forEach(warn => console.log(`   - ${warn}`))
        console.log()
      }
      
      if (result.info.length > 0) {
        console.log('ℹ️  信息:')
        result.info.forEach(info => console.log(`   ${info}`))
        console.log()
      }
    }
    
    // 如果 strict 模式且有警告，或者有错误，退出码为 1
    if (!result.valid || (strict && result.warnings.length > 0)) {
      process.exit(1)
    }
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
}
