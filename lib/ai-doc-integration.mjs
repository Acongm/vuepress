#!/usr/bin/env node
/**
 * AI 文档集成工具
 * AI Document Integration Tool
 * 
 * 整合文档验证和提交流程：
 * 1. 智能推荐分类
 * 2. 验证文档质量
 * 3. 提交到知识库
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// 导入查询和验证模块
import { suggestCategory } from './kb-query.mjs'
import { validateFile } from './doc-validator.mjs'

// ============ 工具函数 ============

function log(msg, level = 'info') {
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  }[level] || ''
  
  console.log(`${prefix} ${msg}`)
}

function execCommand(command, description) {
  log(description, 'info')
  try {
    const result = execSync(command, {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    })
    return result
  } catch (error) {
    throw new Error(`执行失败: ${error.message}`)
  }
}

/**
 * 从文件内容提取 frontmatter
 */
function extractFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8')
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
    
    if (value.startsWith('[') && value.endsWith(']')) {
      frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
    }
  }
  
  return frontmatter
}

/**
 * 从内容提取关键词
 */
function extractKeywords(content) {
  // 移除代码块
  const withoutCode = content.replace(/```[\s\S]*?```/g, '')
  
  // 提取标题中的关键词
  const headers = withoutCode.match(/^#+\s+(.+)$/gm) || []
  const headerText = headers.map(h => h.replace(/^#+\s+/, '')).join(' ')
  
  // 提取前 500 字符的关键词
  const preview = withoutCode.slice(0, 500)
  
  return (headerText + ' ' + preview).toLowerCase()
}

// ============ 主要功能 ============

/**
 * 智能推荐分类
 */
function recommendCategory(filePath, options = {}) {
  const { forceCategory } = options
  
  if (forceCategory) {
    log(`使用指定分类: ${forceCategory}`, 'info')
    return forceCategory
  }
  
  const content = readFileSync(filePath, 'utf-8')
  const keywords = extractKeywords(content)
  
  const suggestions = suggestCategory(keywords)
  
  if (suggestions.length === 0) {
    throw new Error('无法推荐分类，请手动指定 --category')
  }
  
  const best = suggestions[0]
  log(`智能推荐分类: ${best.category} (置信度: ${(best.confidence * 100).toFixed(0)}%)`, 'success')
  
  if (best.confidence < 0.5) {
    log('置信度较低，建议手动确认分类', 'warning')
  }
  
  return best.category
}

/**
 * 验证文档
 */
function validateDocument(filePath, category, options = {}) {
  const { strict = false } = options
  
  log('验证文档质量...', 'info')
  
  const result = validateFile(filePath, {
    category,
    checkDuplicates: true
  })
  
  // 显示验证结果
  if (result.errors.length > 0) {
    log('发现错误:', 'error')
    result.errors.forEach(err => console.log(`   - ${err}`))
  }
  
  if (result.warnings.length > 0) {
    log('发现警告:', 'warning')
    result.warnings.forEach(warn => console.log(`   - ${warn}`))
  }
  
  // 严格模式：警告也算失败
  if (!result.valid || (strict && result.warnings.length > 0)) {
    throw new Error('文档验证失败')
  }
  
  log('文档验证通过', 'success')
  
  return result
}

/**
 * 提交到知识库
 */
function submitToKnowledgeBase(filePath, category, options = {}) {
  const {
    title,
    questions = '',
    model = 'AI',
    dryRun = false
  } = options
  
  // 从文件名生成目标路径
  const filename = basename(filePath)
  const targetPath = `/${category}/${filename}`
  
  // 构建 ai-doc 命令
  const aiDocPath = resolve(ROOT, 'tools/ai-doc.mjs')
  
  let command = `node "${aiDocPath}" full --category "${category}" --file "${targetPath}"`
  
  if (title) {
    command += ` --title "${title}"`
  }
  
  if (questions) {
    command += ` --questions "${questions}"`
  }
  
  if (model) {
    command += ` --model "${model}"`
  }
  
  if (dryRun) {
    log('Dry-run 模式，不执行提交', 'info')
    log(`命令: ${command}`, 'info')
    return
  }
  
  log('提交到知识库...', 'info')
  
  try {
    const result = execCommand(command, '执行 ai-doc.mjs')
    log('提交成功', 'success')
    return result
  } catch (error) {
    throw new Error(`提交失败: ${error.message}`)
  }
}

/**
 * 完整工作流
 */
export async function integratedWorkflow(filePath, options = {}) {
  const {
    category: forceCategory,
    title,
    questions,
    model,
    strict = false,
    dryRun = false,
    skipValidation = false,
    skipRecommendation = false
  } = options
  
  log('=== AI 文档集成工具 ===\n', 'info')
  
  // 1. 检查文件存在
  if (!existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`)
  }
  
  log(`文件: ${filePath}`, 'info')
  
  // 2. 智能推荐分类
  let category = forceCategory
  if (!skipRecommendation && !forceCategory) {
    category = recommendCategory(filePath, { forceCategory })
  } else if (forceCategory) {
    log(`使用指定分类: ${forceCategory}`, 'info')
    category = forceCategory
  }
  
  // 3. 验证文档
  if (!skipValidation) {
    validateDocument(filePath, category, { strict })
  } else {
    log('跳过文档验证', 'warning')
  }
  
  // 4. 提取 frontmatter（如果没有提供 title）
  let finalTitle = title
  if (!finalTitle) {
    const frontmatter = extractFrontmatter(filePath)
    finalTitle = frontmatter.title || basename(filePath, '.md')
    log(`使用文档标题: ${finalTitle}`, 'info')
  }
  
  // 5. 提交到知识库
  submitToKnowledgeBase(filePath, category, {
    title: finalTitle,
    questions,
    model,
    dryRun
  })
  
  log('\n✅ 完成！', 'success')
}

// ============ CLI 接口 ============

function printHelp() {
  console.log(`
AI 文档集成工具 (AI Document Integration Tool)

用法:
  node lib/ai-doc-integration.mjs <file> [options]

选项:
  --category, -c <name>     指定分类（不指定则智能推荐）
  --title, -t <title>       文档标题（不指定则从 frontmatter 提取）
  --questions, -q <text>    原始问题（逗号分隔）
  --model, -m <name>        AI 模型名称
  --strict                  严格模式（警告也算错误）
  --dry-run                 试运行（不实际提交）
  --skip-validation         跳过文档验证
  --skip-recommendation     跳过分类推荐（需配合 --category）
  --help, -h                显示帮助

示例:
  # 完全自动化（推荐分类 + 验证 + 提交）
  node lib/ai-doc-integration.mjs /tmp/new-doc.md

  # 指定分类
  node lib/ai-doc-integration.mjs /tmp/new-doc.md --category react

  # 严格模式
  node lib/ai-doc-integration.mjs /tmp/new-doc.md --strict

  # 试运行（不实际提交）
  node lib/ai-doc-integration.mjs /tmp/new-doc.md --dry-run

  # 完整参数
  node lib/ai-doc-integration.mjs /tmp/new-doc.md \\
    --category react \\
    --title "React Hooks 指南" \\
    --questions "useState怎么用,useEffect依赖" \\
    --model "Claude Opus 4.5"
`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp()
    process.exit(0)
  }
  
  const filePath = args[0]
  
  // 辅助函数：安全获取参数值
  const getArg = (flag, shortFlag) => {
    const index = args.indexOf(flag)
    if (index !== -1 && args[index + 1]) return args[index + 1]
    if (shortFlag) {
      const shortIndex = args.indexOf(shortFlag)
      if (shortIndex !== -1 && args[shortIndex + 1]) return args[shortIndex + 1]
    }
    return undefined
  }
  
  const options = {
    category: getArg('--category', '-c'),
    title: getArg('--title', '-t'),
    questions: getArg('--questions', '-q'),
    model: getArg('--model', '-m'),
    strict: args.includes('--strict'),
    dryRun: args.includes('--dry-run'),
    skipValidation: args.includes('--skip-validation'),
    skipRecommendation: args.includes('--skip-recommendation')
  }
  
  integratedWorkflow(filePath, options)
    .then(() => process.exit(0))
    .catch(error => {
      log(error.message, 'error')
      process.exit(1)
    })
}
