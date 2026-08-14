#!/usr/bin/env node
/**
 * Copy vuepress docs → portal content/docs + generate meta.json from nav-config.
 *
 * Usage (from portal repo root):
 *   node scripts/migrate-from-vuepress.mjs --source /path/to/vuepress/docs
 *   node scripts/migrate-from-vuepress.mjs --source ../vuepress/docs --dry-run
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const PORTAL_ROOT = join(ROOT, '..')
const DEFAULT_SOURCE = join(PORTAL_ROOT, '..', 'vuepress', 'docs')
const DEFAULT_TARGET = join(PORTAL_ROOT, 'apps', 'portal', 'content', 'docs')

const SKIP_DIRS = new Set(['.vuepress', 'node_modules', '.git'])
const SKIP_TOP = new Set(['superpowers']) // internal specs, not public docs

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const sourceDir = args.find((a) => a.startsWith('--source='))?.split('=')[1] || DEFAULT_SOURCE
const targetDir =
  args.find((a) => a.startsWith('--target='))?.split('=')[1] || DEFAULT_TARGET
const vuepressRoot = dirname(sourceDir)
const NAV_CONFIG_PATH =
  args.find((a) => a.startsWith('--nav-config='))?.split('=')[1] ||
  join(vuepressRoot, '.agents', 'skills', 'ai-doc', 'references', 'nav-config.json')
const CONFIG_TS_PATH = join(vuepressRoot, 'docs', '.vuepress', 'config.ts')
const VUEPRESS_PUBLIC_PATH = join(vuepressRoot, 'docs', '.vuepress', 'public')
const VUEPRESS_ALIAS_PATH = join(vuepressRoot, 'docs', '.vuepress', 'alias')
const PORTAL_PUBLIC = join(PORTAL_ROOT, 'apps', 'portal', 'public')

const ROOT_SECTION_ORDER = [
  'JavaScript',
  'TypeScript',
  'css',
  'react',
  'vue',
  'Pattern',
  'webpack',
  'node',
  'git',
  'performance',
  'mark',
  'ai',
  'daily-news',
  'issue',
  'utils',
  'online-tools',
  'software',
  'interview-prep',
  'theory',
  'interview',
  'job-description',
  'travel'
]

function log(...a) {
  console.log(...a)
}

function vuePathToSlug(vuePath) {
  let p = vuePath.trim()
  if (p.startsWith('/')) p = p.slice(1)
  if (p.endsWith('/')) return 'index'
  if (p.endsWith('.md')) p = p.slice(0, -3)
  if (p.endsWith('.html')) p = p.slice(0, -5)
  const parts = p.split('/')
  const file = parts.pop()
  if (file === 'README' || file === 'index') return parts.length ? `${parts.join('/')}/index` : 'index'
  return p
}

function slugToPagesEntry(slug) {
  if (slug === 'index') return 'index'
  if (slug.endsWith('/index')) return slug
  return slug
}

function parseSidebarFromNav(navConfig) {
  const map = {}
  for (const [prefix, groups] of Object.entries(navConfig.sidebar || {})) {
    const folder = prefix.replace(/^\/|\/$/g, '')
    map[folder] = groups
  }
  return map
}

function extractDailyNewsFromConfig(configText) {
  const re = /'(\/daily-news\/[^']+\.md)'/g
  const paths = []
  let m
  while ((m = re.exec(configText)) !== null) {
    paths.push(m[1])
  }
  // dedupe preserving order
  const seen = new Set()
  return paths.filter((p) => {
    if (seen.has(p)) return false
    seen.add(p)
    return true
  })
}

function flattenSidebarGroups(groups, folder) {
  const pages = []
  for (const item of groups) {
    if (item.link) {
      const slug = vuePathToSlug(item.link)
      const rel = slug === 'index' ? 'index' : slug.startsWith(folder + '/') ? slug.slice(folder.length + 1) : slug
      if (rel === 'index' || !pages.includes(rel)) pages.push(rel === `${folder}/index` ? 'index' : rel.replace(`${folder}/`, ''))
      continue
    }
    if (item.children) {
      if (item.text && item.children.every((c) => typeof c === 'string')) {
        // subgroup label with path children
        const childSlugs = item.children.map((c) => {
          const slug = vuePathToSlug(c)
          if (slug === `${folder}/index` || slug === 'index') return 'index'
          if (slug.startsWith(folder + '/')) return slug.slice(folder.length + 1)
          return slug
        })
        const hasSubfolder = childSlugs.some((s) => s.includes('/') && s !== 'index')
        if (hasSubfolder && item.text !== folder) {
          pages.push(`---${item.text}---`)
        }
        for (const s of childSlugs) {
          const entry = s === 'index' ? 'index' : s
          if (!pages.includes(entry)) pages.push(entry)
        }
      } else {
        for (const c of item.children) {
          if (typeof c === 'string') {
            const slug = vuePathToSlug(c)
            let entry = slug
            if (slug.startsWith(folder + '/')) entry = slug.slice(folder.length + 1)
            if (entry === 'index' || entry.endsWith('/index')) entry = entry.replace(/\/index$/, '') === '' ? 'index' : entry
            if (!pages.includes(entry)) pages.push(entry)
          }
        }
      }
    }
  }
  return pages
}

function listMdFiles(dir, base = dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(name)) continue
      out.push(...listMdFiles(full, base))
    } else if (name.endsWith('.md')) {
      out.push(relative(base, full).replace(/\\/g, '/'))
    }
  }
  return out
}

function escapeYaml(s) {
  if (/[:#\n]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`
  return s
}

function deriveTitle(body, fileRel) {
  const h1 = body.match(/^#\s+(.+?)\s*$/m)
  if (h1) return h1[1].trim()
  const base = fileRel.replace(/\.md$/, '').split('/').pop() || '文档'
  if (base === 'index') {
    const parts = fileRel.replace(/\.md$/, '').split('/')
    parts.pop()
    return parts.pop() || '文档'
  }
  return base
}

function ensureTitleFrontmatter(body, fileRel) {
  const fmMatch = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (fmMatch) {
    const fm = fmMatch[1]
    if (/^title\s*:/m.test(fm)) return body
    const title = deriveTitle(body.slice(fmMatch[0].length), fileRel)
    return `---\ntitle: ${escapeYaml(title)}\n${fm}\n---\n${body.slice(fmMatch[0].length)}`
  }
  const title = deriveTitle(body, fileRel)
  return `---\ntitle: ${escapeYaml(title)}\n---\n\n${body}`
}

function transformMarkdown(content, fileRel) {
  let body = content

  // Strip vuepress home frontmatter blocks
  if (body.startsWith('---\n') && body.includes('home:')) {
    const end = body.indexOf('\n---\n', 4)
    if (end !== -1) body = body.slice(end + 5)
  } else if (body.startsWith('---\n')) {
    const end = body.indexOf('\n---\n', 4)
    if (end !== -1 && end < 800) body = body.slice(end + 5)
  }

  body = body.replace(/\]\(\.\.\/\.vuepress\/alias\/images\/([^)]+)\)/g, '](/images/$1)')
  body = body.replace(/\]\(\.\.\/\.vuepress\/public\/([^)]+)\)/g, '](/$1)')
  body = body.replace(/::: tip ([^\n]*)\n([\s\S]*?):::/g, (_, title, inner) => {
    const t = title.trim()
    return `> **${t || '提示'}**\n>\n${inner.replace(/^/gm, '> ').trimEnd()}\n`
  })
  body = body.replace(/::: tip\n([\s\S]*?):::/g, (_, inner) => {
    return `> **提示**\n>\n${inner.replace(/^/gm, '> ').trimEnd()}\n`
  })

  // VuePress custom blocks .html links -> strip .html
  body = body.replace(/```(code|markup|gcode)(\r?\n)/g, '```text$2')
  body = body.replace(
    /!\[([^\]]*)\]\(https:\/\/camo\.githubusercontent\.com[^)]+\)/g,
    '[$1](https://pnpm.io)'
  )
  body = body.replace(
    /!\[([^\]]*)\]\(\.\/assets\/(2026-08-zhuhai-chimelong\/[^)]+)\)/g,
    '<img src="/travel/assets/$2" alt="$1" style="max-width:100%;height:auto" />'
  )
  body = body.replace(/!\[([^\]]*)\]\(\.\/assets\/[^)]+\)/g, '_（图示：$1）_')
  body = body.replace(/\[[^\]]*\]\(\.\/assets\/[^)]+\)/g, '')
  body = body.replace(/\]\((\/[^)]+)\.html\)/g, ']($1)')

  return ensureTitleFrontmatter(body.trim(), fileRel) + '\n'
}

function copyDocs() {
  if (!dryRun) {
    rmSync(targetDir, { recursive: true, force: true })
    mkdirSync(targetDir, { recursive: true })
  }

  let copied = 0
  for (const name of readdirSync(sourceDir)) {
    if (SKIP_DIRS.has(name) || SKIP_TOP.has(name)) continue
    const src = join(sourceDir, name)
    if (!statSync(src).isDirectory()) {
      if (name.endsWith('.md')) {
        const destName = name === 'README.md' ? 'index.md' : name
        const dest = join(targetDir, destName)
        if (!dryRun) {
          writeFileSync(dest, transformMarkdown(readFileSync(src, 'utf8'), destName))
        }
        copied++
      }
      continue
    }
    copyTree(src, join(targetDir, name))
  }

  function copyTree(srcDir, destDir) {
    if (!dryRun) mkdirSync(destDir, { recursive: true })
    for (const entry of readdirSync(srcDir)) {
      const s = join(srcDir, entry)
      if (statSync(s).isDirectory()) {
        if (SKIP_DIRS.has(entry) || entry === 'assets') continue
        copyTree(s, join(destDir, entry))
      } else if (entry.endsWith('.md')) {
        const destName = entry === 'README.md' ? 'index.md' : entry
        const dest = join(destDir, destName)
        if (!dryRun) {
          writeFileSync(dest, transformMarkdown(readFileSync(s, 'utf8'), join(destDir, destName)))
        }
        copied++
      } else {
        if (!dryRun) cpSync(s, join(destDir, entry))
      }
    }
  }

  return copied
}

function generateMetaFiles(sidebarMap, dailyNewsPaths) {
  const folders = listFolders(targetDir)
  let metaCount = 0

  for (const folder of folders) {
    if (folder.split('/').includes('assets')) continue
    const folderPath = folder ? join(targetDir, folder) : targetDir
    const groups = sidebarMap[folder]
    let pages

    let title
    if (folder === '') {
      pages = rootSectionPages(folderPath)
      title = '文档'
    } else if (folder === 'daily-news' && dailyNewsPaths.length) {
      pages = dailyNewsPaths.map((p) => {
        const slug = vuePathToSlug(p)
        return slug.replace('daily-news/', '')
      })
    } else if (groups) {
      pages = flattenSidebarGroups(groups, folder)
    } else {
      pages = autoPages(folderPath, folder)
    }

    pages = normalizePagesList(pages, folderPath, folder)

    const metaTitle = title || groups?.[0]?.text || folderTitle(folder)
    const meta = { title: metaTitle, pages }
    const metaPath = join(folderPath, 'meta.json')
    if (!dryRun) writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
    metaCount++
  }

  return metaCount
}

function listFolders(dir, prefix = '') {
  const out = prefix ? [prefix] : ['']
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (!statSync(full).isDirectory()) continue
    if (name === 'node_modules') continue
    const p = prefix ? `${prefix}/${name}` : name
    out.push(p)
    out.push(...listFolders(full, p).filter((x) => x !== p))
  }
  return [...new Set(out)]
}

function rootSectionPages(folderPath) {
  const entries = readdirSync(folderPath)
  const dirs = entries.filter((e) => statSync(join(folderPath, e)).isDirectory())
  const ordered = ROOT_SECTION_ORDER.filter((d) => dirs.includes(d))
  const rest = dirs.filter((d) => !ordered.includes(d)).sort()
  const pages = ['index', ...ordered, ...rest]
  return pages
}

function autoPages(folderPath, folder) {
  const pages = []
  const entries = readdirSync(folderPath)
  if (entries.includes('index.md')) pages.push('index')
  for (const e of entries) {
    if (e === 'index.md' || e === 'meta.json') continue
    if (e.endsWith('.md')) pages.push(e.replace(/\.md$/, ''))
    if (statSync(join(folderPath, e)).isDirectory()) {
      pages.push(e)
    }
  }
  return pages
}

function normalizePagesList(pages, folderPath, folder) {
  const valid = new Set()
  const entries = readdirSync(folderPath)
  if (entries.includes('index.md')) valid.add('index')
  for (const e of entries) {
    if (e.endsWith('.md') && e !== 'index.md') valid.add(e.replace(/\.md$/, ''))
    if (statSync(join(folderPath, e)).isDirectory()) valid.add(e)
  }

  const out = []
  for (const p of pages) {
    if (p.startsWith('---') && p.endsWith('---')) {
      out.push(p)
      continue
    }
    if (valid.has(p)) out.push(p)
    else if (p.includes('/')) {
      const top = p.split('/')[0]
      if (valid.has(top)) out.push(p)
    }
  }

  // append missing files not in sidebar
  for (const v of valid) {
    if (!out.includes(v)) out.push(v)
  }

  return out
}

function folderTitle(folder) {
  const titles = {
    JavaScript: 'JavaScript',
    TypeScript: 'TypeScript',
    css: 'CSS',
    react: 'React',
    vue: 'Vue',
    Pattern: '设计模式',
    webpack: 'Webpack',
    node: 'Node.js',
    git: 'Git',
    performance: '性能优化',
    mark: '技能提炼',
    ai: 'AI 开发',
    issue: '踩坑记录',
    utils: '工具函数',
    'online-tools': '在线工具',
    software: '软件推荐',
    'interview-prep': '面试准备',
    theory: '面试题库',
    interview: '面试记录',
    'job-description': '简历问答',
    'daily-news': '每日资讯',
    travel: '旅行'
  }
  return titles[folder] || folder
}

function copyPublicAssets() {
  if (!dryRun) mkdirSync(PORTAL_PUBLIC, { recursive: true })
  if (existsSync(VUEPRESS_PUBLIC_PATH) && !dryRun) {
    cpSync(VUEPRESS_PUBLIC_PATH, PORTAL_PUBLIC, { recursive: true, force: true })
  }
  if (existsSync(VUEPRESS_ALIAS_PATH)) {
    const imgDest = join(PORTAL_PUBLIC, 'images')
    if (!dryRun) {
      mkdirSync(imgDest, { recursive: true })
      cpSync(join(VUEPRESS_ALIAS_PATH, 'images'), imgDest, { recursive: true, force: true })
    }
  }
  const travelAssets = join(sourceDir, 'travel', 'assets')
  if (existsSync(travelAssets) && !dryRun) {
    mkdirSync(join(PORTAL_PUBLIC, 'travel'), { recursive: true })
    cpSync(travelAssets, join(PORTAL_PUBLIC, 'travel', 'assets'), { recursive: true, force: true })
  }
}

function main() {
  log('=== migrate-from-vuepress ===')
  log(`source: ${sourceDir}`)
  log(`target: ${targetDir}`)
  if (dryRun) log('(dry-run)')

  if (!existsSync(sourceDir)) {
    console.error('Source docs not found:', sourceDir)
    process.exit(1)
  }

  let navConfig = { sidebar: {} }
  if (existsSync(NAV_CONFIG_PATH)) {
    navConfig = JSON.parse(readFileSync(NAV_CONFIG_PATH, 'utf8'))
  } else {
    log('warn: nav-config.json not found, using auto meta only')
  }

  let dailyNewsPaths = []
  if (existsSync(CONFIG_TS_PATH)) {
    dailyNewsPaths = extractDailyNewsFromConfig(readFileSync(CONFIG_TS_PATH, 'utf8'))
  }

  const sidebarMap = parseSidebarFromNav(navConfig)
  if (dailyNewsPaths.length) sidebarMap['daily-news'] = [{ text: '每日资讯', children: dailyNewsPaths }]

  const copied = copyDocs()
  const metaCount = dryRun ? 0 : generateMetaFiles(sidebarMap, dailyNewsPaths)
  copyPublicAssets()

  if (!dryRun) {
    // Remove duplicate root index if we have home at app level — keep docs index as portal intro
    const docsIndex = join(targetDir, 'index.md')
    if (existsSync(docsIndex)) {
      writeFileSync(
        docsIndex,
        `---\ntitle: 文档\n---\n\n# acongm 文档\n\n前端常用知识、踩坑记录、软件推荐等。\n\n请从左侧导航或下方分类进入阅读。\n`
      )
    }
  }

  log(`copied markdown files: ${copied}`)
  log(`meta.json folders: ${metaCount}`)
  log('done')
}

main()
