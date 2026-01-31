#!/usr/bin/env node
/**
 * AI 文档整理工具
 * 用于 /ai-doc 工作流的辅助脚本
 *
 * 功能：
 * - update-config: 更新 docs/.vuepress/config.ts (sidebar + navbar)
 * - changelog: 追加 AI_CHANGELOG.md
 * - commit: git add + commit + push
 * - full: 执行以上全部
 *
 * 遵循 tools/ 约定：无外部依赖，仅 Node.js >= 18 标准库
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONFIG_PATH = resolve(ROOT, 'docs/.vuepress/config.ts')
const CHANGELOG_PATH = resolve(ROOT, 'AI_CHANGELOG.md')
const KNOWLEDGE_MAP_PATH = resolve(__dirname, 'knowledge-map.json')

// ============ 工具函数 ============

function loadKnowledgeMap() {
  return JSON.parse(readFileSync(KNOWLEDGE_MAP_PATH, 'utf-8'))
}

function readConfig() {
  return readFileSync(CONFIG_PATH, 'utf-8')
}

function writeConfig(content) {
  writeFileSync(CONFIG_PATH, content, 'utf-8')
}

function log(msg) {
  console.log(`[ai-doc] ${msg}`)
}

function error(msg) {
  console.error(`[ai-doc] ❌ ${msg}`)
  process.exit(1)
}

// ============ 核心功能 ============

/**
 * 更新 sidebar 配置
 * @param {string} configContent - config.ts 内容
 * @param {string} sidebarKey - sidebar 的 key，如 '/JavaScript/'
 * @param {string} filePath - 新文件路径，如 '/JavaScript/promise-chain.md'
 * @returns {string} - 更新后的配置内容
 */
function updateSidebar(configContent, sidebarKey, filePath) {
  const newEntry = `'${filePath}'`

  // 检查是否已存在
  if (configContent.includes(newEntry)) {
    log(`ℹ️ sidebar 已包含: ${filePath}`)
    return configContent
  }

  // 构建正则匹配 sidebar 中对应分类的 children 数组
  // 格式: '/JavaScript/': [ { text: '...', children: [...] } ]
  const escapedKey = sidebarKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // 匹配模式：找到 'sidebarKey': [ { ... children: [ ... ] } ]
  const sidebarRegex = new RegExp(
    `('${escapedKey}':\\s*\\[[^\\]]*children:\\s*\\[)([^\\]]*)(\\])`,
    's'
  )

  const match = configContent.match(sidebarRegex)
  if (!match) {
    // 尝试另一种格式：直接数组 '/git/': ['/git/', '/git/command.md']
    const simpleRegex = new RegExp(
      `('${escapedKey}':\\s*\\[)([^\\]]*)(\\])`,
      's'
    )
    const simpleMatch = configContent.match(simpleRegex)
    if (simpleMatch) {
      const childrenContent = simpleMatch[2]
      const trimmed = childrenContent.trimEnd()
      const needsComma = trimmed.length > 0 && !trimmed.endsWith(',')

      const updated = trimmed + (needsComma ? ',' : '') + ` ${newEntry}`
      const newConfig = configContent.replace(simpleRegex, `$1${updated}$3`)

      log(`✅ sidebar 已更新: ${sidebarKey} += ${filePath}`)
      return newConfig
    }

    log(`⚠️ 未找到 sidebar 配置: ${sidebarKey}，跳过 sidebar 更新`)
    return configContent
  }

  const childrenContent = match[2]
  const trimmed = childrenContent.trimEnd()
  const needsComma = trimmed.length > 0 && !trimmed.endsWith(',')
  const indent = '            ' // 匹配现有缩进

  const updated = trimmed + (needsComma ? ',' : '') + `\n${indent}${newEntry}`
  const newConfig = configContent.replace(sidebarRegex, `$1${updated}\n          $3`)

  log(`✅ sidebar 已更新: ${sidebarKey} += ${filePath}`)
  return newConfig
}

/**
 * 更新 navbar 配置（精确定位版本）
 * @param {string} configContent - config.ts 内容
 * @param {string} categoryName - 分类名称，如 'JavaScript'
 * @param {string} navbarLocation - navbar 位置，如 'navbar[3].children[0].children'
 * @param {string} filePath - 新文件路径，如 '/JavaScript/promise-chain.md'
 * @returns {string} - 更新后的配置内容
 */
