/**
 * Evidence SSOT helpers — Stable requires on-disk gate evidence, not structural deferrals.
 *
 * Layout:
 *   component-hardening/evidence/<Name>/manifest.json
 *   component-hardening/evidence/<Name>/a11y.json
 *   component-hardening/evidence/<Name>/visual.json
 *   component-hardening/evidence/<Name>/behavior.json
 *   component-hardening/evidence/<Name>/keyboard.json
 *   component-hardening/evidence/<Name>/ssr.json
 *   component-hardening/evidence/<Name>/docs.json
 *   component-hardening/evidence/<Name>/package.json  (optional override)
 *
 * Credibility rules:
 *   - keyboard PASS requires a real key matrix (keys[] / matrix / actions), not mount-only text
 *   - a11y PASS may split A11Y_STRUCTURE vs A11Y_CONTRAST; contrast must not be silently disabled forever
 */
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { hashComponentSource } from './hash-component-source.mjs'

export const EVIDENCE_GATES = [
  'a11y',
  'visual',
  'behavior',
  'keyboard',
  'ssr',
  'docs',
  'theme',
  'rtl',
  'perf'
]

export function evidenceDir(hardeningRoot, name) {
  return join(hardeningRoot, 'evidence', name)
}

let _hashCache = null

function currentHashes(hardeningRoot, name, repoRoot) {
  const key = `${repoRoot}|${hardeningRoot}|${name}`
  if (!_hashCache) _hashCache = new Map()
  if (_hashCache.has(key)) return _hashCache.get(key)
  const h = hashComponentSource(repoRoot, name, hardeningRoot)
  _hashCache.set(key, h)
  return h
}

/** Stamp evidence payloads with source/contract/git metadata. */
export function stampEvidenceMeta(name, payload, hardeningRoot, repoRoot = resolve(hardeningRoot, '..')) {
  const { sourceHash, contractHash, gitSha } = currentHashes(hardeningRoot, name, repoRoot)
  return {
    ...payload,
    ...(sourceHash ? { sourceHash } : {}),
    ...(contractHash ? { contractHash } : {}),
    ...(gitSha ? { gitSha } : {}),
    stampedAt: new Date().toISOString()
  }
}

function resolveEvidencePath(repoRoot, relPath) {
  if (!relPath || typeof relPath !== 'string') return null
  const normalized = relPath.replace(/\\/g, '/')
  if (normalized.startsWith('/')) return null
  return resolve(repoRoot, normalized)
}

function validatePassArtifactPaths(data, repoRoot) {
  const paths = []
  if (data.source) paths.push(data.source)
  if (data.testFile) paths.push(data.testFile)
  if (Array.isArray(data.tests)) paths.push(...data.tests)
  const missing = []
  for (const rel of paths) {
    const abs = resolveEvidencePath(repoRoot, rel)
    if (!abs || !existsSync(abs)) missing.push(rel)
  }
  if (missing.length) {
    return {
      ok: false,
      detail: `PASS references missing path(s): ${missing.join(', ')}`
    }
  }
  return { ok: true, detail: '' }
}

/**
 * Check whether on-disk evidence meta matches current source/contract hashes.
 * Returns { fresh, stale, hasHash, detail, current, stored }.
 */
