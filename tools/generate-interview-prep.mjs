#!/usr/bin/env node
/**
 * interview-prep generator (NO external deps)
 *
 * Commands:
 *  - generate   : upsert knowledge units from resume + outline (best-effort)
 *  - index      : regenerate interview-prep/INDEX.md
 *  - reorder    : reorder IDs inside INDEX ORDER block
 *  - blindspots : generate interview-prep/BLINDSPOTS.md from unchecked questions
 *  - validate   : enforce flat rule + required frontmatter fields
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const TODAY = new Date().toISOString().slice(0, 10)

const DEFAULT_RESUME = 'docs/job-description/web前端开发工程师-彭聪.md'
const DEFAULT_OUTLINE = 'docs/job-description/web前端开发工程师-彭聪-面试技术大纲.md'
const DEFAULT_OUT_DIR = 'interview-prep'

const AUTO_START = '<!-- AUTO-GENERATED:START -->'
const AUTO_END = '<!-- AUTO-GENERATED:END -->'
const ORDER_START = '<!-- ORDER:START -->'
const ORDER_END = '<!-- ORDER:END -->'

function die(msg, code = 1) {
  console.error(`[interview-prep] ${msg}`)
  process.exit(code)
}

function usage() {
  return `interview-prep generator (NO external deps)

Usage:
  node tools/generate-interview-prep.mjs <command> [options]

Commands:
  generate   --resume <path> --outline <path> --out <dir>
  index      --out <dir>
  reorder    <id> (--before <id> | --after <id>) --out <dir>
  blindspots --out <dir>
  validate   --out <dir>

Examples:
  node tools/generate-interview-prep.mjs generate
  node tools/generate-interview-prep.mjs validate
  node tools/generate-interview-prep.mjs reorder tech__webpack --before tech__react
`
}

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args[0]
  const rest = args.slice(1)

  const opts = {}
  const positional = []
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]
    if (a === '--help' || a === '-h') opts.help = true
    else if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = rest[i + 1]
      if (!next || next.startsWith('--')) opts[key] = true
      else {
        opts[key] = next
        i++
      }
    } else positional.push(a)
  }

  return { command, opts, positional }
}

function isTemplateFile(filename) {
  return filename.endsWith('_TEMPLATE.md')
}

function isNonUnitFile(filename) {
  return (
    filename === 'INDEX.md' ||
    filename === 'README.md' ||
    filename === 'BLINDSPOTS.md' ||
    isTemplateFile(filename)
  )
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function splitFrontmatter(content) {
  if (!content.startsWith('---\n')) return null
  const endIdx = content.indexOf('\n---\n', 4)
  if (endIdx === -1) return null
  const fm = content.slice(4, endIdx + 1) // include trailing newline
  const body = content.slice(endIdx + 5)
  return { frontmatter: fm, body }
}

function parseFrontmatterKV(frontmatter) {
  const lines = frontmatter.split('\n')
  const kv = {}
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)\s*$/)
    if (!m) continue
    const [, key, raw] = m
    kv[key] = raw
  }
  return kv
}

function upsertFrontmatter(frontmatter, yamlSnippetByKey) {
  let fm = frontmatter
  for (const [key, snippet] of Object.entries(yamlSnippetByKey)) {
    const keyRe = new RegExp(`^${key}:\\s*`, 'm')
    if (keyRe.test(fm)) continue
    // Append with a preceding newline for readability if needed
    fm = fm.replace(/\n?$/, '\n') + snippet.replace(/\n?$/, '\n')
  }
  // Ensure updated_at exists (append if missing)
  if (!/^updated_at:\s*/m.test(fm)) {
    fm = fm.replace(/\n?$/, '\n') + `updated_at: ${TODAY}\n`
  }
  return fm
}

function setInlineArrayIfMissingOrEmpty(frontmatter, key, values) {
  const desired = `${key}: [${(values ?? []).join(', ')}]`
  const re = new RegExp(`^${escapeRe(key)}:\\s*\\[(.*?)\\]\\s*$`, 'm')
  if (re.test(frontmatter)) {
    const m = frontmatter.match(re)
    const inside = (m?.[1] ?? '').trim()
    if (inside.length > 0) return frontmatter // keep existing non-empty value
    return frontmatter.replace(re, desired)
  }

  const keyRe = new RegExp(`^${escapeRe(key)}:\\s*`, 'm')
  if (keyRe.test(frontmatter)) return frontmatter // non-inline or already defined; don't touch

  return frontmatter.replace(/\n?$/, '\n') + desired + '\n'
}

