#!/usr/bin/env node
/**
 * 文档索引生成器
 * 扫描 docs/ 目录，为每个 .md 文件生成索引并自动打 tag
 * 
 * 用法: node tools/generate-doc-index.mjs
 * 输出: .agents/skills/ai-doc/references/docs-index.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { resolve, dirname, basename, extname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../../../..')  // scripts -> ai-doc -> skills -> .agents -> ROOT
const DOCS_DIR = resolve(ROOT, 'docs')
const OUTPUT_PATH = resolve(__dirname, '../references/docs-index.json')

// ============ 标签规则 ============

const TAG_RULES = {
  // 按目录自动打标签
  dirTags: {
    'JavaScript': ['javascript', 'language'],
    'TypeScript': ['typescript', 'language'],
    'css': ['css', 'language', 'style'],
    'react': ['react', 'framework'],
    'vue': ['vue', 'framework'],
    'Pattern': ['pattern', 'architecture'],
    'webpack': ['webpack', 'engineering', 'bundler'],
    'node': ['node', 'engineering', 'server'],
    'git': ['git', 'engineering', 'tooling'],
    'performance': ['performance', 'optimization'],
    'utils': ['utils', 'tooling'],
    'software': ['software', 'tooling'],
    'online-tools': ['tools', 'resources'],
    'issue': ['issue', 'debug', 'troubleshooting'],
    'ai': ['ai', 'emerging'],
    'mark': ['summary', 'advanced'],
    'interview-prep': ['interview', 'career'],
    'theory': ['interview', 'theory'],
    'interview': ['interview', 'career'],
    'job-description': ['resume', 'career']
  },

  // 按文件名关键词打标签
  fileKeywords: {
    'hook': ['hooks', 'react'],
    'class': ['class-component'],
    'render': ['rendering'],
    'promise': ['async', 'promise'],
    'async': ['async'],
    'closure': ['closure', 'scope'],
    'prototype': ['prototype', 'oop'],
    'this': ['this', 'context'],
    'bind': ['bind', 'this'],
    'call': ['call', 'this'],
    'apply': ['apply', 'this'],
    'new': ['new', 'constructor'],
    'scope': ['scope', 'closure'],
    'vite': ['vite', 'bundler'],
    'rollup': ['rollup', 'bundler'],
    'webpack': ['webpack', 'bundler'],
    'scss': ['scss', 'preprocessor'],
    'sass': ['sass', 'preprocessor'],
    'flex': ['flex', 'layout'],
    'grid': ['grid', 'layout'],
    'npm': ['npm', 'package-manager'],
    'yarn': ['yarn', 'package-manager'],
    'pnpm': ['pnpm', 'package-manager'],
    'commit': ['git', 'commit'],
    'command': ['command', 'cli'],
    'micro': ['micro-frontend'],
    'qiankun': ['qiankun', 'micro-frontend'],
    'ssr': ['ssr', 'server-rendering'],
    'nest': ['nestjs', 'backend'],
    'express': ['express', 'backend'],
    'h5': ['mobile', 'h5'],
    'pc': ['pc', 'desktop'],
    'skill': ['skill', 'ai'],
    'agent': ['agent', 'ai'],
    'prompt': ['prompt', 'ai'],
    'matrix': ['comparison', 'analysis'],
    'project': ['project', 'case-study'],
    'tech': ['tech-stack'],
    'react核心': ['react', 'core-principle'],
    '性能优化': ['performance', 'optimization'],
    '低代码': ['lowcode'],
    '微前端': ['micro-frontend'],
    '插件': ['plugin', 'architecture'],
    '骨架屏': ['skeleton', 'loading'],
    'http': ['http', 'network'],
    '缓存': ['cache', 'optimization']
  },

  // 按内容关键词打标签（读取文件前 500 字符）
  contentKeywords: {
    'useState': ['hooks', 'state'],
    'useEffect': ['hooks', 'effect'],
    'useContext': ['hooks', 'context'],
    'useMemo': ['hooks', 'memoization'],
    'useCallback': ['hooks', 'memoization'],
    'fiber': ['fiber', 'react-internals'],
    'virtual dom': ['virtual-dom'],
    'diff': ['diff-algorithm'],
    'composition api': ['composition-api', 'vue3'],
    'reactive': ['reactive', 'vue'],
    'pinia': ['pinia', 'state-management'],
    'vuex': ['vuex', 'state-management'],
    'redux': ['redux', 'state-management'],
    'loader': ['loader', 'webpack'],
    'plugin': ['plugin'],
    'tree shaking': ['tree-shaking', 'optimization'],
    'code splitting': ['code-splitting', 'optimization'],
    'hmr': ['hmr', 'hot-reload'],
    'babel': ['babel', 'transpiler'],
    'eslint': ['eslint', 'linter'],
    'prettier': ['prettier', 'formatter']
  }
}

// ============ 核心函数 ============

/**
 * 递归扫描目录获取所有 .md 文件
 */
function scanMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  
  for (const file of files) {
    const filePath = resolve(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      // 跳过特殊目录
      if (file.startsWith('.') || file === 'node_modules') continue
      scanMarkdownFiles(filePath, fileList)
    } else if (extname(file) === '.md') {
      fileList.push(filePath)
    }
  }
  
  return fileList
}

