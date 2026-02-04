#!/usr/bin/env node
/**
 * 文档摘要生成工具
 * 为所有文档生成 AI 摘要，在构建时运行
 * 
 * 使用环境变量 GLM_API_KEY
 * 生成的摘要存储为 docs/.vuepress/public/summaries.json
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DOCS_DIR = resolve(ROOT, 'docs')
const OUTPUT_PATH = resolve(ROOT, 'docs/.vuepress/public/summaries.json')

// ============ 配置 ============

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL = 'glm-4-flash'
const MAX_CONTENT_LENGTH = 1000
const DELAY_BETWEEN_REQUESTS = 500 // 500ms 延迟避免限流

// ============ 工具函数 ============

function log(msg, level = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  }[level] || ''
  console.log(`[${timestamp}] ${prefix} ${msg}`)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractContent(markdown) {
  // 移除 frontmatter
  const withoutFrontmatter = markdown.replace(/^---\n[\s\S]*?\n---\n/, '')
  
  // 移除代码块
  const withoutCode = withoutFrontmatter.replace(/```[\s\S]*?```/g, '[代码示例]')
  
  // 提取前 N 字符
  return withoutCode.slice(0, MAX_CONTENT_LENGTH).trim()
}

function getAllMarkdownFiles(dir, baseDir = DOCS_DIR) {
  const files = []
  
  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      // 跳过一些目录
      if (item.startsWith('.') || item === 'node_modules') continue
      files.push(...getAllMarkdownFiles(fullPath, baseDir))
    } else if (stat.isFile() && extname(item) === '.md') {
      // 跳过 README.md
      if (item === 'README.md') continue
      
      // 转换为相对路径
      const relativePath = '/' + relative(baseDir, fullPath).replace(/\\/g, '/')
      files.push({
        path: relativePath,
        fullPath
      })
    }
  }
  
  return files
}

async function generateSummary(content, apiKey) {
  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: `你是一个技术文档分析专家。请对技术文档进行全面的内容提炼和分析。

输出要求：
1. 返回 JSON 格式
2. summary: 详细摘要（150-200字），包含核心概念、关键特性和应用场景
3. keyPoints: 3-5个核心要点，每个要点简洁明了
4. keywords: 3-5个关键技术词
5. techStack: 相关技术栈（如：React、TypeScript、Node.js等）
6. difficulty: 难度等级（入门/进阶/高级）
7. contentType: 内容类型（概念/实践/原理/工具）

返回格式示例：
{
  "summary": "React 16 引入了革命性的 Fiber 架构...",
  "keyPoints": ["要点1", "要点2", "要点3"],
  "keywords": ["React", "Fiber", "Hooks"],
  "techStack": ["React", "JavaScript"],
  "difficulty": "进阶",
  "contentType": "原理 + 实践"
}`
          },
          {
            role: 'user',
            content: `请分析以下技术文档并提炼关键信息，以 JSON 格式返回：\n\n${content}`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 请求失败 (${response.status}): ${errorText}`)
    }
    
    const data = await response.json()
    
    if (data.error) {
      throw new Error(`API 返回错误: ${JSON.stringify(data.error)}`)
    }
    
    const rawContent = data.choices[0]?.message?.content?.trim()
    
    if (!rawContent) {
      throw new Error('API 未返回摘要内容')
    }
    
    // 尝试解析 JSON
    try {
      // 提取 JSON 内容（可能被 markdown 代码块包裹）
      let jsonStr = rawContent
      const jsonMatch = rawContent.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1]
      }
      
      const parsed = JSON.parse(jsonStr)
      
      // 验证必需字段
      if (!parsed.summary) {
        throw new Error('缺少 summary 字段')
      }
      
      // 设置默认值
      return {
        summary: parsed.summary,
        keyPoints: parsed.keyPoints || [],
        keywords: parsed.keywords || [],
        techStack: parsed.techStack || [],
        difficulty: parsed.difficulty || '未分级',
        contentType: parsed.contentType || '综合'
      }
    } catch (parseError) {
      log(`JSON 解析失败，使用原始内容: ${parseError.message}`, 'warning')
      // 如果解析失败，返回基础格式
      return {
        summary: rawContent,
        keyPoints: [],
        keywords: [],
        techStack: [],
        difficulty: '未分级',
        contentType: '综合'
      }
    }
  } catch (error) {
    log(`生成摘要失败: ${error.message}`, 'error')
    return {
      summary: '暂无摘要',
      keyPoints: [],
      keywords: [],
      techStack: [],
      difficulty: '未分级',
      contentType: '综合'
    }
  }
}

async function generateAllSummaries() {
  log('开始生成文档摘要...')
  
  // 检查 API Key
  const apiKey = process.env.GLM_API_KEY
  if (!apiKey) {
    log('GLM_API_KEY 未配置，跳过摘要生成', 'warning')
    log('如需启用 AI 摘要功能，请配置 GitHub Secret: GLM_API_KEY', 'info')
    
    // 创建空的摘要文件
    const emptyData = {
      _meta: {
        generatedAt: new Date().toISOString(),
        totalFiles: 0,
        enabled: false,
        message: 'AI 摘要功能未启用。请配置 GLM_API_KEY 环境变量。'
      },
      summaries: {}
    }
    
    const publicDir = dirname(OUTPUT_PATH)
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true })
    }
    
    writeFileSync(OUTPUT_PATH, JSON.stringify(emptyData, null, 2))
    return
  }
  
  // 获取所有 Markdown 文件
  const files = getAllMarkdownFiles(DOCS_DIR)
  log(`找到 ${files.length} 个文档`)
  
  const summaries = {}
  let successCount = 0
  let errorCount = 0
  
  // 检查是否有缓存
  let cachedSummaries = {}
  if (existsSync(OUTPUT_PATH)) {
    try {
      const cached = JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
      cachedSummaries = cached.summaries || {}
      log(`加载缓存摘要：${Object.keys(cachedSummaries).length} 个`)
    } catch (e) {
      log('无法加载缓存，将重新生成所有摘要', 'warning')
    }
  }
  
  for (let i = 0; i < files.length; i++) {
    const { path, fullPath } = files[i]
    
    log(`[${i + 1}/${files.length}] 处理: ${path}`)
    
    try {
      // 检查缓存
      if (cachedSummaries[path]) {
        log(`  使用缓存摘要`, 'info')
        summaries[path] = cachedSummaries[path]
        successCount++
        continue
      }
      
      // 读取文档内容
      const markdown = readFileSync(fullPath, 'utf-8')
      const content = extractContent(markdown)
      
      if (!content || content.length < 50) {
        log(`  内容太短，跳过`, 'warning')
        summaries[path] = {
          summary: '内容太短，暂无摘要',
          keyPoints: [],
          keywords: [],
          techStack: [],
          difficulty: '未分级',
          contentType: '综合'
        }
        continue
      }
      
      // 生成摘要
      const summaryData = await generateSummary(content, apiKey)
      summaries[path] = summaryData
      
      log(`  ✓ 生成成功: ${summaryData.summary.slice(0, 50)}...`, 'success')
      successCount++
      
      // 延迟避免限流
      if (i < files.length - 1) {
        await sleep(DELAY_BETWEEN_REQUESTS)
      }
      
    } catch (error) {
      log(`  ✗ 失败: ${error.message}`, 'error')
      summaries[path] = {
        summary: '生成失败，请稍后重试',
        keyPoints: [],
        keywords: [],
        techStack: [],
        difficulty: '未分级',
        contentType: '综合'
      }
      errorCount++
    }
  }
  
  // 保存结果
  const publicDir = dirname(OUTPUT_PATH)
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }
  
  const data = {
    _meta: {
      version: '2.0',
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      successCount,
      errorCount,
      enabled: true,
      model: MODEL,
      enhanced: true,
      features: ['summary', 'keyPoints', 'keywords', 'techStack', 'difficulty', 'contentType']
    },
    summaries
  }
  
  writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2))
  
  log(`完成！成功: ${successCount}, 失败: ${errorCount}`, 'success')
  log(`摘要文件已保存: ${OUTPUT_PATH}`)
}

// ============ CLI 接口 ============

function printHelp() {
  console.log(`
文档摘要生成工具

用法:
  node tools/generate-summaries.mjs

环境变量:
  GLM_API_KEY    GLM-4 API 密钥（必需）

输出:
  docs/.vuepress/public/summaries.json

说明:
  1. 扫描 docs/ 目录下的所有 .md 文件
  2. 使用 GLM-4 为每个文档生成摘要
  3. 保存到 summaries.json 供前端读取
  4. 支持缓存，已生成的摘要不会重复生成

示例:
  export GLM_API_KEY="your-api-key"
  node tools/generate-summaries.mjs
`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.includes('--help') || args.includes('-h')) {
    printHelp()
    process.exit(0)
  }
  
  generateAllSummaries()
    .then(() => process.exit(0))
    .catch(error => {
      log(error.message, 'error')
      process.exit(1)
    })
}
