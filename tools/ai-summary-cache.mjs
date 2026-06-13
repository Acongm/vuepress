#!/usr/bin/env node
/**
 * AI 摘要增量缓存：manifest（commit + contentHash）与 summaries 持久化
 * 无外部依赖，Node.js >= 18
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { join, relative, extname, resolve, dirname } from 'node:path'
import { execSync } from 'node:child_process'

export const CACHE_DIR_NAME = '.cache/ai-summaries'
export const MANIFEST_FILE = 'manifest.json'
export const SUMMARIES_FILE = 'summaries.json'

export function resolveCacheDir(rootDir) {
  return resolve(rootDir, CACHE_DIR_NAME)
}

export function resolveManifestPath(rootDir) {
  return join(resolveCacheDir(rootDir), MANIFEST_FILE)
}

export function resolveCacheSummariesPath(rootDir) {
  return join(resolveCacheDir(rootDir), SUMMARIES_FILE)
}

export function ensureCacheDir(rootDir) {
  const cacheDir = resolveCacheDir(rootDir)
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true })
  }
  return cacheDir
}

export function hashContent(content) {
  return `sha256:${createHash('sha256').update(content).digest('hex')}`
}

export function extractMarkdownContent(markdown, maxLength = 1000) {
  const withoutFrontmatter = markdown.replace(/^---\n[\s\S]*?\n---\n/, '')
  const withoutCode = withoutFrontmatter.replace(/```[\s\S]*?```/g, '[代码示例]')
  return withoutCode.slice(0, maxLength).trim()
}

export function getAllMarkdownFiles(docsDir) {
  const files = []

  function walk(dir) {
    for (const item of readdirSync(dir)) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        if (item.startsWith('.') || item === 'node_modules') continue
        walk(fullPath)
        continue
      }

      if (stat.isFile() && extname(item) === '.md' && item !== 'README.md') {
        const docPath = '/' + relative(docsDir, fullPath).replace(/\\/g, '/')
        files.push({ path: docPath, fullPath })
      }
    }
  }

  walk(docsDir)
  return files
}

export function getCurrentCommitSha(rootDir) {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA
  }

  try {
    return execSync('git rev-parse HEAD', {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

export function loadManifest(rootDir) {
  const manifestPath = resolveManifestPath(rootDir)
  if (!existsSync(manifestPath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(manifestPath, 'utf-8'))
  } catch {
    return null
  }
}

export function saveManifest(rootDir, manifest) {
  ensureCacheDir(rootDir)
  writeFileSync(resolveManifestPath(rootDir), JSON.stringify(manifest, null, 2))
}

export function loadCachedSummaries(rootDir) {
  const cachePath = resolveCacheSummariesPath(rootDir)
  if (existsSync(cachePath)) {
    try {
      const data = JSON.parse(readFileSync(cachePath, 'utf-8'))
      return {
        meta: data._meta || {},
        summaries: data.summaries || {},
      }
    } catch {
      // fall through
    }
  }

  return { meta: {}, summaries: {} }
}

export async function loadFallbackSummaries(fallbackBaseUrl) {
  if (!fallbackBaseUrl) {
    return { meta: {}, summaries: {} }
  }

  const base = fallbackBaseUrl.replace(/\/$/, '')
  const url = `${base}/summaries.json`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return { meta: {}, summaries: {} }
    }
    const data = await response.json()
    return {
      meta: data._meta || {},
      summaries: data.summaries || {},
    }
  } catch {
    return { meta: {}, summaries: {} }
  }
}

export function getChangedPathsFromGit(rootDir, fromCommit, toCommit = 'HEAD') {
  if (!fromCommit) {
    return null
  }

  try {
    const output = execSync(`git diff --name-only ${fromCommit}..${toCommit} -- docs`, {
      cwd: rootDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()

    if (!output) {
      return new Set()
    }

    return new Set(
      output
        .split('\n')
        .filter(Boolean)
        .filter((file) => file.endsWith('.md'))
        .map((file) => '/' + file.replace(/^docs\//, '')),
    )
  } catch {
    return null
  }
}

export function buildProcessingPlan({
  rootDir,
  docsDir,
  manifest,
  summaries,
  forceFull = false,
}) {
  const files = getAllMarkdownFiles(docsDir)
  const currentPaths = new Set(files.map((file) => file.path))
  const currentCommitSha = getCurrentCommitSha(rootDir)
  const gitChangedPaths = manifest?.lastCommitSha
    ? getChangedPathsFromGit(rootDir, manifest.lastCommitSha, currentCommitSha || 'HEAD')
    : null

  const toProcess = []
  const toReuse = []
  let deletedCount = 0

  for (const file of files) {
    const markdown = readFileSync(file.fullPath, 'utf-8')
    const content = extractMarkdownContent(markdown)
    const contentHash = hashContent(content)
    const enrichedFile = { ...file, content, contentHash }

    if (forceFull || !manifest) {
      toProcess.push(enrichedFile)
      continue
    }

    const cachedEntry = manifest.files?.[file.path]
    const hashMatch = cachedEntry?.contentHash === contentHash
    const hasSummary = Boolean(summaries[file.path])
    const gitHint = gitChangedPaths ? gitChangedPaths.has(file.path) : false

    if (hashMatch && hasSummary && !gitHint) {
      toReuse.push(file.path)
      continue
    }

    toProcess.push(enrichedFile)
  }

  if (manifest?.files) {
    for (const path of Object.keys(manifest.files)) {
      if (!currentPaths.has(path)) {
        delete summaries[path]
        deletedCount += 1
      }
    }
  }

  return {
    files,
    currentCommitSha,
    toProcess,
    toReuse,
    deletedCount,
    forceFull: forceFull || !manifest,
  }
}

export function updateManifestEntry(manifest, path, contentHash) {
  manifest.files[path] = {
    contentHash,
    processedAt: new Date().toISOString(),
  }
}

export function writeSummariesOutput({
  rootDir,
  outputPath,
  summaries,
  meta,
}) {
  ensureCacheDir(rootDir)

  const publicDir = dirname(outputPath)
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  const payload = {
    _meta: meta,
    summaries,
  }

  writeFileSync(outputPath, JSON.stringify(payload, null, 2))
  writeFileSync(resolveCacheSummariesPath(rootDir), JSON.stringify(payload, null, 2))
}
