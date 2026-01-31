#!/usr/bin/env node
/**
 * 导航配置同步脚本
 * 读取 nav-config.json，生成并更新 docs/.vuepress/config.ts 的 navbar 和 sidebar
 * 
 * 用法: 
 *   node .agents/skills/ai-doc/scripts/sync-nav-config.mjs          # 预览
 *   node .agents/skills/ai-doc/scripts/sync-nav-config.mjs --write  # 写入
 * 
 * 零依赖：仅使用 Node.js 标准库
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../..')
const NAV_CONFIG_PATH = resolve(__dirname, '../references/nav-config.json')
const CONFIG_TS_PATH = resolve(ROOT, 'docs/.vuepress/config.ts')

// ============ 工具函数 ============

/**
 * 将 navbar/sidebar 对象转换为 TypeScript 代码字符串
 */
function toTypeScriptCode(obj, indent = 6) {
  const spaces = ' '.repeat(indent)
  const innerSpaces = ' '.repeat(indent + 2)
  
  if (typeof obj === 'string') {
    return `'${obj}'`
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    const items = obj.map(item => toTypeScriptCode(item, indent + 2))
    return `[\n${innerSpaces}${items.join(`,\n${innerSpaces}`)}\n${spaces}]`
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'
    
    // 简单对象（text + link）单行输出
    if (entries.length <= 2 && entries.every(([k]) => ['text', 'link'].includes(k))) {
      const props = entries.map(([k, v]) => `${k}: '${v}'`).join(', ')
      return `{ ${props} }`
    }
    
    const props = entries.map(([key, value]) => {
      const formattedValue = toTypeScriptCode(value, indent + 2)
      return `${innerSpaces}${key}: ${formattedValue}`
    })
    return `{\n${props.join(',\n')}\n${spaces}}`
  }
  
  return String(obj)
}

/**
 * 生成 navbar 代码块
 */
function generateNavbarCode(navbar) {
  const groups = navbar.map((group, index) => {
    const comment = `      // ==================== ${group.text} ====================`
    const groupCode = toTypeScriptCode(group, 6)
    return `${comment}\n      ${groupCode}`
  })
  
  return `navbar: [\n${groups.join(',\n')}\n    ]`
}

/**
 * 生成 sidebar 代码块
 */
function generateSidebarCode(sidebar) {
  const entries = Object.entries(sidebar).map(([path, config]) => {
    const configCode = toTypeScriptCode(config, 6)
    return `      '${path}': ${configCode}`
  })
  
  return `sidebar: {\n${entries.join(',\n')}\n    }`
}

/**
 * 更新 config.ts 文件 - 使用更精确的括号匹配
 */
function updateConfigTs(configContent, navbarCode, sidebarCode) {
  // 方法：手动查找配对括号，避免贪婪匹配破坏结构
  
  // 1. 查找 navbar 的开始位置
  const navbarStart = configContent.indexOf('navbar: [')
  if (navbarStart === -1) throw new Error('找不到 navbar 定义')
  
  // 2. 从 navbar[ 开始，查找匹配的 ]
  let depth = 0
  let navbarEnd = navbarStart + 'navbar: ['.length - 1 // 指向 [
  for (let i = navbarEnd; i < configContent.length; i++) {
    if (configContent[i] === '[') depth++
    if (configContent[i] === ']') depth--
    if (depth === 0) {
      navbarEnd = i + 1 // 包含 ]
      break
    }
  }
  
  // 3. 替换 navbar
  const beforeNavbar = configContent.substring(0, navbarStart)
  const afterNavbar = configContent.substring(navbarEnd)
  let newContent = beforeNavbar + navbarCode + afterNavbar
  
  // 4. 在新内容中查找 sidebar
  const sidebarStart = newContent.indexOf('sidebar: {')
  if (sidebarStart === -1) throw new Error('找不到 sidebar 定义')
  
  // 5. 从 sidebar{ 开始，查找匹配的 }
  depth = 0
  let sidebarEnd = sidebarStart + 'sidebar: {'.length - 1 // 指向 {
  for (let i = sidebarEnd; i < newContent.length; i++) {
    if (newContent[i] === '{') depth++
    if (newContent[i] === '}') depth--
    if (depth === 0) {
      sidebarEnd = i + 1 // 包含 }
      break
    }
  }
  
  // 6. 替换 sidebar
  const beforeSidebar = newContent.substring(0, sidebarStart)
  const afterSidebar = newContent.substring(sidebarEnd)
  
  return beforeSidebar + sidebarCode + afterSidebar
}

// ============ 主程序 ============

function main() {
  const args = process.argv.slice(2)
  const shouldWrite = args.includes('--write') || args.includes('-w')
  const showHelp = args.includes('--help') || args.includes('-h')
  
  if (showHelp) {
    console.log(`
导航配置同步脚本

用法:
  node sync-nav-config.mjs          预览生成的配置
  node sync-nav-config.mjs --write  写入到 config.ts
  node sync-nav-config.mjs --help   显示帮助

文件:
  输入: .agents/skills/ai-doc/references/nav-config.json
  输出: docs/.vuepress/config.ts
`)
    process.exit(0)
  }
  
  // 检查文件
  if (!existsSync(NAV_CONFIG_PATH)) {
    console.error(`[sync-nav] ❌ 配置文件不存在: ${NAV_CONFIG_PATH}`)
    process.exit(1)
  }
  
  if (!existsSync(CONFIG_TS_PATH)) {
    console.error(`[sync-nav] ❌ config.ts 不存在: ${CONFIG_TS_PATH}`)
    process.exit(1)
  }
  
  // 读取配置
  console.log('[sync-nav] 读取配置文件...')
  const navConfig = JSON.parse(readFileSync(NAV_CONFIG_PATH, 'utf-8'))
  const configContent = readFileSync(CONFIG_TS_PATH, 'utf-8')
  
  // 生成代码
  console.log('[sync-nav] 生成 navbar 和 sidebar 代码...')
  const navbarCode = generateNavbarCode(navConfig.navbar)
  const sidebarCode = generateSidebarCode(navConfig.sidebar)
  
  // 更新内容
  const newContent = updateConfigTs(configContent, navbarCode, sidebarCode)
  
  if (shouldWrite) {
    writeFileSync(CONFIG_TS_PATH, newContent, 'utf-8')
    console.log('[sync-nav] ✅ 已更新 config.ts')
    console.log(`[sync-nav]    navbar: ${navConfig.navbar.length} 个分组`)
    console.log(`[sync-nav]    sidebar: ${Object.keys(navConfig.sidebar).length} 个路径`)
  } else {
    console.log('[sync-nav] 📋 预览模式（使用 --write 写入）')
    console.log(`[sync-nav]    navbar: ${navConfig.navbar.length} 个分组`)
    console.log(`[sync-nav]    sidebar: ${Object.keys(navConfig.sidebar).length} 个路径`)
    console.log('\n--- navbar 预览 (前 50 行) ---')
    console.log(navbarCode.split('\n').slice(0, 50).join('\n'))
    console.log('...')
  }
}

main()
