import { pathToFileURL } from 'node:url'
import path from 'node:path'

async function loadFromFile() {
  const url = pathToFileURL(path.resolve('examples/remote-module-loading/remote-module.mjs')).href
  const mod = await import(url)
  console.log('[file] hello=', mod.hello('world'))
}

async function loadFromData() {
  const code = `export const answer = 42; export default function(){ return answer }`
  const dataUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(code)}`
  const mod = await import(dataUrl)
  console.log('[data] answer=', mod.answer, 'default()=', mod.default())
}

await loadFromFile()
await loadFromData()