function ensureAutoBlock(body, autoContentMarkdown) {
  if (body.includes(AUTO_START) && body.includes(AUTO_END)) {
    return body.replace(
      new RegExp(`${escapeRe(AUTO_START)}[\\s\\S]*?${escapeRe(AUTO_END)}`),
      `${AUTO_START}\n${autoContentMarkdown.trim()}\n\n${AUTO_END}`
    )
  }

  // Insert near top
  return `${AUTO_START}\n${autoContentMarkdown.trim()}\n\n${AUTO_END}\n\n${body.trimStart()}`
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function ensureSectionHeadings(body) {
  const required = ['## 原理简述', '## 对比表格', '## 模拟问答', '## 手写代码区']
  let out = body
  for (const h of required) {
    if (!out.includes(h)) out = `${out.trimEnd()}\n\n${h}\n\n（待补全）\n`
  }
  if (!out.includes('## 面试官追问（面试官视角）')) {
    out = `${out.trimEnd()}\n\n## 面试官追问（面试官视角）\n\n- [ ] 为什么选这个方案？替代方案为什么不选？\n- [!] 最大一次事故/踩坑是什么？如何定位与回滚？\n- [ ] 如果重做会怎么改？\n`
  }
  if (!out.includes('## 我的补充（Manual）')) {
    out = `${out.trimEnd()}\n\n## 我的补充（Manual）\n\n（不会被脚本覆盖）\n`
  }
  if (!out.includes('## 复盘与反思（Learnings）')) {
    out = `${out.trimEnd()}\n\n## 复盘与反思（Learnings）\n\n- 如果重做会怎么改？\n`
  }
  return out
}

function normalizeIdToFilename(id) {
  return `${id}.md`
}

function inferTypeFromId(id) {
  if (id.startsWith('tech__')) return 'tech'
  if (id.startsWith('project__')) return 'project'
  if (id.startsWith('matrix__')) return 'matrix'
  if (id.startsWith('qna__')) return 'qna'
  return null
}

function frontmatterForUnit({ id, type, title, sourceRefs, seedRefs, tags, projects, mastery }) {
  const yaml = [
    '---',
    `id: ${id}`,
    `type: ${type}`,
    `title: ${title}`,
    `mastery: ${mastery ?? 'not_started'}`,
    `tags: [${(tags ?? []).join(', ')}]`,
    `projects: [${(projects ?? []).join(', ')}]`,
    'source_refs:',
    ...((sourceRefs ?? []).length
      ? sourceRefs.flatMap((r) => [
          `  - source: ${r.source}`,
          `    file: ${r.file}`,
          `    anchor: ${r.anchor}`
        ])
      : ['  - source: resume', `    file: ${DEFAULT_RESUME}`, '    anchor: TODO']),
    'seed_refs:',
    ...((seedRefs ?? []).length
      ? seedRefs.flatMap((r) => [
          `  - source: ${r.source}`,
          `    file: ${r.file}`,
          `    anchor: ${r.anchor}`
        ])
      : ['  - source: outline', `    file: ${DEFAULT_OUTLINE}`, '    anchor: TODO']),
    `updated_at: ${TODAY}`,
    '---',
    ''
  ].join('\n')
  return yaml
}

async function readTextOrDie(p) {
  try {
    return await fs.readFile(p, 'utf-8')
  } catch (e) {
    die(`无法读取文件：${p}\n${String(e)}`)
  }
}

function extractResumeProjects(resumeMd) {
  // best-effort: "### 项目名（YYYY.MM-YYYY.MM）" blocks
  const projects = []
  const re = /^###\s+(.+?)(?:（([0-9.]+-[0-9.]+)）)?\s*$/gm
  let m
  while ((m = re.exec(resumeMd))) {
    const title = m[1].trim()
    const time = m[2]?.trim()
    projects.push({ title, time })
  }
  return projects
}

function extractOutlineAnchors(outlineMd) {
  const anchors = []
  const lines = outlineMd.split('\n')
  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.+)\s*$/)
    if (!m) continue
    const text = m[2].trim()
    if (text) anchors.push(text)
  }
  return anchors
}