/**
 * 提取文件的 frontmatter
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  
  const frontmatter = {}
  const lines = match[1].split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      frontmatter[key] = value
    }
  }
  
  return frontmatter
}

/**
 * 为文件生成标签
 */
function generateTags(filePath, content) {
  const tags = new Set()
  const relativePath = relative(DOCS_DIR, filePath)
  const dirName = dirname(relativePath).split('/')[0]
  const fileName = basename(filePath, '.md').toLowerCase()
  const contentLower = content.slice(0, 2000).toLowerCase()
  
  // 1. 按目录打标签
  if (TAG_RULES.dirTags[dirName]) {
    TAG_RULES.dirTags[dirName].forEach(tag => tags.add(tag))
  }
  
  // 2. 按文件名关键词打标签
  for (const [keyword, keywordTags] of Object.entries(TAG_RULES.fileKeywords)) {
    if (fileName.includes(keyword.toLowerCase())) {
      keywordTags.forEach(tag => tags.add(tag))
    }
  }
  
  // 3. 按内容关键词打标签
  for (const [keyword, keywordTags] of Object.entries(TAG_RULES.contentKeywords)) {
    if (contentLower.includes(keyword.toLowerCase())) {
      keywordTags.forEach(tag => tags.add(tag))
    }
  }
  
  // 4. 特殊文件标签
  if (fileName === 'readme') {
    tags.add('index')
  }
  
  return Array.from(tags).sort()
}

/**
 * 提取文档标题
 */
function extractTitle(content, filePath) {
  // 优先从 frontmatter 获取
  const frontmatter = extractFrontmatter(content)
  if (frontmatter.title) {
    return frontmatter.title.replace(/['"]/g, '')
  }
  
  // 从第一个 # 标题获取
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }
  
  // 使用文件名
  return basename(filePath, '.md')
}

/**
 * 生成文档索引
 */
function generateDocIndex() {
  const files = scanMarkdownFiles(DOCS_DIR)
  const index = {
    _meta: {
      generatedAt: new Date().toISOString(),
      totalFiles: files.length,
      docsRoot: 'docs/'
    },
    categories: {},
    files: []
  }
  
  for (const filePath of files) {
    const relativePath = relative(DOCS_DIR, filePath)
    const dirName = dirname(relativePath).split('/')[0] || 'root'
    const content = readFileSync(filePath, 'utf-8')
    
    const fileInfo = {
      path: '/' + relativePath.replace(/\\/g, '/'),
      title: extractTitle(content, filePath),
      category: dirName,
      tags: generateTags(filePath, content),
      size: content.length,
      hasContent: content.trim().length > 100
    }
    
    index.files.push(fileInfo)
    
    // 统计分类
    if (!index.categories[dirName]) {
      index.categories[dirName] = { count: 0, files: [] }
    }
    index.categories[dirName].count++
    index.categories[dirName].files.push(fileInfo.path)
  }
  
  return index
}

/**
 * 生成 Markdown 格式的索引报告
 */
function generateMarkdownReport(index) {
  let md = `# 项目文档索引

> 自动生成于 ${index._meta.generatedAt.split('T')[0]}
> 共 ${index._meta.totalFiles} 个文档

## 分类统计

| 分类 | 文档数 |
|------|--------|
`

  const sortedCategories = Object.entries(index.categories)
    .sort((a, b) => b[1].count - a[1].count)
  
  for (const [cat, info] of sortedCategories) {
    md += `| ${cat} | ${info.count} |\n`
  }
  
  md += `\n## 文档列表\n\n`
  
  // 按分类分组输出
  for (const [category, info] of sortedCategories) {
    md += `### ${category} (${info.count})\n\n`
    
    const categoryFiles = index.files
      .filter(f => f.category === category)
      .sort((a, b) => a.path.localeCompare(b.path))
    
    for (const file of categoryFiles) {
      const tags = file.tags.length > 0 ? ` \`${file.tags.join('` `')}\`` : ''
      md += `- [${file.title}](${file.path})${tags}\n`
    }
    
    md += '\n'
  }
  
  return md
}

// ============ 主程序 ============

function main() {
  console.log('[doc-index] 扫描 docs/ 目录...')
  
  const index = generateDocIndex()
  
  // 保存 JSON 索引
  writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8')
  console.log(`[doc-index] ✅ JSON 索引已保存: ${relative(ROOT, OUTPUT_PATH)}`)
  console.log(`[doc-index]    共 ${index._meta.totalFiles} 个文件，${Object.keys(index.categories).length} 个分类`)
  
  // 保存 Markdown 报告
  const mdPath = OUTPUT_PATH.replace('.json', '.md')
  const mdReport = generateMarkdownReport(index)
  writeFileSync(mdPath, mdReport, 'utf-8')
  console.log(`[doc-index] ✅ Markdown 报告已保存: ${relative(ROOT, mdPath)}`)
  
  // 输出分类统计
  console.log('\n[doc-index] 分类统计:')
  const sortedCategories = Object.entries(index.categories)
    .sort((a, b) => b[1].count - a[1].count)
  for (const [cat, info] of sortedCategories) {
    console.log(`  ${cat.padEnd(20)} ${info.count} 个文档`)
  }
}

main()
