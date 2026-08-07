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
import { join } from 'node:path'

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

/** Phrases that indicate fake / mount-only keyboard evidence */
const KEYBOARD_SHALLOW_RE =
  /\b(mounted|visible|present|exists|render(ed)?|smoke)\b/i

const KEYBOARD_KEY_RE =
  /\b(Tab|Shift\+Tab|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter|Space|Escape|Backspace|Delete|typeahead|focus(?:Trap|Restore)?|IME|composition)\b/i

export function evidenceDir(hardeningRoot, name) {
  return join(hardeningRoot, 'evidence', name)
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

  const keys = []
  if (Array.isArray(data.keys)) keys.push(...data.keys)
  if (Array.isArray(data.matrix)) {
    for (const row of data.matrix) {
      if (typeof row === 'string') keys.push(row)
      else if (row?.key) keys.push(row.key)
      else if (row?.keys) keys.push(...row.keys)
    }
  }
  if (Array.isArray(data.actions)) {
    for (const a of data.actions) {
      if (typeof a === 'string') keys.push(a)
      else if (a?.key) keys.push(a.key)
    }
  }

  const detail = String(data.detail || data.summary || '')
  const detailKeys = detail.match(
    /Tab|Shift\+Tab|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter|Space|Escape|Backspace|Delete|typeahead|focus(?:Trap|Restore)?|IME|composition/gi
  )
  if (detailKeys) keys.push(...detailKeys)

  const unique = [...new Set(keys.map((k) => String(k)))]
  const realKeys = unique.filter((k) => KEYBOARD_KEY_RE.test(k))

  if (realKeys.length >= 2) {
    return {
      ok: true,
      detail: data.detail || `keyboard matrix: [${realKeys.slice(0, 12).join(', ')}]`
    }
  }

  // Shallow mount-only PASS is invalid
  if (KEYBOARD_SHALLOW_RE.test(detail) && realKeys.length < 2) {
    return {
      ok: false,
      detail: `invalid keyboard evidence (mount/visibility only): "${detail.slice(0, 120)}"`
    }
  }

  if (realKeys.length === 0) {
    return {
      ok: false,
      detail:
        'keyboard PASS requires keys[]/matrix/actions or detail listing real keys (Tab/Arrow*/Enter/Escape/…)'
    }
  }

  return {
    ok: false,
    detail: `keyboard matrix too thin (${realKeys.length} key); need ≥2 real keys`
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

export function loadEvidenceManifest(hardeningRoot, name) {
  const dir = evidenceDir(hardeningRoot, name)
  const manifestPath = join(dir, 'manifest.json')
  if (!existsSync(manifestPath)) {
    return { exists: false, dir, gates: {}, manifest: null }
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
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
        data
      }
    } catch (e) {
      gates[id] = {
        present: true,
        status: 'FAIL',
        detail: `invalid JSON: ${e.message}`
      }
    }
  }
  return { exists: true, dir, gates, manifest }
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
