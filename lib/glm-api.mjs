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
    maxTokens = 8000,  // 增加到 8000 以支持更长的内容生成
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
  
  const systemPrompt = `你是一个专业的技术文档写作助手。你的任务是根据用户提供的主题生成高质量、内容丰富的技术文档。

核心要求：
1. 使用 Markdown 格式，结构清晰，层次分明
2. **内容要详尽丰富**：不少于 1500 字（不含代码），充分展开每个知识点
3. **深度解析**：不仅说明"是什么"，还要说明"为什么"和"怎么用"
4. **实用性强**：提供 3-5 个完整的代码示例，涵盖基础到进阶用法
5. 语言准确，技术细节正确，适合前端知识库存档

内容结构要求：
- 概述部分：介绍背景、重要性和应用场景（100-200字）
- 核心要点：每个要点包含详细解释、概念定义、应用场景、注意事项（每个要点至少 3-5 段）
- 详细解析：深入剖析底层原理、技术细节、优缺点、最佳实践
- 代码示例：至少 3 个完整示例，每个都有详细注释
- 常见问题：列出 3-5 个常见问题及详细解答
- 扩展阅读：相关主题、深入资源

输出格式要求：
- 包含完整的 YAML frontmatter（title, date, tags, ai_generated, ai_model）
- 使用二级、三级标题组织内容
- 代码块使用正确的语言标识（javascript, typescript, html, css等）
- 避免简短的一句话描述，每个知识点都要充分展开
- 注重细节和实用性，提供可操作的建议`
  
  const userPrompt = `请生成关于以下主题的技术文档：

主题：${topic}

${additionalContext ? `额外上下文：\n${additionalContext}\n` : ''}

请直接输出 Markdown 格式的文档内容，包含完整的 frontmatter。

**重要提示**：
- 请确保内容详尽丰富，不少于 1500 字（不含代码）
- 每个知识点都要充分展开，避免简短的一笔带过
- 提供至少 3 个完整的代码示例，每个都要有详细注释
- 包含实际应用场景、最佳实践、常见问题等实用内容
- 深入解释技术原理，不仅停留在表面
- 使用清晰的结构：概述 -> 核心要点 -> 详细解析 -> 代码示例 -> 常见问题 -> 扩展阅读`
  
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

优化目标：
1. 保持 Markdown 格式和原有 frontmatter
2. **大幅扩充内容**：目标字数不少于 1500 字（不含代码）
3. **增强深度**：补充详细的技术原理、实现细节、应用场景
4. **丰富示例**：确保至少有 3 个完整的代码示例，每个都有详细注释
5. **添加实用内容**：包括最佳实践、常见问题、注意事项、扩展阅读
6. 提升可读性和专业性，确保技术准确性

具体优化要求：
- 为每个要点添加详细的背景说明和应用场景
- 深入解释"为什么"和"怎么做"，不只是列举"是什么"
- 补充完整的代码示例，覆盖基础、进阶、实战场景
- 添加常见问题和解答（至少 3-5 个）
- 提供相关的扩展阅读和参考资源
- 避免简短的一句话描述，每个段落都要充分展开`
  
  const userPrompt = `请优化以下文档：

\`\`\`markdown
${content}
\`\`\`

请直接输出优化后的完整文档内容。

**重要提示**：
- 大幅扩充内容，目标不少于 1500 字（不含代码）
- 为每个知识点添加详细的解释、应用场景、注意事项
- 提供至少 3 个完整的代码示例，包含详细注释
- 添加"常见问题"、"详细解析"、"扩展阅读"等章节
- 深入讲解技术原理，不只是表面描述
- 确保内容实用、详尽、专业`
  
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
  --max-tokens <num>      最大 tokens（默认：8000）
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