function updateNavbar(configContent, categoryName, navbarLocation, filePath) {
  // 如果 navbarLocation 为 null，说明这个分类在 navbar 中没有 children 数组
  if (!navbarLocation) {
    log(`ℹ️ navbar 分类 ${categoryName} 无 children 数组，跳过 navbar 更新`)
    return configContent
  }

  const newEntry = `'${filePath}'`

  // 检查是否已存在
  if (configContent.includes(newEntry)) {
    log(`ℹ️ navbar 可能已包含: ${filePath}`)
    return configContent
  }

  // 根据 navbarLocation 构建精确的匹配模式
  // navbarLocation 格式: navbar[3].children[0].children
  // 我们需要找到 text: 'categoryName' 后面的 children 数组

  // 策略：找到 text: 'categoryName' 所在的对象，然后定位其 children
  const textPattern = new RegExp(
    `(text:\\s*'${categoryName}'[^}]*?children:\\s*\\[)([^\\]]*)(\\])`,
    's'
  )

  const match = configContent.match(textPattern)
  if (match) {
    const childrenContent = match[2]
    const trimmed = childrenContent.trimEnd()
    const needsComma = trimmed.length > 0 && !trimmed.endsWith(',')

    const updated = trimmed + (needsComma ? ',' : '') + `\n              ${newEntry}`
    const newConfig = configContent.replace(textPattern, `$1${updated}\n            $3`)

    if (newConfig !== configContent) {
      log(`✅ navbar 已更新: ${categoryName} += ${filePath}`)
      return newConfig
    }
  }

  log(`⚠️ navbar 更新跳过（未找到匹配位置）: ${filePath}`)
  return configContent
}

/**
 * 追加 AI 更新日志
 */
function appendChangelog(entry) {
  const { title, filePath, category, questions, model, commitHash } = entry
  const date = new Date().toISOString().split('T')[0]

  const logEntry = `
### ${title}
- **文件**: \`${filePath}\`
- **分类**: ${category}
- **来源问题**:
${questions.map(q => `  - "${q}"`).join('\n')}
- **AI 模型**: ${model}
- **Commit**: \`${commitHash || 'pending'}\`

`

  if (!existsSync(CHANGELOG_PATH)) {
    // 创建新的 changelog
    const header = `# AI 知识库更新日志

记录通过 \`/ai-doc\` 命令整理的 AI 对话知识。

---

## ${date}
${logEntry}`
    writeFileSync(CHANGELOG_PATH, header, 'utf-8')
    log(`✅ 创建 AI_CHANGELOG.md`)
  } else {
    // 追加到现有 changelog
    let content = readFileSync(CHANGELOG_PATH, 'utf-8')

    // 检查今天的日期标题是否存在
    if (content.includes(`## ${date}`)) {
      // 在日期标题后追加
      content = content.replace(`## ${date}`, `## ${date}\n${logEntry}`)
    } else {
      // 在 --- 后添加新日期
      const insertPoint = content.indexOf('---')
      if (insertPoint !== -1) {
        content = content.slice(0, insertPoint + 3) + `\n\n## ${date}\n${logEntry}` + content.slice(insertPoint + 3)
      } else {
        content += `\n\n## ${date}\n${logEntry}`
      }
    }

    writeFileSync(CHANGELOG_PATH, content, 'utf-8')
    log(`✅ 更新 AI_CHANGELOG.md`)
  }
}

/**
 * Git 提交并推送
 */
function gitCommitAndPush(title, category, model) {
  const date = new Date().toISOString()

  try {
    // Stage all changes
    execSync('git add -A', { cwd: ROOT, stdio: 'pipe' })

    // Commit with structured message
    const commitMsg = `docs(ai): ${title}

Category: ${category}
AI-Model: ${model}
Generated: ${date}
`
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, {
      cwd: ROOT,
      stdio: 'pipe'
    })

    log(`✅ Git commit: docs(ai): ${title}`)

    // Push
    execSync('git push', { cwd: ROOT, stdio: 'pipe' })
    log(`✅ Git push 完成`)

    // 获取 commit hash
    const hash = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim()
    return hash
  } catch (err) {
    error(`Git 操作失败: ${err.message}`)
  }
}

// ============ CLI ============

