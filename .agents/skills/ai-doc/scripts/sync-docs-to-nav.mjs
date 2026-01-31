#!/usr/bin/env node
/**
 * 文档同步到导航配置
 * 基于 docs-index.json 自动更新 nav-config.json 中缺失的文件
 * 
 * 用法:
 *   node .agents/skills/ai-doc/scripts/sync-docs-to-nav.mjs          # 预览
 *   node .agents/skills/ai-doc/scripts/sync-docs-to-nav.mjs --write  # 写入
 *   node .agents/skills/ai-doc/scripts/sync-docs-to-nav.mjs --full   # 写入并同步到 config.ts
 * 
 * 零依赖：仅使用 Node.js 标准库
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REFERENCES_DIR = resolve(__dirname, '../references')
const DOCS_INDEX_PATH = resolve(REFERENCES_DIR, 'docs-index.json')
const NAV_CONFIG_PATH = resolve(REFERENCES_DIR, 'nav-config.json')

// ============ 分类映射配置 ============

/**
 * 定义哪些分类应该同步到 nav-config
 * key: docs-index 中的 category 名
 * value: { navbar: navbar中的位置路径, sidebar: sidebar key }
 */
const CATEGORY_MAPPING = {
  'JavaScript': {
    navbarPath: ['基础语言', 'JavaScript'],
    sidebarKey: '/JavaScript/'
  },
  'TypeScript': {
    navbarPath: ['基础语言', 'TypeScript'],
    sidebarKey: '/TypeScript/'
  },
  'css': {
    navbarPath: ['基础语言', 'CSS'],
    sidebarKey: '/css/'
  },
  'react': {
    navbarPath: ['框架生态', 'React'],
    sidebarKey: '/react/'
  },
  'vue': {
    navbarPath: ['框架生态', 'Vue'],
    sidebarKey: '/vue/'
  },
  'Pattern': {
    navbarPath: ['框架生态', '设计模式'],
    sidebarKey: '/Pattern/',
    skipAutoSync: true  // Pattern 结构复杂，跳过自动同步
  },
  'webpack': {
    navbarPath: ['工程化', '构建工具'],
    sidebarKey: '/webpack/'
  },
  'node': {
    navbarPath: ['工程化', 'Node.js'],
    sidebarKey: '/node/'
  },
  'git': {
    navbarPath: ['工程化', 'Git'],
    sidebarKey: '/git/'
  },
  'performance': {
    navbarPath: ['工程化', '性能优化'],
    sidebarKey: '/performance/'
  },
  'mark': {
    navbarPath: ['进阶专题', '技能提炼'],
    sidebarKey: '/mark/'
  },
  'ai': {
    navbarPath: ['进阶专题', 'AI 开发'],
    sidebarKey: '/ai/'
  },
  'issue': {
    navbarPath: ['进阶专题', '踩坑记录'],
    sidebarKey: '/issue/'
  },
  'utils': {
    navbarPath: ['工具箱', '工具函数'],
    sidebarKey: '/utils/'
  },
  'online-tools': {
    navbarPath: ['工具箱', '在线工具'],
    sidebarKey: '/online-tools/'
  },
  'software': {
    navbarPath: ['工具箱', '软件推荐'],
    sidebarKey: '/software/'
  }
}

// 跳过同步的分类（这些有特殊结构）
const SKIP_CATEGORIES = [
  'interview-prep',
  'theory', 
  'interview',
  'job-description',
  '.',  // 根目录 README
]

// ============ 工具函数 ============

function log(msg) {
  console.log(`[sync-docs] ${msg}`)
}

function warn(msg) {
  console.log(`[sync-docs] ⚠️ ${msg}`)
}

/**
 * 从 nav-config 的 navbar 中提取指定路径的 children 数组
 */
function getNavbarChildren(navbar, pathArray) {
  let current = navbar
  
  for (const text of pathArray) {
    if (Array.isArray(current)) {
      const found = current.find(item => item.text === text)
      if (!found) return null
      current = found.children || []
    } else {
      return null
    }
  }
  
  return Array.isArray(current) ? current : null
}

/**
 * 设置 navbar 中指定路径的 children
 */
function setNavbarChildren(navbar, pathArray, children) {
  let current = navbar
  
  for (let i = 0; i < pathArray.length - 1; i++) {
    const text = pathArray[i]
    const found = current.find(item => item.text === text)
    if (!found) return false
    current = found.children || []
  }
  
  const lastText = pathArray[pathArray.length - 1]
  const target = current.find(item => item.text === lastText)
  if (!target) return false
  
  target.children = children
  return true
}

/**
 * 提取数组中所有路径字符串（递归处理对象）
 */
function extractPaths(arr) {
  const paths = new Set()
  
  for (const item of arr) {
    if (typeof item === 'string') {
      paths.add(item)
    } else if (item && typeof item === 'object') {
      if (item.link) paths.add(item.link)
      if (Array.isArray(item.children)) {
        for (const p of extractPaths(item.children)) {
          paths.add(p)
        }
      }
    }
  }
  
  return paths
}

/**
 * 判断文件是否应该跳过
 */
function shouldSkipFile(filePath) {
  // 跳过 README 文件（通常用 / 结尾的路径代替）
  if (filePath.endsWith('/README.md')) return true
  // 跳过模板文件
  if (filePath.includes('TEMPLATE')) return true
  return false
}

// ============ 主逻辑 ============