async function listUnits(outDir) {
  const entries = await fs.readdir(outDir, { withFileTypes: true })
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
    .filter((name) => !isNonUnitFile(name))
  const units = []
  for (const filename of files) {
    const full = path.join(outDir, filename)
    const content = await fs.readFile(full, 'utf-8')
    const split = splitFrontmatter(content)
    if (!split) continue
    const kv = parseFrontmatterKV(split.frontmatter)
    units.push({
      filename,
      id: kv.id?.trim(),
      type: kv.type?.trim(),
      title: kv.title?.trim()
    })
  }
  return units.filter((u) => u.id && u.type && u.title)
}

async function cmdValidate({ outDir }) {
  // flat rule: no subdirectories
  const entries = await fs.readdir(outDir, { withFileTypes: true })
  const subDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)
  if (subDirs.length) {
    die(`违反扁平规则：${outDir}/ 下存在子目录：${subDirs.join(', ')}`)
  }

  const mdFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
    .filter((name) => !isNonUnitFile(name))

  const errors = []
  for (const filename of mdFiles) {
    const full = path.join(outDir, filename)
    const content = await fs.readFile(full, 'utf-8')
    const split = splitFrontmatter(content)
    if (!split) {
      errors.push(`${filename}: missing YAML frontmatter`)
      continue
    }
    const kv = parseFrontmatterKV(split.frontmatter)
    for (const key of ['id', 'type', 'title', 'mastery']) {
      if (!kv[key] || !kv[key].trim()) errors.push(`${filename}: missing ${key}`)
    }
    const type = kv.type?.trim()
    const id = kv.id?.trim()
    const inferred = inferTypeFromId(id ?? '')
    if (type && inferred && type !== inferred) {
      errors.push(`${filename}: type=${type} does not match id prefix (${inferred})`)
    }
    if (id && filename !== normalizeIdToFilename(id)) {
      errors.push(`${filename}: filename must be ${normalizeIdToFilename(id)}`)
    }
    if (kv.mastery && !['not_started', 'in_progress', 'mastered'].includes(kv.mastery.trim())) {
      errors.push(`${filename}: invalid mastery=${kv.mastery}`)
    }
  }

  if (errors.length) {
    die(`校验失败：\n- ${errors.join('\n- ')}`)
  }

  console.log('[interview-prep] validate: OK')
}

async function upsertUnitFile({
  outDir,
  templatePath,
  unit,
  autoMarkdown
}) {
  const filename = normalizeIdToFilename(unit.id)
  const full = path.join(outDir, filename)

  let content
  if (await fileExists(full)) {
    content = await fs.readFile(full, 'utf-8')
  } else {
    const tmpl = await fs.readFile(templatePath, 'utf-8')
    // very small templating: replace first frontmatter block keys if present
    const split = splitFrontmatter(tmpl) ?? { frontmatter: '', body: tmpl }
    const fm = frontmatterForUnit(unit)
    content = fm + split.body.replace(/^\s+/, '')
  }

  const split = splitFrontmatter(content)
  if (!split) {
    // fallback: prepend new frontmatter
    content = frontmatterForUnit(unit) + content
  }

  const s2 = splitFrontmatter(content)
  if (!s2) die(`无法处理 frontmatter：${full}`)
  let updatedFrontmatter = upsertFrontmatter(s2.frontmatter, {
    source_refs: buildYamlBlock('source_refs', unit.source_refs),
    seed_refs: buildYamlBlock('seed_refs', unit.seed_refs)
  })
  updatedFrontmatter = setInlineArrayIfMissingOrEmpty(updatedFrontmatter, 'tags', unit.tags)
  updatedFrontmatter = setInlineArrayIfMissingOrEmpty(updatedFrontmatter, 'projects', unit.projects)

  let body = s2.body
  body = ensureAutoBlock(body, autoMarkdown)
  body = ensureSectionHeadings(body)

  const out = `---\n${updatedFrontmatter.trimEnd()}\n---\n\n${body.trimStart()}`
  await fs.writeFile(full, out, 'utf-8')
}

