/**
 * Vite lib/runtime builds rewrite `new URL('./sortRows.worker.ts', import.meta.url)`
 * into absolute `/assets/sortRows.worker-HASH.js`, which breaks published consumers.
 * Force a sibling relative URL next to the emitted `sortRows.worker.js`.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const targets = [
  resolve(root, 'dist/utils/data-display/sortRows.js'),
  resolve(root, 'dist/amg-webui.js')
]
const worker = resolve(root, 'dist/utils/data-display/sortRows.worker.js')

if (!existsSync(worker)) {
  console.error('[fix-sort-worker-url] FAIL — sortRows.worker.js missing')
  process.exit(1)
}

let failed = false
for (const file of targets) {
  if (!existsSync(file)) {
    console.warn(`[fix-sort-worker-url] skip missing ${file}`)
    continue
  }
  const src = readFileSync(file, 'utf8')
  const relativeWorker =
    file.endsWith('amg-webui.js')
      ? './utils/data-display/sortRows.worker.js'
      : './sortRows.worker.js'
  const next = src.replace(
    /new URL\(\s*(?:\/\*[\s\S]*?\*\/\s*)?["'][^"']*sortRows\.worker[^"']*["']\s*,\s*import\.meta\.url\s*\)/g,
    `new URL("${relativeWorker}", import.meta.url)`
  )
  if (next === src) {
    if (src.includes(relativeWorker) || !src.includes('sortRows.worker')) {
      console.log(`[fix-sort-worker-url] OK ${file}`)
      continue
    }
    console.error(`[fix-sort-worker-url] FAIL pattern not found in ${file}`)
    failed = true
    continue
  }
  writeFileSync(file, next, 'utf8')
  console.log(`[fix-sort-worker-url] rewrote ${file} → ${relativeWorker}`)
}

if (failed) process.exit(1)
