#!/usr/bin/env node
/**
 * Clawra CLI - Web Crawler Command Line Interface
 * 命令行工具：抓取网页内容并集成到知识库
 * 
 * 功能：
 * - 抓取单个或多个 URL
 * - 自动分类推荐
 * - 文档验证
 * - 集成到知识库工作流
 * 
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// 导入爬虫和集成模块
import { crawlUrl, crawlMultiple, generateDocument } from '../lib/web-crawler.mjs'
import { integratedWorkflow } from '../lib/ai-doc-integration.mjs'
import { suggestCategory } from '../lib/kb-query.mjs'

// ============ 工具函数 ============

function log(msg, level = 'info') {
  const prefix = {
    info: 'ℹ️ ',
    success: '✅',
    warning: '⚠️ ',
    error: '❌',
    spider: '🕷️ ',
    doc: '📄'
  }[level] || ''
  
  console.log(`${prefix} ${msg}`)
}

/**
 * 解析命令行参数
 */
function parseArgs(args) {
  const parsed = {
    urls: [],
    category: null,
    dryRun: false,
    output: null,
    timeout: 10000,
    skipValidation: false,
    skipSubmit: false,
    autoCategory: true,
    concurrency: 3,
    delay: 1000
  }
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    switch (arg) {
      case '--help':
      case '-h':
        return { showHelp: true }
      
      case '--category':
      case '-c':
        parsed.category = args[++i]
        parsed.autoCategory = false
        break
      
      case '--dry-run':
        parsed.dryRun = true
        break
      
      case '--output':
      case '-o':
        parsed.output = args[++i]
        break
      
      case '--timeout':
        parsed.timeout = parseInt(args[++i])
        break
      
      case '--skip-validation':
        parsed.skipValidation = true
        break
      
      case '--skip-submit':
        parsed.skipSubmit = true
        break
      
      case '--no-auto-category':
        parsed.autoCategory = false
        break
      
      case '--concurrency':
        parsed.concurrency = parseInt(args[++i])
        break
      
      case '--delay':
        parsed.delay = parseInt(args[++i])
        break
      
      default:
        // 如果以 http:// 或 https:// 开头，视为 URL
        if (arg.startsWith('http://') || arg.startsWith('https://')) {
          parsed.urls.push(arg)
        } else if (!arg.startsWith('--')) {
          // 尝试作为文件路径读取 URL 列表
          if (existsSync(arg)) {
            const content = readFileSync(arg, 'utf-8')
            const urls = content.split('\n')
              .map(line => line.trim())
              .filter(line => line && (line.startsWith('http://') || line.startsWith('https://')))
            parsed.urls.push(...urls)
          }
        }
    }
  }
  
  return parsed
}

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
Clawra CLI - Web Crawler Command Line Interface

用法:
  npm run kb:crawl <url> [options]
  或
  node tools/web-crawler-cli.mjs <url> [options]

参数:
  <url>                  要抓取的 URL（可以提供多个）
  <file>                 包含 URL 列表的文件（每行一个 URL）

选项:
  --category, -c <name>  指定分类（默认自动推荐）
  --dry-run              仅预览，不提交到知识库
  --output, -o <dir>     输出目录（默认 /tmp）
  --timeout <ms>         请求超时时间（默认 10000ms）
  --skip-validation      跳过文档验证
  --skip-submit          跳过提交到知识库
  --no-auto-category     禁用自动分类推荐
  --concurrency <n>      并发抓取数量（默认 3）
  --delay <ms>           批次间延迟时间（默认 1000ms）
  --help, -h             显示帮助信息

示例:
  # 抓取单个 URL 并自动提交
  npm run kb:crawl https://example.com/article
  
  # 抓取并指定分类
  npm run kb:crawl https://react.dev/hooks -c react
  
  # 抓取多个 URL
  npm run kb:crawl https://example.com/page1 https://example.com/page2
  
  # 从文件读取 URL 列表
  npm run kb:crawl urls.txt
  
  # 仅预览不提交
  npm run kb:crawl https://example.com/article --dry-run
  
  # 抓取并保存到指定目录（不提交）
  npm run kb:crawl https://example.com/article -o ./output --skip-submit

工作流程:
  1. 🕷️  抓取 URL 内容
  2. 📄 转换为 Markdown 格式
  3. 🤖 推荐分类（如果未指定）
  4. ✅ 验证文档质量
  5. 📦 提交到知识库
  6. 🔄 更新配置和提交 Git

相关命令:
  npm run kb:query suggest <content>  - 测试分类推荐
  npm run kb:validate <file>          - 验证文档
  npm run kb:add <file>               - 手动添加文档
