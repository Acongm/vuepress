#!/usr/bin/env node
/**
 * GLM-4 API 调用封装
 * GLM-4 API Wrapper for AI-powered document generation
 * 
 * 支持在 GitHub Actions 中安全调用 GLM-4 API
 * 使用环境变量 GLM_API_KEY 存储密钥
 * 
 * 功能：
 * - 对话补全（Chat Completion）
 * - 流式响应
 * - 错误处理和重试
 * - 安全的密钥管理
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ============ 配置 ============

const GLM_API_ENDPOINTS = {
  'glm-4': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  'glm-4-plus': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  'glm-4-0520': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  'glm-4-air': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  'glm-4-airx': 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  'glm-4-flash': 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
}

const DEFAULT_MODEL = 'glm-4-flash' // 最快速的模型
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1秒

// ============ 工具函数 ============

/**
 * 获取 API Key（优先级：参数 > 环境变量）
 */
function getApiKey(providedKey) {
  if (providedKey) return providedKey
  
  const key = process.env.GLM_API_KEY
  if (!key) {
    throw new Error('GLM API Key 未配置。请设置环境变量 GLM_API_KEY 或通过参数传入。')
  }
  
  return key
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 日志输出（支持脱敏）
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString()
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌'
  }[level] || ''
  
  console.log(`[${timestamp}] ${prefix} ${message}`)
}

/**
 * 脱敏 API Key（仅显示前4位和后4位）
 */