function printHelp() {
  console.log(`
AI 文档整理工具

用法:
  node tools/ai-doc.mjs <command> [options]

命令:
  update-config   更新 config.ts (sidebar + navbar)
  changelog       追加 AI_CHANGELOG.md
  commit          Git add + commit + push
  full            执行全部操作
  categories      列出所有可用分类

选项:
  --category, -c    分类名称 (如: JavaScript, react, webpack)
  --file, -f        文件路径 (如: /JavaScript/promise-chain.md)
  --title, -t       文档标题
  --questions, -q   原始问题 (逗号分隔)
  --model, -m       AI 模型名称
  --help, -h        显示帮助

示例:
  node tools/ai-doc.mjs update-config -c JavaScript -f /JavaScript/promise-chain.md
  node tools/ai-doc.mjs full -c JavaScript -f /JavaScript/promise-chain.md -t "Promise链式调用" -q "问题1,问题2" -m "Claude Opus 4.5"
`)
}

function parseArgs(args) {
  const result = { command: null, options: {} }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    if (!arg.startsWith('-') && !result.command) {
      result.command = arg
      continue
    }

    switch (arg) {
      case '--category':
      case '-c':
        result.options.category = args[++i]
        break
      case '--file':
      case '-f':
        result.options.file = args[++i]
        break
      case '--title':
      case '-t':
        result.options.title = args[++i]
        break
      case '--questions':
      case '-q':
        result.options.questions = args[++i]?.split(',').map(s => s.trim())
        break
      case '--model':
      case '-m':
        result.options.model = args[++i]
        break
      case '--help':
      case '-h':
        result.command = 'help'
        break
    }
  }

  return result
}

function listCategories() {
  const map = loadKnowledgeMap()
  console.log('\n可用分类（✅ 可归档 / ❌ 不可归档）:\n')
  for (const [name, info] of Object.entries(map.categories)) {
    const status = info.archivable ? '✅' : '❌'
    const navbarStatus = info.navbarLocation ? '📍' : '🔗'
    console.log(`  ${status} ${name.padEnd(18)} ${navbarStatus} ${info.description}`)
  }
  console.log('\n  📍 = navbar 有 children 可更新')
  console.log('  🔗 = navbar 是单独链接，仅更新 sidebar\n')
}

// ============ 主程序 ============

function main() {
  const { command, options } = parseArgs(process.argv.slice(2))

  if (!command || command === 'help') {
    printHelp()
    process.exit(0)
  }

  if (command === 'categories') {
    listCategories()
    process.exit(0)
  }

  const map = loadKnowledgeMap()

  switch (command) {
    case 'update-config': {
      if (!options.category || !options.file) {
        error('需要 --category 和 --file 参数')
      }

      const categoryInfo = map.categories[options.category]
      if (!categoryInfo) {
        error(`未知分类: ${options.category}`)
      }

      let config = readConfig()
      config = updateSidebar(config, categoryInfo.sidebarKey, options.file)
      config = updateNavbar(config, options.category, categoryInfo.navbarLocation, options.file)
      writeConfig(config)
      break
    }

    case 'changelog': {
      if (!options.title || !options.file || !options.category) {
        error('需要 --title, --file, --category 参数')
      }

      appendChangelog({
        title: options.title,
        filePath: options.file,
        category: options.category,
        questions: options.questions || ['(未记录)'],
        model: options.model || 'Unknown',
        commitHash: null
      })
      break
    }

    case 'commit': {
      if (!options.title || !options.category) {
        error('需要 --title 和 --category 参数')
      }

      gitCommitAndPush(options.title, options.category, options.model || 'Unknown')
      break
    }

    case 'full': {
      if (!options.category || !options.file || !options.title) {
        error('需要 --category, --file, --title 参数')
      }

      const categoryInfo = map.categories[options.category]
      if (!categoryInfo) {
        error(`未知分类: ${options.category}`)
      }

      // 1. 更新 config
      let config = readConfig()
      config = updateSidebar(config, categoryInfo.sidebarKey, options.file)
      config = updateNavbar(config, options.category, categoryInfo.navbarLocation, options.file)
      writeConfig(config)

      // 2. 更新 changelog
      appendChangelog({
        title: options.title,
        filePath: options.file,
        category: options.category,
        questions: options.questions || ['(未记录)'],
        model: options.model || 'Unknown',
        commitHash: null
      })

      // 3. Git commit & push
      const hash = gitCommitAndPush(options.title, options.category, options.model || 'Unknown')

      log(`\n🎉 完成！Commit: ${hash}`)
      break
    }

    default:
      error(`未知命令: ${command}`)
  }
}

main()
