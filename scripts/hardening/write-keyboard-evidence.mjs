/**
 * Write keyboard gate evidence from real family unit tests.
 *
 * PASS only when testCases.length > 0 and every case has status PASS.
 * PASS evidence is stamped with sourceHash/contractHash for freshness gates.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { stampEvidenceMeta, validateKeyboardEvidence } from './evidence.mjs'

export const KEYBOARD_EVIDENCE_TOOL_VERSION = '1'

/**
 * @param {object} opts
 * @param {string} opts.component
 * @param {string} opts.family
 * @param {string} opts.testFile
 * @param {Array<{ name: string, key: string, expected: string, status: 'PASS' | 'FAIL' }>} opts.testCases
 * @param {string} [opts.runId]
 * @param {string} [opts.root]
 * @returns {object}
 */
export function buildKeyboardEvidence(opts) {
  const testCases = Array.isArray(opts.testCases) ? opts.testCases : []
  const keys = [
    ...new Set(testCases.map((tc) => String(tc.key || '')).filter(Boolean))
  ]
  const allPass =
    testCases.length > 0 && testCases.every((tc) => tc.status === 'PASS')

  const payload = {
    status: allPass ? 'PASS' : 'FAIL',
    component: opts.component,
    family: opts.family,
    testFile: opts.testFile,
    testCases,
    keys,
    runId: opts.runId || randomUUID(),
    toolVersion: KEYBOARD_EVIDENCE_TOOL_VERSION,
    verifiedAt: new Date().toISOString()
  }

  if (!allPass) {
    const failed = testCases.filter((tc) => tc.status !== 'PASS')
    payload.detail =
      failed.length > 0
        ? `keyboard testCases incomplete or failed: ${failed.map((tc) => tc.name).join(', ')}`
        : 'keyboard testCases required (≥1 PASS case with expected behavior)'
  } else {
    payload.detail = testCases.map((tc) => `${tc.key}: ${tc.expected}`).join('; ')
  }

  return payload
}

/**
 * @param {object} opts — same as buildKeyboardEvidence
 */
export function writeKeyboardEvidence(opts) {
  const root = opts.root || process.cwd()
  const hardening = join(root, 'component-hardening')
  let payload = buildKeyboardEvidence(opts)
  if (payload.status === 'PASS') {
    payload = stampEvidenceMeta(opts.component, payload, hardening, root)
  }
  const v = validateKeyboardEvidence(payload)
  if (payload.status === 'PASS' && !v.ok) {
    payload.status = 'FAIL'
    payload.detail = v.detail
  }
  const dir = join(hardening, 'evidence', opts.component)
  mkdirSync(dir, { recursive: true })
  const path = join(dir, 'keyboard.json')
  writeFileSync(path, JSON.stringify(payload, null, 2) + '\n', 'utf8')
  return { path, payload }
}

/**
 * Rewrite batch-written fake PASS keyboard evidence to honest FAIL.
 * @param {string} [root]
 */
export function invalidateBatchKeyboardEvidence(root = process.cwd()) {
  const evidenceRoot = join(root, 'component-hardening', 'evidence')
  if (!existsSync(evidenceRoot)) return { invalidated: 0, unchanged: 0 }
  let invalidated = 0
  let unchanged = 0

  for (const name of readdirSync(evidenceRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)) {
    const path = join(evidenceRoot, name, 'keyboard.json')
    if (!existsSync(path)) continue
    const data = JSON.parse(readFileSync(path, 'utf8'))
    const status = String(data.status || '').toUpperCase()
    if (status !== 'PASS') {
      unchanged += 1
      continue
    }

    const detail = String(data.detail || '')
    const source = String(data.source || data.testFile || '')
    const isBatch =
      /batch keyboard/i.test(detail) ||
      /batch-keyboard-evidence/.test(source) ||
      (!Array.isArray(data.testCases) && Array.isArray(data.keys))

    const v = validateKeyboardEvidence(data)
    if (!isBatch && v.ok) {
      unchanged += 1
      continue
    }

    writeFileSync(
      path,
      JSON.stringify(
        {
          ...data,
          status: 'FAIL',
          detail: v.ok
            ? 'invalidated batch keyboard PASS — mount-only key dispatch is not behavioral evidence'
            : v.detail,
          previousStatus: 'PASS',
          invalidatedAt: new Date().toISOString()
        },
        null,
        2
      ) + '\n',
      'utf8'
    )
    invalidated += 1
  }

  return { invalidated, unchanged }
}