function buildYamlBlock(key, refs) {
  if (!refs || !refs.length) return `${key}: []\n`
  const lines = [`${key}:`]
  for (const r of refs) {
    lines.push(`  - source: ${r.source}`)
    lines.push(`    file: ${r.file}`)
    lines.push(`    anchor: ${r.anchor}`)
  }
  return lines.join('\n') + '\n'
}

async function cmdGenerate({ resumePath, outlinePath, outDir }) {
  const resumeMd = await readTextOrDie(resumePath)
  const outlineMd = await readTextOrDie(outlinePath)

  const resumeProjects = extractResumeProjects(resumeMd)
  const outlineAnchors = extractOutlineAnchors(outlineMd)

  const out = path.resolve(outDir)
  await fs.mkdir(out, { recursive: true })

  const templateByType = {
    tech: path.join(out, 'TECH_TEMPLATE.md'),
    project: path.join(out, 'PROJECT_TEMPLATE.md'),
    matrix: path.join(out, 'MATRIX_TEMPLATE.md'),
    qna: path.join(out, 'QNA_TEMPLATE.md')
  }

  for (const [t, p] of Object.entries(templateByType)) {
    if (!(await fileExists(p))) die(`缺少模板文件：${p}（type=${t}）`)
  }

  // catalog: stable IDs (hand-curated) - can be extended
  const catalog = [
    {
      id: 'project__dji-user-center',
      type: 'project',
      title: '大疆用户中心重构',
      tags: ['performance', 'vue3', 'vite'],
      projects: ['project__dji-user-center'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆用户中心重构' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '1）大疆用户中心重构：性能优化 + HTTP 原理 + Webpack 架构' }]
    },
    {
      id: 'project__dji-rms',
      type: 'project',
      title: '大疆售后 RMS 系统重构',
      tags: ['react', 'typescript', 'webpack', 'antd', 'engineering'],
      projects: ['project__dji-rms'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆售后 RMS 系统重构' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '2）Umi：ESLint 规范有哪些，以及如何整合到实践' }]
    },
    {
      id: 'project__announce-plugin',
      type: 'project',
      title: '跨平台公告插件系统',
      tags: ['rollup', 'preact', 'plugin', 'sandbox'],
      projects: ['project__announce-plugin'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '跨平台公告插件系统' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型' }]
    },
    {
      id: 'project__dji-devops',
      type: 'project',
      title: '大疆 DevOps 平台维护',
      tags: ['vue3', 'typescript', 'qiankun', 'cicd'],
      projects: ['project__dji-devops'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆 DevOps 平台维护' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '6）大疆 DevOps 平台维护：微前端选型 + 各微前端原理' }]
    },
    {
      id: 'project__xdr-dashboard-report',
      type: 'project',
      title: 'XDR 系统（魔方大屏 + 报表）',
      tags: ['react', 'echarts', 'nestjs', 'lowcode'],
      projects: ['project__xdr-dashboard-report'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: 'XDR 系统 - 魔方大屏 + 报表' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '7）魔方大屏：低代码内部原理' }]
    },
    // tech
    {
      id: 'tech__react',
      type: 'tech',
      title: 'React（机制/性能/工程实践）',
      tags: ['react', 'hooks', 'concurrent', 'performance'],
      projects: ['project__dji-rms', 'project__xdr-dashboard-report'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆售后 RMS 系统重构' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型' }]
    },
    {
      id: 'tech__typescript',
      type: 'tech',
      title: 'TypeScript（类型安全与工程治理）',
      tags: ['typescript', 'types', 'lint'],
      projects: ['project__dji-rms', 'project__dji-user-center', 'project__dji-devops', 'project__xdr-dashboard-report'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '技能清单' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '2）Umi：ESLint 规范有哪些，以及如何整合到实践' }]
    },
    {
      id: 'tech__webpack',
      type: 'tech',
      title: 'Webpack（构建流程/产物/性能优化）',
      tags: ['webpack', 'bundler', 'performance'],
      projects: ['project__dji-rms'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆售后 RMS 系统重构' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '1）大疆用户中心重构：性能优化 + HTTP 原理 + Webpack 架构' }]
    },
    {
      id: 'tech__vite',
      type: 'tech',
      title: 'Vite（ESM Dev Server 与构建取舍）',
      tags: ['vite', 'bundler', 'esm'],
      projects: ['project__dji-user-center'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆用户中心重构' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型' }]
    },
    {
      id: 'tech__rollup',
      type: 'tech',
      title: 'Rollup（库构建与 tree-shaking）',
      tags: ['rollup', 'bundler', 'tree-shaking'],
      projects: ['project__announce-plugin'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '跨平台公告插件系统' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型' }]
    },
    {
      id: 'tech__micro-frontend-qiankun',
      type: 'tech',
      title: '微前端（qiankun 原理/隔离/通信）',
      tags: ['micro-frontend', 'qiankun', 'sandbox'],
      projects: ['project__dji-devops'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '大疆 DevOps 平台维护' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '6）大疆 DevOps 平台维护：微前端选型 + 各微前端原理' }]
    },
    // matrix
    {
      id: 'matrix__bundler-webpack-vite-rollup',
      type: 'matrix',
      title: '构建工具选型：Webpack vs Vite vs Rollup',
      tags: ['bundler', 'webpack', 'vite', 'rollup'],
      projects: ['project__dji-user-center', 'project__dji-rms', 'project__announce-plugin'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '技能清单' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '3）跨平台公告插件系统：Rollup / Webpack / Vite 横向对比 + Preact 选型' }]
    },
    {
      id: 'matrix__monorepo-lerna-nx',
      type: 'matrix',
      title: 'Monorepo 选型：Lerna vs Nx',
      tags: ['monorepo', 'lerna', 'nx'],
      projects: ['project__dji-rms'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '工程化建设' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '2）Umi：ESLint 规范有哪些，以及如何整合到实践' }]
    },
    {
      id: 'matrix__form-formily-rjsf-custom',
      type: 'matrix',
      title: '表单方案选型：Formily vs RJSF vs 自研无依赖表单',
      tags: ['form', 'schema', 'lowcode'],
      projects: ['project__dji-rms', 'project__xdr-dashboard-report'],
      source_refs: [{ source: 'resume', file: DEFAULT_RESUME, anchor: '工程化专家' }],
      seed_refs: [{ source: 'outline', file: DEFAULT_OUTLINE, anchor: '7）魔方大屏：低代码内部原理' }]
    }
  ]

  // For Auto sections: give extracted hints (best effort)
  const resumeProjectTitles = resumeProjects.map((p) => p.title)
  const outlineHint = outlineAnchors.slice(0, 10)

  for (const unit of catalog) {
    const auto = [
      '## 摘要（Auto）',
      '',
      `- 生成时间：${TODAY}`,
      `- 简历中出现的项目标题（提取）：${resumeProjectTitles.slice(0, 10).join(' / ') || 'N/A'}`,
      `- 面试大纲关键词（提取 Top10）：${outlineHint.join(' / ') || 'N/A'}`,
      '',
      '## 建议追问（Auto）',
      '',
      '- 你为什么在该项目/场景里选择这个方案？替代方案为何不选？',
      '- 最大一次事故/踩坑是什么？如何定位与回滚？',
      '- 如果重做：架构/边界/工程化会怎么调整？'
    ].join('\n')

    await upsertUnitFile({
      outDir: out,
      templatePath: templateByType[unit.type],
      unit,
      autoMarkdown: auto
    })
  }

  // Ensure INDEX exists (do not overwrite ORDER block here)
  const indexPath = path.join(out, 'INDEX.md')
  if (!(await fileExists(indexPath))) {
    await fs.writeFile(
      indexPath,
      '# 面试准备总纲（INDEX）\n\n<!-- ORDER:START -->\n<!-- ORDER:END -->\n',
      'utf-8'
    )
  }

  console.log(`[interview-prep] generate: OK (${catalog.length} units)`)
}

