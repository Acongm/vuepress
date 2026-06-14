import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

export const SNAPSHOT_VERSION = 1
export const PROMPT_VERSION = 'summary-v1'
export const EXTRACT_VERSION = 'markdown-v1'

function sha256(value) {
  return `sha256:${createHash('sha256').update(value).digest('hex')}`
}

export function normalizeMarkdown(markdown) {
  return markdown
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, '[代码示例]')
    .replace(/\s+/g, ' ')
    .trim()
}

export function createAnalysisHash({ sourceHash, model }) {
  return sha256(
    JSON.stringify({
      sourceHash,
      model,
      promptVersion: PROMPT_VERSION,
      extractVersion: EXTRACT_VERSION
    })
  )
}

function listMarkdownFiles(docsDir) {
  const files = []

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const fullPath = join(dir, name)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        if (!name.startsWith('.') && name !== 'node_modules') walk(fullPath)
        continue
      }
      if (!stat.isFile() || extname(name) !== '.md') {
        continue
      }
      files.push({
        path: `/${relative(docsDir, fullPath).replace(/\\/g, '/')}`,
        fullPath
      })
    }
  }

  walk(docsDir)
  return files.sort((a, b) => a.path.localeCompare(b.path))
}

function inspectFiles(docsDir, model) {
  return listMarkdownFiles(docsDir).map((file) => {
    const content = normalizeMarkdown(readFileSync(file.fullPath, 'utf8'))
    const sourceHash = sha256(content)
    return {
      ...file,
      content,
      sourceHash,
      analysisHash: createAnalysisHash({ sourceHash, model }),
      short: false
    }
  })
}

export function buildAnalysisPlan({ docsDir, snapshot, model }) {
  const files = inspectFiles(docsDir, model)
  const toAnalyze = []
  const reusable = []
  const short = []

  for (const file of files) {
    const cached = snapshot?.files?.[file.path]
    if (
      cached?.status === 'success' &&
      cached.analysisHash === file.analysisHash &&
      cached.summary
    ) {
      reusable.push(file)
    } else {
      toAnalyze.push(file)
    }
  }

  return {
    files,
    toAnalyze,
    reusable,
    short,
    aiCalls: toAnalyze.length,
    skippedFiles: short.length
  }
}

export async function generateSnapshot({
  docsDir,
  model,
  snapshot = null,
  analyze,
  analysisConcurrency = 4,
  onProgress
}) {
  if (typeof analyze !== 'function') {
    throw new TypeError('generateSnapshot requires an analyze function')
  }

  const startedAt = Date.now()
  const plan = buildAnalysisPlan({ docsDir, snapshot, model })
  const files = {}
  let failedFiles = 0

  for (const file of plan.reusable) {
    files[file.path] = snapshot.files[file.path]
  }

  let nextIndex = 0
  let processedFiles = 0
  const createSnapshot = () => {
    const totalFiles = plan.files.length
    const reusedFiles = plan.reusable.length
    return {
      version: SNAPSHOT_VERSION,
      generatedAt: new Date().toISOString(),
      analysis: {
        model,
        promptVersion: PROMPT_VERSION,
        extractVersion: EXTRACT_VERSION
      },
      files: { ...files },
      stats: {
        totalFiles,
        reusedFiles,
        pendingFiles: plan.toAnalyze.length,
        completedFiles: reusedFiles + processedFiles,
        skippedFiles: 0,
        failedFiles,
        aiCalls: plan.aiCalls,
        hitRate: totalFiles ? reusedFiles / totalFiles : 1,
        durationMs: Date.now() - startedAt
      }
    }
  }
  const workerCount = Math.min(
    Math.max(1, analysisConcurrency),
    plan.toAnalyze.length
  )
  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < plan.toAnalyze.length) {
      const file = plan.toAnalyze[nextIndex]
      nextIndex += 1
      try {
        const summary = await analyze({
          path: file.path,
          content: file.content,
          sourceHash: file.sourceHash,
          analysisHash: file.analysisHash
        })
        files[file.path] = {
          sourceHash: file.sourceHash,
          analysisHash: file.analysisHash,
          status: 'success',
          summary,
          processedAt: new Date().toISOString()
        }
      } catch (error) {
        failedFiles += 1
        files[file.path] = {
          sourceHash: file.sourceHash,
          analysisHash: file.analysisHash,
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
          processedAt: new Date().toISOString()
        }
      }
      processedFiles += 1
      if (onProgress) {
        await onProgress({
          path: file.path,
          entry: files[file.path],
          completed: processedFiles,
          total: plan.toAnalyze.length,
          snapshot: createSnapshot()
        })
      }
    }
  })
  await Promise.all(workers)
  return createSnapshot()
}