`)
}

/**
 * 处理单个 URL
 */
async function processSingleUrl(url, options) {
  log(`开始抓取: ${url}`, 'spider')
  
  // 抓取内容
  const result = await crawlUrl(url, {
    timeout: options.timeout
  })
  
  if (!result.success) {
    log(`抓取失败: ${result.error}`, 'error')
    return { success: false, url, error: result.error }
  }
  
  log(`抓取成功: ${result.metadata.title}`, 'success')
  log(`  内容长度: ${result.markdown.length} 字符`, 'info')
  
  // 生成文档
  const document = generateDocument(result, {
    // 可以在这里添加额外的元数据覆盖
  })
  
  // 确定分类
  let category = options.category
  if (options.autoCategory && !category) {
    log('正在推荐分类...', 'info')
    const suggestion = await suggestCategory(
      result.metadata.title + '\n\n' + result.markdown.substring(0, 1000)
    )
    category = suggestion.category
    log(`推荐分类: ${category} (置信度: ${suggestion.confidence})`, 'info')
  }
  
  // 保存到临时文件
  const tempDir = options.output || tmpdir()
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true })
  }
  
  // 生成文件名（使用时间戳确保唯一性）
  const slug = result.metadata.title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
  
  // 时间戳用于避免文件名冲突，实际文档日期由 frontmatter 中的 date 字段控制
  const filename = `clawra-${Date.now()}-${slug}.md`
  const filepath = resolve(tempDir, filename)
  
  writeFileSync(filepath, document, 'utf-8')
  log(`已保存到: ${filepath}`, 'doc')
  
  if (options.dryRun) {
    log('Dry-run 模式，预览文档内容:', 'info')
    console.log('\n--- 文档预览 ---')
    console.log(document.substring(0, 500))
    console.log('...\n')
    return { success: true, url, filepath, category, dryRun: true }
  }
  
  if (options.skipSubmit) {
    log('已跳过提交到知识库', 'warning')
    return { success: true, url, filepath, category, skipped: true }
  }
  
  // 集成到知识库
  try {
    log('开始集成到知识库...', 'info')
    
    await integratedWorkflow(filepath, {
      category: category || undefined,
      skipValidation: options.skipValidation,
      dryRun: false
    })
    
    log('成功集成到知识库!', 'success')
    return { success: true, url, filepath, category }
  } catch (error) {
    log(`集成失败: ${error.message}`, 'error')
    return { success: false, url, filepath, error: error.message }
  }
}

/**
 * 处理多个 URL
 */
async function processMultipleUrls(urls, options) {
  log(`准备抓取 ${urls.length} 个 URL`, 'info')
  
  const results = []
  
  for (let i = 0; i < urls.length; i += options.concurrency) {
    const batch = urls.slice(i, i + options.concurrency)
    log(`处理批次 ${Math.floor(i / options.concurrency) + 1}/${Math.ceil(urls.length / options.concurrency)}`, 'info')
    
    const promises = batch.map(url => processSingleUrl(url, options))
    const batchResults = await Promise.all(promises)
    results.push(...batchResults)
    
    // 延迟以避免过载
    if (i + options.concurrency < urls.length) {
      await new Promise(resolve => setTimeout(resolve, options.delay))
    }
  }
  
  return results
}

/**
 * 显示结果摘要
 */
function showSummary(results) {
  console.log('\n=== 处理结果摘要 ===\n')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  const dryRun = results.filter(r => r.dryRun)
  const skipped = results.filter(r => r.skipped)
  
  console.log(`✅ 成功: ${successful.length}`)
  console.log(`❌ 失败: ${failed.length}`)
  if (dryRun.length > 0) {
    console.log(`👁️  预览: ${dryRun.length}`)
  }
  if (skipped.length > 0) {
    console.log(`⏭️  跳过: ${skipped.length}`)
  }
  
  if (successful.length > 0) {
    console.log('\n成功的文档:')
    successful.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.url}`)
      console.log(`     分类: ${result.category || '未指定'}`)
      console.log(`     文件: ${result.filepath}`)
    })
  }
  
  if (failed.length > 0) {
    console.log('\n失败的 URL:')
    failed.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.url}`)
      console.log(`     错误: ${result.error}`)
    })
  }
  
  console.log('')
}

// ============ 主函数 ============

async function main() {
  const args = process.argv.slice(2)
  const options = parseArgs(args)
  
  if (options.showHelp) {
    showHelp()
    return
  }
  
  if (options.urls.length === 0) {
    log('错误: 未提供 URL', 'error')
    console.log('使用 --help 查看帮助信息')
    process.exit(1)
  }
  
  log(`Clawra Web Crawler v1.0`, 'spider')
  log(`URL 数量: ${options.urls.length}`, 'info')
  if (options.category) {
    log(`指定分类: ${options.category}`, 'info')
  }
  if (options.dryRun) {
    log(`Dry-run 模式: 仅预览`, 'warning')
  }
  console.log('')
  
  try {
    let results
    if (options.urls.length === 1) {
      const result = await processSingleUrl(options.urls[0], options)
      results = [result]
    } else {
      results = await processMultipleUrls(options.urls, options)
    }
    
    showSummary(results)
    
    const hasFailures = results.some(r => !r.success)
    process.exit(hasFailures ? 1 : 0)
  } catch (error) {
    log(`致命错误: ${error.message}`, 'error')
    console.error(error.stack)
    process.exit(1)
  }
}

// ============ 入口 ============

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
