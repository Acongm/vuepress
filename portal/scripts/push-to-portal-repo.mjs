#!/usr/bin/env node
/**
 * 将当前 portal 目录推送到 Acongm/portal（需本机 gh 登录 acongm，且有写权限）。
 *
 * 用法:
 *   node scripts/push-to-portal-repo.mjs
 *   node scripts/push-to-portal-repo.mjs --branch=platform/v2
 */

import { execSync } from 'node:child_process'
import { mkdtempSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const ROOT = dirname(fileURLToPath(import.meta.url))
const PORTAL_ROOT = join(ROOT, '..')
const TARGET = 'https://github.com/Acongm/portal.git'
const args = process.argv.slice(2)
const branch = args.find((a) => a.startsWith('--branch='))?.split('=')[1] || 'cursor/portal-init-8d71'

function run(cmd, cwd) {
  console.log(`> ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: '/bin/bash' })
}

function gh(cmd) {
  return execSync(`gh ${cmd}`, { encoding: 'utf8' }).trim()
}

console.log('=== 检查 gh 身份 ===')
const status = gh('auth status')
console.log(status)
if (!status.includes('acongm')) {
  console.warn('警告：当前 gh 账号可能不是 acongm，请 gh auth login')
}

const tmp = mkdtempSync(join(tmpdir(), 'portal-push-'))
try {
  run(`git clone --depth 1 ${TARGET} .`, tmp)
  run(
    `find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +`,
    tmp
  )
  run(
    `tar cf - --exclude=node_modules --exclude=.next --exclude=.source --exclude=.git -C "${PORTAL_ROOT}" . | tar xf - -C "${tmp}"`,
    tmp
  )

  run(`git checkout -B ${branch}`, tmp)
  run('git add -A', tmp)
  try {
    execSync('git diff --staged --quiet', { cwd: tmp, stdio: 'pipe' })
    console.log('无变更，跳过 commit')
  } catch {
    run(
      'git commit -m "feat(portal): Fumadocs init + vuepress docs migration"',
      tmp
    )
  }
  run(`git push -u origin ${branch}`, tmp)
  console.log(`\n✓ 已推送 ${TARGET} 分支 ${branch}`)
  console.log(
    `  创建 PR: gh pr create -R Acongm/portal --base main --head ${branch} --title "feat(portal): Fumadocs init + docs migration"`
  )
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