function parseOrderBlock(indexContent) {
  if (!indexContent.includes(ORDER_START) || !indexContent.includes(ORDER_END)) return []
  const m = indexContent.match(
    new RegExp(`${escapeRe(ORDER_START)}([\\s\\S]*?)${escapeRe(ORDER_END)}`)
  )
  if (!m) return []
  const lines = m[1]
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => l.startsWith('- '))
    .map((l) => l.replace(/^- /, '').trim())
  return lines
}

function replaceOrderBlock(indexContent, orderedIds) {
  const block = `${ORDER_START}\n${orderedIds.map((id) => `- ${id}`).join('\n')}\n${ORDER_END}`
  if (indexContent.includes(ORDER_START) && indexContent.includes(ORDER_END)) {
    return indexContent.replace(
      new RegExp(`${escapeRe(ORDER_START)}[\\s\\S]*?${escapeRe(ORDER_END)}`),
      block
    )
  }
  return `${block}\n\n${indexContent}`
}

async function cmdIndex({ outDir }) {
  const out = path.resolve(outDir)
  const indexPath = path.join(out, 'INDEX.md')
  const prev = (await fileExists(indexPath)) ? await fs.readFile(indexPath, 'utf-8') : ''
  const existingOrder = parseOrderBlock(prev)

  const units = await listUnits(out)
  const idToUnit = new Map(units.map((u) => [u.id, u]))

  const ordered = []
  for (const id of existingOrder) if (idToUnit.has(id)) ordered.push(id)
  for (const u of units.sort((a, b) => a.id.localeCompare(b.id))) {
    if (!ordered.includes(u.id)) ordered.push(u.id)
  }

  const byType = {
    project: ordered.filter((id) => idToUnit.get(id)?.type === 'project'),
    tech: ordered.filter((id) => idToUnit.get(id)?.type === 'tech'),
    matrix: ordered.filter((id) => idToUnit.get(id)?.type === 'matrix'),
    qna: ordered.filter((id) => idToUnit.get(id)?.type === 'qna')
  }

  const lines = []
  lines.push('# 面试准备总纲（INDEX）')
  lines.push('')
  lines.push('> 说明：本文件是“主界面”（Markdown 版），用于快速浏览、排序与标记掌握度。')
  lines.push('')
  lines.push('## 优先级队列（Priority Queue）')
  lines.push('')
  lines.push(`${ORDER_START}`)
  for (const id of ordered) lines.push(`- ${id}`)
  lines.push(`${ORDER_END}`)
  lines.push('')
  lines.push('## Timeline（按项目时间线）')
  lines.push('')
  for (const id of byType.project) {
    const u = idToUnit.get(id)
    lines.push(`- [ ] ${id}：${u.title} → [打开卡片](./${normalizeIdToFilename(id)}#原理简述)`)
  }
  lines.push('')
  lines.push('## Tech Index')
  lines.push('')
  for (const id of byType.tech) {
    const u = idToUnit.get(id)
    lines.push(`- [ ] ${id}：${u.title} → [原理](./${normalizeIdToFilename(id)}#原理简述) / [对比](./${normalizeIdToFilename(id)}#对比表格) / [问答](./${normalizeIdToFilename(id)}#模拟问答) / [手写](./${normalizeIdToFilename(id)}#手写代码区)`)
  }
  lines.push('')
  lines.push('## Matrix Index')
  lines.push('')
  for (const id of byType.matrix) {
    const u = idToUnit.get(id)
    lines.push(`- [ ] ${id}：${u.title} → [对比表格](./${normalizeIdToFilename(id)}#对比表格)`)
  }
  if (byType.qna.length) {
    lines.push('')
    lines.push('## QnA（可选）')
    lines.push('')
    for (const id of byType.qna) {
      const u = idToUnit.get(id)
      lines.push(`- [ ] ${id}：${u.title} → [打开](./${normalizeIdToFilename(id)})`)
    }
  }
  lines.push('')
  lines.push('## Blindspots（盲区清单）')
  lines.push('')
  lines.push('- `./BLINDSPOTS.md`')
  lines.push('')

  let next = lines.join('\n')
  // Preserve order block content decisions (already embedded), but if older file had custom order outside units, keep it
  if (existingOrder.length) next = replaceOrderBlock(next, ordered)

  await fs.writeFile(indexPath, next, 'utf-8')
  console.log(`[interview-prep] index: OK (${units.length} units)`)
}