export function checkEvidenceFreshness(hardeningRoot, name, evidenceFile, repoRoot = resolve(hardeningRoot, '..')) {
  const filePath = join(evidenceDir(hardeningRoot, name), evidenceFile)
  if (!existsSync(filePath)) {
    return {
      fresh: true,
      stale: false,
      hasHash: false,
      detail: 'evidence file missing',
      current: null,
      stored: null
    }
  }

  let data
  try {
    data = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (e) {
    return {
      fresh: false,
      stale: true,
      hasHash: false,
      detail: `invalid JSON: ${e.message}`,
      current: null,
      stored: null
    }
  }

  const current = currentHashes(hardeningRoot, name, repoRoot)
  const stored = {
    sourceHash: data.sourceHash || null,
    contractHash: data.contractHash || null,
    gitSha: data.gitSha || null
  }
  const hasHash = Boolean(stored.sourceHash || stored.contractHash)
  const mismatches = []

  if (stored.sourceHash && current.sourceHash && stored.sourceHash !== current.sourceHash) {
    mismatches.push('sourceHash mismatch')
  }
  if (stored.contractHash && current.contractHash && stored.contractHash !== current.contractHash) {
    mismatches.push('contractHash mismatch')
  }

  if (mismatches.length) {
    return {
      fresh: false,
      stale: true,
      hasHash,
      detail: `STALE: ${mismatches.join('; ')}`,
      current,
      stored
    }
  }

  const status = String(data.status || '').toUpperCase()

  // PASS evidence without sourceHash/contractHash is STALE — forbids yesterday-PASS forever
  if (status === 'PASS' && !hasHash) {
    return {
      fresh: false,
      stale: true,
      hasHash: false,
      detail: 'STALE: PASS evidence missing sourceHash/contractHash',
      current,
      stored
    }
  }

  if (status === 'PASS') {
    const paths = validatePassArtifactPaths(data, repoRoot)
    if (!paths.ok) {
      return {
        fresh: false,
        stale: true,
        hasHash,
        detail: paths.detail,
        current,
        stored
      }
    }
  }

  return {
    fresh: true,
    stale: false,
    hasHash,
    detail: hasHash ? 'hashes match' : 'no stored hashes (legacy non-PASS)',
    current,
    stored
  }
}

/**
 * Validate keyboard evidence payload quality.
 * Returns { ok, detail } — ok=false means treat PASS as FAIL.
 */
export function validateKeyboardEvidence(data) {
  if (!data || typeof data !== 'object') {
    return { ok: false, detail: 'keyboard evidence missing body' }
  }
  const status = String(data.status || '').toUpperCase()
  if (status === 'N/A') {
    return { ok: true, detail: data.detail || 'keyboard N/A' }
  }
  if (status !== 'PASS') {
    return { ok: false, detail: data.detail || `keyboard ${status}` }
  }

  const testCases = Array.isArray(data.testCases) ? data.testCases : []
  const passCases = testCases.filter(
    (tc) =>
      tc &&
      String(tc.status || '').toUpperCase() === 'PASS' &&
      String(tc.expected || tc.behavior || '').trim().length > 0
  )
  if (testCases.length === 0 || passCases.length === 0) {
    const keysOnly =
      (Array.isArray(data.keys) && data.keys.length > 0) ||
      (Array.isArray(data.matrix) && data.matrix.length > 0) ||
      (Array.isArray(data.actions) && data.actions.length > 0)
    if (keysOnly || !Array.isArray(data.testCases)) {
      return {
        ok: false,
        detail:
          'keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text'
      }
    }
    return {
      ok: false,
      detail: 'keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text'
    }
  }

  const keys = []
  for (const tc of passCases) {
    if (tc.key) keys.push(String(tc.key))
  }
  if (Array.isArray(data.keys)) keys.push(...data.keys)

  const unique = [...new Set(keys.map((k) => String(k)))]
  const caseSummary = passCases
    .map((tc) => `${tc.key}: ${tc.expected || tc.behavior}`)
    .slice(0, 8)
    .join('; ')

  return {
    ok: true,
    detail: data.detail || `keyboard testCases PASS (${passCases.length}): ${caseSummary}`
  }
}

/**
 * Validate a11y evidence — structure + contrast dimensions.
 * Silent long-term disable of color-contrast without recording A11Y_CONTRAST is FAIL.
 */
export function validateA11yEvidence(data) {
  if (!data || typeof data !== 'object') {
    return { ok: false, detail: 'a11y evidence missing body' }
  }
  const status = String(data.status || '').toUpperCase()
  if (status === 'N/A') {
    return { ok: true, detail: data.detail || 'a11y N/A' }
  }
  if (status !== 'PASS') {
    return { ok: false, detail: data.detail || `a11y ${status}` }
  }

  const structure = data.A11Y_STRUCTURE || data.structure || null
  const contrast = data.A11Y_CONTRAST || data.contrast || null

  if (structure || contrast) {
    const structStatus = String(structure?.status || structure || 'PASS').toUpperCase()
    const contrastStatus = String(
      contrast?.status || contrast || 'MISSING'
    ).toUpperCase()
    if (structStatus === 'FAIL') {
      return { ok: false, detail: 'A11Y_STRUCTURE FAIL' }
    }
    if (contrastStatus === 'MISSING') {
      return {
        ok: false,
        detail: 'A11Y_CONTRAST missing — contrast must be PASS, FAIL, or BLOCKED (theme)'
      }
    }
    if (contrastStatus === 'FAIL') {
      return { ok: false, detail: contrast?.detail || 'A11Y_CONTRAST FAIL' }
    }
    // BLOCKED is allowed with explicit theme reason — does not authorize Stable
    if (contrastStatus === 'BLOCKED') {
      return {
        ok: false,
        detail: `A11Y_CONTRAST BLOCKED: ${contrast?.detail || contrast?.theme || 'theme unspecified'}`
      }
    }
    const critical = Number(structure?.critical ?? data.critical ?? 0)
    const serious = Number(structure?.serious ?? data.serious ?? 0)
    if (critical > 0 || serious > 0) {
      return {
        ok: false,
        detail: `a11y blocking violations critical=${critical} serious=${serious}`
      }
    }
    return {
      ok: true,
      detail:
        data.detail ||
        `A11Y_STRUCTURE=${structStatus}; A11Y_CONTRAST=${contrastStatus}`
    }
  }

  // Legacy flat PASS without dimensions — accept only if explicit counts say zero blocking
  const critical = Number(data.critical ?? data.blocking ?? -1)
  const serious = Number(data.serious ?? -1)
  if (critical === 0 && (serious === 0 || serious === -1)) {
    // Still require contrast field going forward when disabledRules mentioned
    const detail = String(data.detail || '')
    if (/color-contrast|disableRules/i.test(detail)) {
      return {
        ok: false,
        detail:
          'a11y evidence disabled color-contrast without A11Y_CONTRAST dimension — not Stable'
      }
    }
    return { ok: true, detail: data.detail || 'a11y ok (legacy flat)' }
  }

  // Family-attributed shallow strings without counts
  if (critical < 0 && !data.violations) {
    return {
      ok: false,
      detail:
        'a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)'
    }
  }

  return { ok: true, detail: data.detail || 'a11y ok' }
}

export function loadEvidenceManifest(hardeningRoot, name, repoRoot = resolve(hardeningRoot, '..')) {
  const dir = evidenceDir(hardeningRoot, name)
  const manifestPath = join(dir, 'manifest.json')
  if (!existsSync(manifestPath)) {
    return { exists: false, dir, gates: {}, manifest: null, freshness: {} }
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const freshness = {}
  const manifestFresh = checkEvidenceFreshness(hardeningRoot, name, 'manifest.json', repoRoot)
  freshness.manifest = manifestFresh

  const gates = {}
  for (const id of EVIDENCE_GATES) {
    const file = join(dir, `${id}.json`)
    if (!existsSync(file)) {
      gates[id] = { present: false, status: 'MISSING' }
      continue
    }
    try {
      const data = JSON.parse(readFileSync(file, 'utf8'))
      let status = String(data.status || '').toUpperCase()
      if (!['PASS', 'FAIL', 'N/A', 'BLOCKED'].includes(status)) status = 'FAIL'

      let detail = data.detail || data.summary || ''
      let stale = false
      const freshCheck = checkEvidenceFreshness(hardeningRoot, name, `${id}.json`, repoRoot)
      freshness[id] = freshCheck
      if (freshCheck.stale) {
        stale = true
        if (status === 'PASS' || status === 'N/A') {
          status = 'STALE'
          detail = freshCheck.detail
        } else {
          detail = `${detail}; ${freshCheck.detail}`.replace(/^;\s*/, '')
        }
      }

      // Credibility rewrites
      if (id === 'keyboard' && status === 'PASS') {
        const v = validateKeyboardEvidence(data)
        if (!v.ok) {
          status = 'FAIL'
          detail = v.detail
        } else {
          detail = v.detail
        }
      }
      if (id === 'a11y' && status === 'PASS') {
        const v = validateA11yEvidence(data)
        if (!v.ok) {
          status = 'FAIL'
          detail = v.detail
        } else {
          detail = v.detail
        }
      }

      gates[id] = {
        present: true,
        status: status === 'BLOCKED' ? 'FAIL' : status,
        detail,
        data,
        stale
      }
    } catch (e) {
      gates[id] = {
        present: true,
        status: 'FAIL',
        detail: `invalid JSON: ${e.message}`,
        stale: true
      }
    }
  }
  return { exists: true, dir, gates, manifest, freshness }
}

/**
 * Resolve a gate that may be structural or evidence-backed.
 * When severity is mandatory, evidence PASS/N/A is required (FAIL/MISSING → fail).
 */
export function resolveEvidenceGate(evidence, gateId, severity) {
  if (severity === 'na') {
    return { ok: true, status: 'N/A', detail: 'not applicable' }
  }
  const g = evidence.gates[gateId]
  if (!g || !g.present) {
    if (severity === 'mandatory') {
      return {
        ok: false,
        status: 'FAIL',
        detail: `missing evidence/${gateId}.json`
      }
    }
    return {
      ok: true,
      status: 'N/A',
      detail: 'optional; no evidence yet'
    }
  }
  if (g.stale || g.status === 'STALE') {
    const staleDetail = g.detail || evidence.freshness?.[gateId]?.detail || 'STALE evidence'
    return {
      ok: severity !== 'mandatory',
      status: 'FAIL',
      detail: staleDetail
    }
  }
  if (g.status === 'PASS' || g.status === 'N/A') {
    return { ok: true, status: g.status, detail: g.detail || 'evidence ok' }
  }
  return {
    ok: severity !== 'mandatory',
    status: g.status,
    detail: g.detail || 'evidence FAIL'
  }
}

export function evidenceCompleteForStable(evidence, mandatoryGateIds) {
  if (!evidence.exists) return false
  for (const id of mandatoryGateIds) {
    const g = evidence.gates[id]
    if (!g?.present) return false
    if (g.status !== 'PASS' && g.status !== 'N/A') return false
  }
  return true
}
