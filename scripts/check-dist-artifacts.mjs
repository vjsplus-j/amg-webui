/**
 * Post-build artifact contract for public library CI.
 * Run after `npm run build:lib`.
 *
 * Covers: on-demand ESM rewrite, brand theme CSS, overlay runtime entry,
 * and coarse bundle-size budgets (not a perf benchmark).
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const BRANDS = ['mercedes', 'linear', 'porsche', 'lamborghini', 'ferrari', 'apple']

/** Soft ceilings (bytes) — tighten after measuring stable CI artifacts. */
const BUDGETS = {
  // Full ESM fat entry still pulls broad surface; on-demand is the size path.
  'dist/amg-webui.js': 6_000_000,
  'dist/style.css': 1_200_000,
  'dist/themes/*.css': 800_000
}

const requiredPaths = [
  'dist/amg-webui.js',
  'dist/style.css',
  'dist/runtime/index.js',
  'dist/security/index.js',
  'dist/theme/index.js',
  ...BRANDS.map((b) => `dist/themes/${b}.css`)
]

const onDemandButtonPath = 'dist/es/components/core/Button/index.js'

let failed = false

function fail(msg) {
  failed = true
  console.error(`[check:dist] ${msg}`)
}

for (const rel of requiredPaths) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) {
    fail(`missing ${rel}`)
    continue
  }
  const size = statSync(abs).size
  if (size <= 0) fail(`empty ${rel}`)
}

const buttonJsRel = onDemandButtonPath
if (!existsSync(resolve(root, buttonJsRel))) {
  fail(`missing on-demand Button (${buttonJsRel})`)
} else {
  const buttonJs = resolve(root, buttonJsRel)
  const size = statSync(buttonJs).size
  if (size <= 0) fail(`empty ${buttonJsRel}`)
  const src = readFileSync(buttonJs, 'utf8')
  if (src.includes('@amg-webui/')) {
    fail(`on-demand Button (${buttonJsRel}) still imports @amg-webui/* (expected amg-webui/* rewrite)`)
  }
}

function checkBudget(rel, maxBytes) {
  const abs = resolve(root, rel)
  if (!existsSync(abs)) return
  const size = statSync(abs).size
  if (size > maxBytes) {
    fail(
      `budget exceeded ${rel}: ${size} bytes > ${maxBytes} ` +
        `(${(size / 1024).toFixed(1)} KiB)`
    )
  } else {
    console.log(
      `[check:dist] OK ${rel} ${(size / 1024).toFixed(1)} KiB (budget ${(maxBytes / 1024).toFixed(0)} KiB)`
    )
  }
}

checkBudget('dist/amg-webui.js', BUDGETS['dist/amg-webui.js'])
checkBudget('dist/style.css', BUDGETS['dist/style.css'])

for (const brand of BRANDS) {
  checkBudget(join('dist/themes', `${brand}.css`), BUDGETS['dist/themes/*.css'])
}

if (failed) {
  console.error('[check:dist] FAIL — see docs/ENGINEERING.md § CI coverage')
  process.exit(1)
}

console.log('[check:dist] on-demand · brand CSS · runtime · size budgets OK')