async function cmdReorder({ outDir, moveId, beforeId, afterId }) {
  const out = path.resolve(outDir)
  const indexPath = path.join(out, 'INDEX.md')
  if (!(await fileExists(indexPath))) die(`缺少 INDEX：${indexPath}`)

  const prev = await fs.readFile(indexPath, 'utf-8')
  let order = parseOrderBlock(prev)
  if (!order.length) {
    // fallback: build from existing units
    const units = await listUnits(out)
    order = units.map((u) => u.id)
  }

  if (!order.includes(moveId)) order.push(moveId)
  order = order.filter((id) => id !== moveId)

  const anchorId = beforeId ?? afterId
  if (!anchorId) die('reorder 需要 --before 或 --after')
  if (!order.includes(anchorId)) die(`anchor id 不存在于 ORDER：${anchorId}`)

  const idx = order.indexOf(anchorId)
  const insertAt = beforeId ? idx : idx + 1
  order.splice(insertAt, 0, moveId)

  const next = replaceOrderBlock(prev, order)
  await fs.writeFile(indexPath, next, 'utf-8')

  // Regenerate index sections to reflect ordering & current units
  await cmdIndex({ outDir })
  console.log(`[interview-prep] reorder: OK (${moveId})`)
}

function extractUncheckedQuestions(md) {
  const lines = md.split('\n')
  const items = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (/^- \[ \]\s+/.test(line)) items.push({ kind: 'todo', text: line.replace(/^- \[ \]\s+/, '').trim() })
    if (/^- \[!\]\s+/.test(line)) items.push({ kind: 'high', text: line.replace(/^- \[!\]\s+/, '').trim() })
  }
  return items
}

