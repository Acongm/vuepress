#!/usr/bin/env node
/**
 * 从 Acongm/vuepress #15+ 迁移 Platform v2 Issue 到各目标私有仓。
 * 需使用**你的个人** gh 登录（非 Cloud Agent cursor 账号）：
 *   gh auth login
 *   gh auth status   # 应显示你的账号 acongm，非 cursor
 *
 * 用法:
 *   node platform-v2-issues/migrate-issues-from-vuepress.mjs --dry-run
 *   node platform-v2-issues/migrate-issues-from-vuepress.mjs
 *   node platform-v2-issues/migrate-issues-from-vuepress.mjs --target auth
 *   node platform-v2-issues/migrate-issues-from-vuepress.mjs --skip-api   # api 已在 node-vercel-starter
 */

import { execSync } from 'node:child_process'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const SOURCE = 'Acongm/vuepress'
const STATE = join(ROOT, 'migrated-issues.json')
const EXPORT = join(ROOT, 'export')

/** GitHub 上 Acongm/platform 与 Acongm/portal 为同一仓库 */
function normalizeRepo(repo) {
  return repo === 'Acongm/platform' ? 'Acongm/portal' : repo
}

/** vuepress 标题前缀 [platform] 与 [portal] 均迁入 Acongm/portal（portal 即原 platform 仓） */
const TARGET_REPO = {
  platform: 'Acongm/portal',
  auth: 'Acongm/auth',
  portal: 'Acongm/portal',
  chat: 'Acongm/chat',
  dochub: 'Acongm/dochub',
  api: 'Acongm/node-vercel-starter'
}

/** vuepress# → node-vercel-starter#（api 已存在，仅关联不重复创建） */
const API_MIRROR = {
  56: 1,
  57: 2,
  58: 3,
  59: 4,
  60: 5,
  61: 6,
  62: 7,
  63: 8,
  64: 9,
  65: 10,
  66: 11,
  67: 12,
  68: 13,
  69: 14,
  70: 15,
  71: 16,
  72: 17,
  73: 18,
  74: 19,
  75: 20,
  76: 21
}

function gh(cmd) {
  return execSync(`gh ${cmd}`, { encoding: 'utf8' }).trim()
}

function parseTarget(title) {
  const m = title.match(/^\[(\w+)\]\s*(.+)$/)
  if (!m) return null
  return { target: m[1], title: m[2] }
}

function fetchSourceIssues(fromNumber = 15) {
  const json = gh(
    `issue list -R ${SOURCE} --state all --limit 200 --json number,title,body,url`
  )
  const issues = JSON.parse(json)
    .filter((i) => i.number >= fromNumber && i.title.match(/^\[(\w+)\]/))
    .sort((a, b) => a.number - b.number)
  return issues.map((i) => ({
    number: i.number,
    title: i.title,
    body: i.body,
    html_url: i.url
  }))
}

function checkRepo(repo) {
  try {
    gh(`repo view ${repo} --json name -q .name`)
    return true
  } catch {
    return false
  }
}

function migrateBody(issue, newTitle, sourceUrl, mirrorUrl) {
  let body = issue.body || ''
  body = body.replace(
    /## 暂存说明[\s\S]*$/,
    ''
  ).trim()
  body += `\n\n---\n## 迁移记录\n- 来源：${sourceUrl}\n`
  if (mirrorUrl) {
    body += `- 关联（api 镜像，未重复创建）：${mirrorUrl}\n`
  }
  body += `- 分支：\`platform/v2\`\n`
  return body
}

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const skipApi = args.includes('--skip-api')
const targetFilter = args.find((a) => a.startsWith('--target='))?.split('=')[1]

mkdirSync(EXPORT, { recursive: true })

console.log('=== GitHub 身份 ===')
try {
  console.log(gh('auth status'))
} catch (e) {
  console.error('gh 未登录，请运行: gh auth login')
  process.exit(1)
}

console.log('\n=== 检查目标仓库 ===')
const repoStatus = {}
for (const [key, repo] of Object.entries(TARGET_REPO)) {
  const ok = checkRepo(repo)
  repoStatus[key] = ok
  console.log(`${ok ? '✓' : '✗'} ${repo}`)
}

const issues = fetchSourceIssues()
console.log(`\n源 Issue 数量（#15+ 带前缀）：${issues.length}`)

