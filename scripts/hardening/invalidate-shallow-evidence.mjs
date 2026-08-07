/**
 * Invalidate shallow / fake PASS in on-disk a11y.json and keyboard.json evidence.
 *
 * - keyboard PASS that fails validateKeyboardEvidence → rewrite status FAIL (honest detail)
 * - a11y PASS that fails validateA11yEvidence → rewrite status FAIL with A11Y_STRUCTURE/A11Y_CONTRAST placeholders
 * - Does NOT invent PASS
 *
 * Usage: node scripts/hardening/invalidate-shallow-evidence.mjs
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateA11yEvidence, validateKeyboardEvidence } from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const evidenceRoot = join(root, 'component-hardening', 'evidence')

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function a11yPlaceholders(detail, previous) {
  return {
    status: 'FAIL',
    A11Y_STRUCTURE: {
      status: 'MISSING',
      detail:
        'A11Y_STRUCTURE not recorded — shallow family attribution or mount-only text insufficient for Stable'
    },
    A11Y_CONTRAST: {
      status: 'MISSING',
      detail:
        'A11Y_CONTRAST not recorded — color-contrast must be PASS, FAIL, or BLOCKED (theme) for Stable'
    },
    detail,
    invalidatedAt: new Date().toISOString(),
    previousStatus: previous?.status || 'PASS',
    ...(previous?.source ? { priorSource: previous.source } : {}),
    ...(previous?.family ? { priorFamily: previous.family } : {}),
    ...(previous?.tests ? { priorTests: previous.tests } : {})
  }
}

function invalidateKeyboard(path, name) {
  const data = loadJson(path)
  const status = String(data.status || '').toUpperCase()
  if (status !== 'PASS') return { changed: false, reason: status }

  const v = validateKeyboardEvidence(data)
  if (v.ok) return { changed: false, reason: 'valid PASS' }

  writeJson(path, {
    ...data,
    status: 'FAIL',
    detail: v.detail,
    invalidatedAt: new Date().toISOString(),
    previousStatus: 'PASS'
  })
  return { changed: true, reason: v.detail }
}

function invalidateA11y(path, name) {
  const data = loadJson(path)
  const status = String(data.status || '').toUpperCase()
  if (status !== 'PASS') return { changed: false, reason: status }

  const v = validateA11yEvidence(data)
  if (v.ok) return { changed: false, reason: 'valid PASS' }

  writeJson(path, a11yPlaceholders(v.detail, data))
  return { changed: true, reason: v.detail }
}

function main() {
  if (!existsSync(evidenceRoot)) {
    console.error('[invalidate-shallow-evidence] missing evidence root')
    process.exit(1)
  }

  const components = readdirSync(evidenceRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()

  let keyboardInvalidated = 0
  let a11yInvalidated = 0
  let keyboardSkipped = 0
  let a11ySkipped = 0
  const samples = { keyboard: [], a11y: [] }

  for (const name of components) {
    const dir = join(evidenceRoot, name)
    const keyboardPath = join(dir, 'keyboard.json')
    const a11yPath = join(dir, 'a11y.json')

    if (existsSync(keyboardPath)) {
      const r = invalidateKeyboard(keyboardPath, name)
      if (r.changed) {
        keyboardInvalidated += 1
        if (samples.keyboard.length < 5) samples.keyboard.push({ name, detail: r.reason })
      } else {
        keyboardSkipped += 1
      }
    }

    if (existsSync(a11yPath)) {
      const r = invalidateA11y(a11yPath, name)
      if (r.changed) {
        a11yInvalidated += 1
        if (samples.a11y.length < 5) samples.a11y.push({ name, detail: r.reason })
      } else {
        a11ySkipped += 1
      }
    }
  }

  console.log('[invalidate-shallow-evidence] done')
  console.log(
    JSON.stringify(
      {
        components: components.length,
        keyboardInvalidated,
        a11yInvalidated,
        keyboardUnchanged: keyboardSkipped,
        a11yUnchanged: a11ySkipped,
        samples
      },
      null,
      2
    )
  )
}

main()
