import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  EXTRACT_VERSION,
  PROMPT_VERSION,
  SNAPSHOT_VERSION,
  buildAnalysisPlan,
  generateSnapshot
} from './ai-summary-v1.mjs'
import { runSummaryBuild } from './generate-summaries-v1.mjs'
import { restoreSnapshot } from './restore-summaries-v1.mjs'

async function createFixture() {
  const root = await mkdtemp(join(tmpdir(), 'ai-summary-v1-'))
  const docsDir = join(root, 'docs')
  await mkdir(join(docsDir, 'react'), { recursive: true })
  await writeFile(join(docsDir, 'README.md'), '# Index\nThis is not analyzed.')
  await writeFile(join(docsDir, 'short.md'), '# Short')
  await writeFile(
    join(docsDir, 'a.md'),
    '# Article A\n\nReact Fiber splits rendering work into interruptible units. '.repeat(3)
  )
  await writeFile(
    join(docsDir, 'react', 'b.md'),
    '# Article B\n\nVue reactivity tracks dependencies and schedules updates. '.repeat(3)
  )
  return { root, docsDir }
}

function fakeSummary(path) {
  return {
    summary: `Summary for ${path}`,
    keyPoints: ['point'],
    keywords: ['test'],
    techStack: [],
    difficulty: '入门',
    contentType: '概念'
  }
}