async function cmdBlindspots({ outDir }) {
  const out = path.resolve(outDir)
  const units = await listUnits(out)
  const rows = []
  for (const u of units) {
    const full = path.join(out, u.filename)
    const content = await fs.readFile(full, 'utf-8')
    const split = splitFrontmatter(content)
    if (!split) continue
    const qs = extractUncheckedQuestions(split.body)
    if (!qs.length) continue
    rows.push({ id: u.id, title: u.title, filename: u.filename, qs })
  }

  const lines = []
  lines.push('# 盲区清单（BLINDSPOTS）')
  lines.push('')
  lines.push(`生成时间：${TODAY}`)
  lines.push('')
  lines.push('> 规则：收集所有知识单元中未完成的追问（`- [ ]`）与高风险项（`- [!]`）。')
  lines.push('')
  if (!rows.length) {
    lines.push('暂无盲区（或尚未添加追问）。')
  } else {
    for (const r of rows) {
      lines.push(`## ${r.id}：${r.title}`)
      lines.push('')
      lines.push(`来源：\`./${r.filename}\``)
      lines.push('')
      for (const q of r.qs) {
        const prefix = q.kind === 'high' ? '[!]' : '[ ]'
        lines.push(`- ${prefix} ${q.text}`)
      }
      lines.push('')
    }
  }

  await fs.writeFile(path.join(out, 'BLINDSPOTS.md'), lines.join('\n'), 'utf-8')
  console.log(`[interview-prep] blindspots: OK (${rows.length} units)`)
}

async function main() {
  const { command, opts, positional } = parseArgs(process.argv)
  if (!command || opts.help) {
    console.log(usage())
    return
  }

  const outDir = opts.out ? String(opts.out) : DEFAULT_OUT_DIR

  if (command === 'generate') {
    const resumePath = opts.resume ? String(opts.resume) : DEFAULT_RESUME
    const outlinePath = opts.outline ? String(opts.outline) : DEFAULT_OUTLINE
    await cmdGenerate({ resumePath, outlinePath, outDir })
    return
  }
  if (command === 'index') {
    await cmdIndex({ outDir })
    return
  }
  if (command === 'reorder') {
    const moveId = positional[0]
    if (!moveId) die('reorder 需要 <id>')
    const beforeId = opts.before ? String(opts.before) : null
    const afterId = opts.after ? String(opts.after) : null
    await cmdReorder({ outDir, moveId, beforeId, afterId })
    return
  }
  if (command === 'blindspots') {
    await cmdBlindspots({ outDir })
    return
  }
  if (command === 'validate') {
    await cmdValidate({ outDir })
    return
  }

  die(`未知命令：${command}\n\n${usage()}`)
}

main().catch((e) => die(String(e)))


