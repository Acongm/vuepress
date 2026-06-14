#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function analyzeCoverage({ expectedPaths, snapshot }) {
  const groups = {
    missing: [],
    indexPending: [],
    error: [],
    excluded: [],
    short: []
  }
  let success = 0

  for (const path of [...expectedPaths].sort()) {
    const entry = snapshot?.files?.[path]
    if (entry?.status === 'success' && entry.summary) success += 1
    else if (entry?.status === 'error') groups.error.push(path)
    else if (entry?.status === 'excluded') groups.excluded.push(path)
    else if (entry?.status === 'short') groups.short.push(path)
    else if (path.endsWith('/README.md')) groups.indexPending.push(path)
    else groups.missing.push(path)
  }

  const analyzable =
    expectedPaths.length -
    groups.excluded.length -
    groups.short.length -
    groups.indexPending.length
  return {
    ...groups,
    success,
    analyzable,
    coverage: analyzable ? success / analyzable : 1
  }
}

export function coverageMeetsMinimum(report, minimum) {
  return report.missing.length === 0 && report.coverage >= minimum
}

function listMarkdown(docsDir) {
  const paths = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const fullPath = resolve(dir, name)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        if (!name.startsWith('.')) walk(fullPath)
      } else if (extname(name) === '.md') {
        paths.push(`/${relative(docsDir, fullPath).replace(/\\/g, '/')}`)
      }
    }
  }
  walk(docsDir)
  return paths
}

function printGroup(name, paths) {
  console.log(`[ai-v1-coverage] ${name}: ${paths.length}`)
  paths.forEach((path) => console.log(`  - ${path}`))
}

function main() {
  const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
  const snapshotPath = resolve(
    root,
    process.env.AI_SUMMARY_V1_PATH || 'docs/.vuepress/public/summaries-v1.json'
  )
  const snapshot = existsSync(snapshotPath)
    ? JSON.parse(readFileSync(snapshotPath, 'utf8'))
    : { files: {} }
  const report = analyzeCoverage({
    expectedPaths: listMarkdown(resolve(root, 'docs')),
    snapshot
  })

  printGroup('missing', report.missing)
  printGroup('index-pending', report.indexPending)
  printGroup('error', report.error)
  printGroup('excluded', report.excluded)
  printGroup('short', report.short)
  console.log(
    `[ai-v1-coverage] success=${report.success}/${
      report.analyzable
    } coverage=${(report.coverage * 100).toFixed(2)}%`
  )

  const minimum = Number(process.env.AI_SUMMARY_MIN_COVERAGE || 0.6)
  if (
    process.argv.includes('--strict') &&
    !coverageMeetsMinimum(report, minimum)
  ) {
    process.exitCode = 1
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