const prior = existsSync(STATE)
  ? JSON.parse(readFileSync(STATE, 'utf8'))
  : { migrated: [], skipped: [], failed: [] }
const doneKeys = new Set(
  prior.migrated.map((x) => `${x.source}→${normalizeRepo(x.targetRepo)}`)
)

const result = {
  migrated: [...prior.migrated],
  skipped: [],
  failed: [],
  apiLinks: [...(prior.apiLinks || [])]
}
const linkedApi = new Set(
  (prior.apiLinks || []).map((x) => x.vuepress)
)

for (const issue of issues) {
  const parsed = parseTarget(issue.title)
  if (!parsed) continue
  const { target, title } = parsed
  if (targetFilter && target !== targetFilter) continue
  if (skipApi && target === 'api') continue

  const targetRepo = normalizeRepo(TARGET_REPO[target])
  if (!targetRepo) {
    result.failed.push({ source: issue.number, reason: `unknown target ${target}` })
    continue
  }

  const sourceUrl = issue.html_url
  const exportPath = join(EXPORT, `${target}-${issue.number}.md`)
  writeFileSync(
    exportPath,
    `# ${title}\n\n${issue.body || ''}\n\nSource: ${sourceUrl}\n`
  )

  // api：仅记录镜像，不重复创建
  if (target === 'api' && API_MIRROR[issue.number]) {
    const mirrorNum = API_MIRROR[issue.number]
    const mirrorUrl = `https://github.com/Acongm/node-vercel-starter/issues/${mirrorNum}`
    if (!linkedApi.has(issue.number)) {
      result.apiLinks.push({
        vuepress: issue.number,
        vuepressUrl: sourceUrl,
        api: mirrorNum,
        apiUrl: mirrorUrl
      })
      linkedApi.add(issue.number)
    }
    if (!dryRun && repoStatus.api) {
      try {
        gh(
          `issue comment ${issue.number} -R ${SOURCE} --body "已关联目标仓 Issue（镜像）：${mirrorUrl}"`
        )
      } catch {
        // comment 可能无权限，忽略
      }
    }
    console.log(`LINK api vuepress#${issue.number} → node-vercel-starter#${mirrorNum}`)
    continue
  }

  if (!repoStatus[target]) {
    result.skipped.push({
      source: issue.number,
      target,
      targetRepo,
      reason: 'repo not accessible'
    })
    console.log(`SKIP ${target} vuepress#${issue.number} (${targetRepo} 不可访问)`)
    continue
  }

  const key = `${issue.number}→${targetRepo}`
  if (doneKeys.has(key)) {
    console.log(`SKIP (already migrated) vuepress#${issue.number}`)
    continue
  }

  const body = migrateBody(issue, title, sourceUrl)
  const tmp = join(ROOT, '.tmp-migrate.md')
  writeFileSync(tmp, body)

  if (dryRun) {
    console.log(`[dry-run] CREATE ${targetRepo}: ${title}`)
    continue
  }

  try {
    const url = gh(
      `issue create -R ${targetRepo} --title "${title.replace(/"/g, '\\"')}" --body-file "${tmp}"`
    )
    result.migrated.push({
      source: issue.number,
      sourceUrl,
      target,
      targetRepo,
      targetUrl: url,
      title
    })
    doneKeys.add(key)
    writeFileSync(STATE, JSON.stringify(result, null, 2))
    console.log(`OK vuepress#${issue.number} → ${url}`)
  } catch (e) {
    result.failed.push({
      source: issue.number,
      targetRepo,
      error: String(e.message || e).slice(0, 300)
    })
    console.error(`FAIL vuepress#${issue.number}`, e.message?.slice(0, 200))
  }
}

writeFileSync(STATE, JSON.stringify(result, null, 2))
console.log('\n=== 汇总 ===')
console.log(
  JSON.stringify(
    {
      migrated: result.migrated.length,
      skipped: result.skipped.length,
      failed: result.failed.length,
      apiLinks: result.apiLinks.length
    },
    null,
    2
  )
)
if (result.skipped.length) {
  console.log('\n不可访问仓库（请 gh auth login 后重试）:')
  console.log([...new Set(result.skipped.map((s) => s.targetRepo))].join(', '))
}
