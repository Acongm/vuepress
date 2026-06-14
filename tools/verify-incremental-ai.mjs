#!/usr/bin/env node

import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

import { buildAnalysisPlan } from './ai-summary-v1.mjs'
import { runSummaryBuild } from './generate-summaries-v1.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const docsDir = resolve(root, 'docs')
const seedPath = resolve(root, 'docs/.vuepress/public/summaries-v1.json')

function readSnapshot(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function assert(condition, message) {
  if (!condition) {
    console.error(`[verify-incremental-ai] ${message}`)
    process.exit(1)
  }
}

async function main() {
  assert(existsSync(seedPath), `seed snapshot missing: ${seedPath}`)

  const workDir = mkdtempSync(join(tmpdir(), 'ai-v1-verify-'))
  const fakeAnalyze = async ({ path }) => ({
    summary: `summary for ${path}`,
    keyPoints: ['a'],
    keywords: ['b'],
    techStack: [],
    difficulty: '未分级',
    contentType: '综合'
  })

  const bootstrapCache = join(workDir, 'bootstrap-cache.json')
  const bootstrapOutput = join(workDir, 'bootstrap-output.json')
  copyFileSync(seedPath, bootstrapCache)

  const completeSnapshot = await runSummaryBuild({
    docsDir,
    cachePath: bootstrapCache,
    outputPath: bootstrapOutput,
    apiKey: 'test-key',
    analyze: fakeAnalyze
  })

  const model = completeSnapshot.analysis?.model || 'deepseek-v4-pro'
  const baselinePlan = buildAnalysisPlan({
    docsDir,
    snapshot: completeSnapshot,
    model
  })
  assert(
    baselinePlan.aiCalls === 0,
    `expected aiCalls=0 after bootstrap, got ${baselinePlan.aiCalls}`
  )

  const target = baselinePlan.files.find((file) => !file.short)
  assert(target, 'bootstrap plan has no analyzable files')

  const unchangedCache = join(workDir, 'unchanged-cache.json')
  const unchangedOutput = join(workDir, 'unchanged-output.json')
  copyFileSync(bootstrapOutput, unchangedCache)

  const unchangedSnapshot = await runSummaryBuild({
    docsDir,
    cachePath: unchangedCache,
    outputPath: unchangedOutput,
    apiKey: 'test-key',
    analyze: fakeAnalyze
  })
  assert(
    unchangedSnapshot.stats.aiCalls === 0,
    `unchanged docs should keep aiCalls=0, got ${unchangedSnapshot.stats.aiCalls}`
  )

  const changedDocs = join(workDir, 'changed-docs')
  cpSync(docsDir, changedDocs, { recursive: true })
  const relativePath = target.path.replace(/^\//, '')
  const changedFile = join(changedDocs, relativePath)
  writeFileSync(
    changedFile,
    `${readFileSync(changedFile, 'utf8')}\n\n<!-- verify -->\n`
  )

  const changedCache = join(workDir, 'changed-cache.json')
  const changedOutput = join(workDir, 'changed-output.json')
  copyFileSync(bootstrapOutput, changedCache)

  const changedSnapshot = await runSummaryBuild({
    docsDir: changedDocs,
    cachePath: changedCache,
    outputPath: changedOutput,
    apiKey: 'test-key',
    analyze: fakeAnalyze
  })

  assert(
    changedSnapshot.stats.aiCalls === 1,
    `expected aiCalls=1 after one edit, got ${changedSnapshot.stats.aiCalls}`
  )
  assert(
    changedSnapshot.files[target.path]?.status === 'success',
    `expected success for ${target.path}`
  )

  rmSync(workDir, { recursive: true, force: true })
  console.log('[verify-incremental-ai] passed')
}

main().catch((error) => {
  console.error('[verify-incremental-ai]', error)
  process.exit(1)
})
