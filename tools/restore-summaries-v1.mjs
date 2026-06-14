import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SNAPSHOT_VERSION } from './ai-summary-v1.mjs'

function isValidSnapshot(snapshot) {
  return (
    snapshot?.version === SNAPSHOT_VERSION &&
    snapshot.files &&
    typeof snapshot.files === 'object'
  )
}

async function readSnapshot(path) {
  if (!existsSync(path)) return null
  try {
    const snapshot = JSON.parse(await readFile(path, 'utf8'))
    return isValidSnapshot(snapshot) ? snapshot : null
  } catch {
    return null
  }
}

async function writeSnapshot(path, snapshot) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(snapshot, null, 2)}\n`)
}

export async function restoreSnapshot({
  cachePath,
  outputPath,
  fallbackUrl,
  fetchImpl = fetch
}) {
  const local = await readSnapshot(cachePath)
  if (local) {
    if (!existsSync(outputPath)) await writeSnapshot(outputPath, local)
    return { source: 'local', snapshot: local }
  }

  const output = await readSnapshot(outputPath)
  if (fallbackUrl) {
    const url = `${fallbackUrl.replace(/\/$/, '')}/summaries-v1.json`
    try {
      const response = await fetchImpl(url)
      if (response.ok) {
        const remote = await response.json()
        if (isValidSnapshot(remote)) {
          await writeSnapshot(cachePath, remote)
          if (!output) await writeSnapshot(outputPath, remote)
          return { source: 'remote', snapshot: remote }
        }
      }
    } catch (error) {
      console.warn('[ai-v1-restore] remote restore failed:', error.message)
    }
  }

  if (output) {
    await writeSnapshot(cachePath, output)
    return { source: 'output', snapshot: output }
  }

  return { source: 'empty', snapshot: null }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const result = await restoreSnapshot({
    cachePath: resolve(root, '.cache/ai-summaries-v1.json'),
    outputPath: resolve(root, 'docs/.vuepress/public/summaries-v1.json'),
    fallbackUrl: process.env.SUMMARIES_FALLBACK_URL || 'https://www.acongm.com'
  })
  console.log(`[ai-v1-restore] source=${result.source}`)
}
