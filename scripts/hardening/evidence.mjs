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

export function evidenceDir(hardeningRoot, name) {
  return join(hardeningRoot, 'evidence', name)
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
      const status = String(data.status || '').toUpperCase()
      gates[id] = {
        present: true,
        status: ['PASS', 'FAIL', 'N/A'].includes(status) ? status : 'FAIL',
        detail: data.detail || data.summary || '',
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