function syncDocsToNav(docsIndex, navConfig) {
  const changes = {
    navbar: [],
    sidebar: []
  }
  
  for (const [category, info] of Object.entries(docsIndex.categories)) {
    // 跳过特殊分类
    if (SKIP_CATEGORIES.includes(category)) continue
    
    const mapping = CATEGORY_MAPPING[category]
    if (!mapping) {
      warn(`未配置分类映射: ${category}`)
      continue
    }
    
    if (mapping.skipAutoSync) {
      log(`跳过自动同步: ${category}`)
      continue
    }
    
    // 获取 docs-index 中该分类的所有文件
    const indexFiles = info.files.filter(f => !shouldSkipFile(f))
    
    // 同步 navbar
    const navbarChildren = getNavbarChildren(navConfig.navbar, mapping.navbarPath)
    if (navbarChildren) {
      const existingPaths = extractPaths(navbarChildren)
      const newFiles = indexFiles.filter(f => !existingPaths.has(f))
      
      if (newFiles.length > 0) {
        // 添加新文件到 navbar children
        for (const f of newFiles) {
          navbarChildren.push(f)
        }
        changes.navbar.push({ category, added: newFiles })
      }
    }
    
    // 同步 sidebar
    const sidebarEntry = navConfig.sidebar[mapping.sidebarKey]
    if (sidebarEntry && Array.isArray(sidebarEntry)) {
      // sidebar 通常是 [{ text: '...', children: [...] }] 结构
      const firstGroup = sidebarEntry[0]
      if (firstGroup && Array.isArray(firstGroup.children)) {
        const existingPaths = extractPaths(firstGroup.children)
        const newFiles = indexFiles.filter(f => !existingPaths.has(f))
        
        if (newFiles.length > 0) {
          for (const f of newFiles) {
            firstGroup.children.push(f)
          }
          changes.sidebar.push({ category, added: newFiles })
        }
      }
    }
  }
  
  return changes
}

function main() {
  const args = process.argv.slice(2)
  const shouldWrite = args.includes('--write') || args.includes('-w')
  const fullSync = args.includes('--full')
  const showHelp = args.includes('--help') || args.includes('-h')
  
  if (showHelp) {
    console.log(`
文档同步到导航配置

用法:
  node sync-docs-to-nav.mjs          预览变更
  node sync-docs-to-nav.mjs --write  写入 nav-config.json
  node sync-docs-to-nav.mjs --full   写入并同步到 config.ts

流程:
  1. 读取 docs-index.json（文档索引）
  2. 对比 nav-config.json（导航配置）
  3. 将缺失的文件添加到对应分类
  4. (可选) 调用 sync-nav-config.mjs 更新 config.ts
`)
    process.exit(0)
  }
  
  // 检查文件
  if (!existsSync(DOCS_INDEX_PATH)) {
    console.error(`[sync-docs] ❌ 请先运行 generate-doc-index.mjs`)
    process.exit(1)
  }
  
  if (!existsSync(NAV_CONFIG_PATH)) {
    console.error(`[sync-docs] ❌ nav-config.json 不存在`)
    process.exit(1)
  }
  
  // 读取配置
  log('读取索引和配置...')
  const docsIndex = JSON.parse(readFileSync(DOCS_INDEX_PATH, 'utf-8'))
  const navConfig = JSON.parse(readFileSync(NAV_CONFIG_PATH, 'utf-8'))
  
  // 同步
  log('对比文件差异...')
  const changes = syncDocsToNav(docsIndex, navConfig)
  
  // 输出变更
  const totalNavbar = changes.navbar.reduce((sum, c) => sum + c.added.length, 0)
  const totalSidebar = changes.sidebar.reduce((sum, c) => sum + c.added.length, 0)
  
  if (totalNavbar === 0 && totalSidebar === 0) {
    log('✅ 无需更新，所有文件已同步')
    process.exit(0)
  }
  
  log(`\n发现 ${totalNavbar + totalSidebar} 个新文件需要同步:\n`)
  
  if (changes.navbar.length > 0) {
    console.log('📍 Navbar 更新:')
    for (const { category, added } of changes.navbar) {
      console.log(`  ${category}:`)
      for (const f of added) {
        console.log(`    + ${f}`)
      }
    }
    console.log('')
  }
  
  if (changes.sidebar.length > 0) {
    console.log('📂 Sidebar 更新:')
    for (const { category, added } of changes.sidebar) {
      console.log(`  ${category}:`)
      for (const f of added) {
        console.log(`    + ${f}`)
      }
    }
    console.log('')
  }
  
  // 写入
  if (shouldWrite || fullSync) {
    // 更新 meta
    navConfig._meta.lastUpdated = new Date().toISOString().split('T')[0]
    
    writeFileSync(NAV_CONFIG_PATH, JSON.stringify(navConfig, null, 2), 'utf-8')
    log('✅ 已更新 nav-config.json')
    
    if (fullSync) {
      log('\n同步到 config.ts...')
      try {
        execSync('node .agents/skills/ai-doc/scripts/sync-nav-config.mjs --write', {
          cwd: resolve(__dirname, '../../../..'),
          stdio: 'inherit'
        })
      } catch (err) {
        console.error('[sync-docs] ❌ 同步 config.ts 失败')
        process.exit(1)
      }
    }
  } else {
    log('📋 预览模式（使用 --write 或 --full 写入）')
  }
}

main()