function maskApiKey(key) {
  if (!key || key.length < 12) return '***'
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

// ============ API 调用 ============

/**
 * 调用 GLM-4 Chat Completion API
 */
export async function chatCompletion(messages, options = {}) {
  const {
    apiKey,
    model = DEFAULT_MODEL,
    temperature = 0.7,
    topP = 0.9,
    maxTokens = 4000,
    stream = false,
    retries = MAX_RETRIES
  } = options
  
  const key = getApiKey(apiKey)
  const endpoint = GLM_API_ENDPOINTS[model] || GLM_API_ENDPOINTS[DEFAULT_MODEL]
  
  log(`调用 GLM-4 API (model: ${model}, key: ${maskApiKey(key)})`)
  
  const requestBody = {
    model,
    messages,
    temperature,
    top_p: topP,
    max_tokens: maxTokens,
    stream
  }
  
  let lastError
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(requestBody)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 请求失败 (${response.status}): ${errorText}`)
      }
      
      if (stream) {
        // 流式响应
        return response.body
      } else {
        // 非流式响应
        const data = await response.json()
        
        if (data.error) {
          throw new Error(`API 返回错误: ${JSON.stringify(data.error)}`)
        }
        
        log(`✅ API 调用成功 (tokens: ${data.usage?.total_tokens || 'unknown'})`, 'success')
        
        return {
          content: data.choices[0]?.message?.content || '',
          usage: data.usage,
          model: data.model,
          finishReason: data.choices[0]?.finish_reason
        }
      }
    } catch (error) {
      lastError = error
      log(`第 ${attempt}/${retries} 次尝试失败: ${error.message}`, 'warning')
      
      if (attempt < retries) {
        const delay = RETRY_DELAY * attempt
        log(`等待 ${delay}ms 后重试...`, 'info')
        await sleep(delay)
      }
    }
  }
  
  throw new Error(`API 调用失败（已重试 ${retries} 次）: ${lastError.message}`)
}

/**
 * 生成文档内容
 */
export async function generateDocument(topic, options = {}) {
  const {
    additionalContext = '',
    language = 'zh-CN',
    format = 'markdown',
    ...apiOptions
  } = options
  
  const systemPrompt = `你是一个专业的技术文档写作助手。你的任务是根据用户提供的主题生成高质量的技术文档。

要求：
1. 使用 Markdown 格式
2. 结构清晰，层次分明
3. 包含代码示例（如果适用）
4. 语言准确，技术细节正确
5. 适合前端知识库存档

输出格式要求：
- 包含 YAML frontmatter（title, date, tags）
- 至少包含一个一级标题
- 代码块使用正确的语言标识
- 内容长度适中（500-3000字）`
  
  const userPrompt = `请生成关于以下主题的技术文档：

主题：${topic}

${additionalContext ? `额外上下文：\n${additionalContext}\n` : ''}

请直接输出 Markdown 格式的文档内容，包含完整的 frontmatter。`
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
  
  log(`生成文档主题：${topic}`)
  
  const result = await chatCompletion(messages, apiOptions)
  
  return result.content
}

/**
 * 智能分类推荐（基于 AI）
 */
export async function suggestCategoryAI(content, options = {}) {
  const { ...apiOptions } = options
  
  const systemPrompt = `你是一个知识库分类专家。根据文档内容，从以下分类中推荐最合适的一个：

可用分类：
- JavaScript: JavaScript 核心语法、ES6+、异步编程、原型链等
- TypeScript: TypeScript 类型系统、泛型、工具类型等
- react: React 框架、Hooks、状态管理、性能优化等
- vue: Vue 框架、组合式 API、响应式原理等
- webpack: 构建工具 Webpack、Vite、Rollup 等
- css: CSS、SCSS、布局、动画等样式相关
- node: Node.js、npm、包管理、CLI 工具等
- performance: 性能优化、监控、指标等
- Pattern: 设计模式、通信模式、架构模式
- git: Git 版本控制、工作流、命令等
- utils: 工具函数、正则、常用库等
- issue: 踩坑记录、疑难杂症、兼容性问题
- software: 开发工具、软件配置、效率提升
- mark: 技能提炼、知识总结、专题整理
- ai: AI 工具、Skill、Agent、Prompt 工程等

请仅返回分类名称（英文），不要有任何其他文字。`
  
  const userPrompt = `请为以下文档内容推荐最合适的分类：

\`\`\`
${content.slice(0, 1000)}
\`\`\`

请直接返回分类名称（如：react、vue、JavaScript 等）`
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
  
  log('使用 AI 推荐分类...')
  
  const result = await chatCompletion(messages, {
    ...apiOptions,
    temperature: 0.3, // 降低温度以获得更确定的结果
    maxTokens: 50
  })
  
  const category = result.content.trim().replace(/['"]/g, '')
  
  log(`AI 推荐分类：${category}`, 'success')
  
  return category
}

/**
 * 优化文档内容
 */
export async function improveDocument(content, options = {}) {
  const { focus = 'all', ...apiOptions } = options
  
  const focusPrompts = {
    structure: '优化文档结构和层次',
    clarity: '提升表达清晰度',
    examples: '增加代码示例',
    details: '补充技术细节',
    all: '全面优化文档质量'
  }
  
  const systemPrompt = `你是一个技术文档优化专家。你的任务是${focusPrompts[focus] || focusPrompts.all}。

要求：
1. 保持 Markdown 格式
2. 保留原有 frontmatter
3. 不改变核心内容
4. 提升可读性和专业性
5. 确保技术准确性`
  
  const userPrompt = `请优化以下文档：

\`\`\`markdown
${content}
\`\`\`

请直接输出优化后的完整文档内容。`
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]
  
  log('使用 AI 优化文档...')
  
  const result = await chatCompletion(messages, apiOptions)
  
  return result.content
}

// ============ CLI 接口 ============

function printHelp() {
  console.log(`
GLM-4 API 工具 (GLM-4 API Wrapper)

用法:
  node lib/glm-api.mjs <command> [options]

命令:
  generate <topic>        生成文档内容
  suggest <file>          AI 智能分类推荐
  improve <file>          优化文档内容
  chat <message>          直接对话

选项:
  --api-key <key>         API Key（可选，默认使用环境变量 GLM_API_KEY）
  --model <name>          模型名称（默认：glm-4-flash）
  --temperature <num>     温度参数（0-1，默认：0.7）
  --max-tokens <num>      最大 tokens（默认：4000）
  --output <file>         输出文件路径

环境变量:
  GLM_API_KEY             GLM-4 API 密钥（必需）

支持的模型:
  glm-4-flash            最快速（推荐用于 CI/CD）
  glm-4-air              平衡版
  glm-4-airx             增强版
  glm-4                  标准版
  glm-4-plus             高级版
  glm-4-0520             特定版本

示例:
  # 设置 API Key
  export GLM_API_KEY="your-api-key-here"
  
  # 生成文档
  node lib/glm-api.mjs generate "React Hooks 最佳实践"
  
  # AI 智能分类推荐
  node lib/glm-api.mjs suggest /tmp/my-doc.md
  
  # 优化文档
  node lib/glm-api.mjs improve /tmp/my-doc.md --output /tmp/improved.md
  
  # 直接对话
  node lib/glm-api.mjs chat "解释一下 JavaScript 闭包"

GitHub Actions 中使用:
  1. 在仓库设置中添加 Secret: GLM_API_KEY
  2. 在 workflow 中设置环境变量:
     env:
       GLM_API_KEY: \${{ secrets.GLM_API_KEY }}
  3. 调用脚本:
     - run: node lib/glm-api.mjs generate "主题"
`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp()
    process.exit(0)
  }
  
  const command = args[0]
  const input = args[1]
  
  // 解析选项
  const options = {}
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--api-key' && args[i + 1]) {
      options.apiKey = args[++i]
    } else if (args[i] === '--model' && args[i + 1]) {
      options.model = args[++i]
    } else if (args[i] === '--temperature' && args[i + 1]) {
      options.temperature = parseFloat(args[++i])
    } else if (args[i] === '--max-tokens' && args[i + 1]) {
      options.maxTokens = parseInt(args[++i])
    } else if (args[i] === '--output' && args[i + 1]) {
      options.output = args[++i]
    }
  }
  
  try {
    let result
    
    switch (command) {
      case 'generate':
        if (!input) {
          console.error('错误: 需要指定主题')
          process.exit(1)
        }
        result = await generateDocument(input, options)
        break
      
      case 'suggest':
        if (!input) {
          console.error('错误: 需要指定文件路径')
          process.exit(1)
        }
        const content = readFileSync(input, 'utf-8')
        result = await suggestCategoryAI(content, options)
        break
      
      case 'improve':
        if (!input) {
          console.error('错误: 需要指定文件路径')
          process.exit(1)
        }
        const docContent = readFileSync(input, 'utf-8')
        result = await improveDocument(docContent, options)
        break
      
      case 'chat':
        if (!input) {
          console.error('错误: 需要指定消息内容')
          process.exit(1)
        }
        const chatResult = await chatCompletion([
          { role: 'user', content: input }
        ], options)
        result = chatResult.content
        break
      
      default:
        console.error(`未知命令: ${command}`)
        printHelp()
        process.exit(1)
    }
    
    // 输出结果
    if (options.output) {
      const { writeFileSync } = await import('node:fs')
      writeFileSync(options.output, result, 'utf-8')
      log(`结果已保存到: ${options.output}`, 'success')
    } else {
      console.log('\n' + result)
    }
    
    log('完成！', 'success')
  } catch (error) {
    log(error.message, 'error')
    process.exit(1)
  }
}