test('uses a self-contained versioned snapshot', async () => {
  const { root, docsDir } = await createFixture()
  try {
    const plan = buildAnalysisPlan({ docsDir, snapshot: null, model: 'model-a' })
    assert.equal(SNAPSHOT_VERSION, 1)
    assert.equal(PROMPT_VERSION, 'summary-v1')
    assert.equal(EXTRACT_VERSION, 'markdown-v1')
    assert.equal(plan.aiCalls, 2)
    assert.equal(plan.skippedFiles, 1)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('reuses unchanged files and invalidates only changed analysis', async () => {
  const { root, docsDir } = await createFixture()
  let calls = 0
  const analyze = async ({ path }) => {
    calls += 1
    return fakeSummary(path)
  }

  try {
    const first = await generateSnapshot({ docsDir, model: 'model-a', analyze })
    assert.equal(first.stats.aiCalls, 2)
    assert.equal(calls, 2)

    const second = await generateSnapshot({
      docsDir,
      model: 'model-a',
      snapshot: first,
      analyze
    })
    assert.equal(second.stats.aiCalls, 0)
    assert.equal(second.stats.reusedFiles, 2)
    assert.equal(calls, 2)

    await writeFile(
      join(docsDir, 'a.md'),
      '# Article A changed\n\nConcurrent rendering prioritizes urgent updates. '.repeat(3)
    )
    const changed = await generateSnapshot({
      docsDir,
      model: 'model-a',
      snapshot: second,
      analyze
    })
    assert.equal(changed.stats.aiCalls, 1)
    assert.equal(calls, 3)

    const modelChanged = buildAnalysisPlan({
      docsDir,
      model: 'model-b',
      snapshot: changed
    })
    assert.equal(modelChanged.aiCalls, 2)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('keeps failed files retryable and removes deleted entries', async () => {
  const { root, docsDir } = await createFixture()
  try {
    const failed = await generateSnapshot({
      docsDir,
      model: 'model-a',
      analyze: async ({ path }) => {
        if (path === '/a.md') throw new Error('provider failed')
        return fakeSummary(path)
      }
    })
    assert.equal(failed.files['/a.md'].status, 'error')
    assert.equal(failed.files['/react/b.md'].status, 'success')

    let retries = 0
    const retried = await generateSnapshot({
      docsDir,
      model: 'model-a',
      snapshot: failed,
      analyze: async ({ path }) => {
        retries += 1
        return fakeSummary(path)
      }
    })
    assert.equal(retried.stats.aiCalls, 1)
    assert.equal(retries, 1)
    assert.equal(retried.files['/a.md'].status, 'success')

    await rm(join(docsDir, 'react', 'b.md'))
    const deleted = await generateSnapshot({
      docsDir,
      model: 'model-a',
      snapshot: retried,
      analyze: async () => {
        throw new Error('unchanged files must not be analyzed')
      }
    })
    assert.equal(deleted.stats.aiCalls, 0)
    assert.equal(deleted.files['/react/b.md'], undefined)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('snapshot is serializable with file analysis metadata', async () => {
  const { root, docsDir } = await createFixture()
  try {
    const snapshot = await generateSnapshot({
      docsDir,
      model: 'model-a',
      analyze: async ({ path }) => fakeSummary(path)
    })
    const roundTrip = JSON.parse(JSON.stringify(snapshot))
    const entry = roundTrip.files['/a.md']
    assert.match(entry.sourceHash, /^sha256:/)
    assert.match(entry.analysisHash, /^sha256:/)
    assert.equal(entry.status, 'success')
    assert.equal(entry.summary.summary, 'Summary for /a.md')
    assert.ok(entry.processedAt)
    assert.equal(roundTrip.version, 1)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('restores one complete remote snapshot into cache and public output', async () => {
  const { root, docsDir } = await createFixture()
  const cachePath = join(root, '.cache', 'ai-summaries-v1.json')
  const outputPath = join(root, 'public', 'summaries-v1.json')
  try {
    const remote = await generateSnapshot({
      docsDir,
      model: 'model-a',
      analyze: async ({ path }) => fakeSummary(path)
    })
    const restored = await restoreSnapshot({
      cachePath,
      outputPath,
      fallbackUrl: 'https://example.test',
      fetchImpl: async (url) => {
        assert.equal(url, 'https://example.test/summaries-v1.json')
        return { ok: true, json: async () => remote }
      }
    })
    assert.equal(restored.source, 'remote')
    assert.deepEqual(
      JSON.parse(await readFile(cachePath, 'utf8')),
      JSON.parse(await readFile(outputPath, 'utf8'))
    )
    const plan = buildAnalysisPlan({ docsDir, snapshot: restored.snapshot, model: 'model-a' })
    assert.equal(plan.aiCalls, 0)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('dry-run and missing-key builds preserve restored summaries without provider calls', async () => {
  const { root, docsDir } = await createFixture()
  const cachePath = join(root, '.cache', 'ai-summaries-v1.json')
  const outputPath = join(root, 'public', 'summaries-v1.json')
  try {
    const existing = await generateSnapshot({
      docsDir,
      model: 'model-a',
      analyze: async ({ path }) => fakeSummary(path)
    })
    await mkdir(join(root, '.cache'), { recursive: true })
    await writeFile(cachePath, JSON.stringify(existing))

    let calls = 0
    const dryRun = await runSummaryBuild({
      docsDir,
      cachePath,
      outputPath,
      model: 'model-a',
      dryRun: true,
      apiKey: 'configured',
      analyze: async () => {
        calls += 1
        return fakeSummary('unexpected')
      }
    })
    assert.equal(dryRun.stats.aiCalls, 0)
    assert.equal(calls, 0)

    const noKey = await runSummaryBuild({
      docsDir,
      cachePath,
      outputPath,
      model: 'model-a',
      apiKey: '',
      analyze: async () => {
        calls += 1
        return fakeSummary('unexpected')
      }
    })
    assert.equal(noKey.stats.aiCalls, 0)
    assert.equal(calls, 0)
    assert.equal(JSON.parse(await readFile(outputPath, 'utf8')).files['/a.md'].status, 'success')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('deployment pipelines use Node 24 and the same incremental v1 build', async () => {
  const workflow = await readFile('.github/workflows/blank.yml', 'utf8')
  const vercel = JSON.parse(await readFile('vercel.json', 'utf8'))

  assert.match(workflow, /node-version:\s*['"]?24['"]?/)
  assert.match(workflow, /npm ci/)
  assert.match(workflow, /ai-summaries-v1-/)
  assert.match(workflow, /restore-summaries-v1\.mjs/)
  assert.match(workflow, /npm run build:ai:v1/)
  assert.doesNotMatch(workflow, /hashFiles\('docs\/\*\*\/\*\.md'\)/)
  assert.doesNotMatch(workflow, /\|\|\s*echo/)

  assert.match(vercel.buildCommand, /restore-summaries-v1\.mjs/)
  assert.match(vercel.buildCommand, /npm run build:ai:v1/)
  assert.doesNotMatch(vercel.buildCommand, /generate-summaries\.mjs/)
  assert.equal(vercel.installCommand, 'npm ci')
  assert.equal(vercel.outputDirectory, 'vuepress')
})
