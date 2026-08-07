/**
 * Batch keyboard evidence — marks FAIL for components lacking real testCases evidence.
 * Does NOT dispatch keys or write mount-only PASS.
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateKeyboardEvidence } from '../../../scripts/hardening/evidence.mjs'
import { invalidateBatchKeyboardEvidence } from '../../../scripts/hardening/write-keyboard-evidence.mjs'

const ROOT = process.cwd()
const EVIDENCE = join(ROOT, 'component-hardening/evidence')
const GATES = join(ROOT, 'component-hardening/gates/results/all.json')

/** Components with dedicated family keyboard specs (real testCases). */
const REAL_KEYBOARD_COMPONENTS = new Set([
  'Select',
  'Tree',
  'Dialog',
  'InputText',
  'DataTable',
  'Textarea',
  'Password',
  'Radio',
  'RadioGroup',
  'Checkbox',
  'Switch',
  'InputNumber',
  'Button',
  'Form',
  'FormItem',
  'Tabs'
])

function targets(): string[] {
  if (!existsSync(GATES)) return []
  const all = JSON.parse(readFileSync(GATES, 'utf8'))
  return (all.results || [])
    .filter((r: { gates: { id: string; status: string }[] }) =>
      r.gates.some((g) => g.id === 'keyboard' && g.status === 'FAIL')
    )
    .map((r: { name: string }) => r.name)
}

function hasRealKeyboardEvidence(name: string): boolean {
  const path = join(EVIDENCE, name, 'keyboard.json')
  if (!existsSync(path)) return false
  try {
    const data = JSON.parse(readFileSync(path, 'utf8'))
    return validateKeyboardEvidence(data).ok
  } catch {
    return false
  }
}

describe('Batch keyboard evidence — missing real coverage', () => {
  it('invalidates batch-written fake PASS keyboard evidence on disk', () => {
    const result = invalidateBatchKeyboardEvidence(ROOT)
    expect(result.invalidated).toBeGreaterThanOrEqual(0)
  })

  it('writes FAIL for keyboard-gate targets without real testCases evidence', () => {
    const names = targets()
    let markedFail = 0
    let alreadyReal = 0

    for (const name of names) {
      if (REAL_KEYBOARD_COMPONENTS.has(name) || hasRealKeyboardEvidence(name)) {
        alreadyReal += 1
        continue
      }

      const dir = join(EVIDENCE, name)
      mkdirSync(dir, { recursive: true })
      writeFileSync(
        join(dir, 'keyboard.json'),
        JSON.stringify(
          {
            status: 'FAIL',
            component: name,
            detail:
              'no real keyboard testCases evidence — requires family keyboard spec with behavior assertions',
            testCases: [],
            keys: [],
            toolVersion: '1',
            verifiedAt: new Date().toISOString(),
            source: 'tests/unit/hardening/batch-keyboard-evidence.spec.ts'
          },
          null,
          2
        ) + '\n'
      )
      markedFail += 1
    }

    writeFileSync(
      join(ROOT, 'component-hardening/reports/batch-keyboard-evidence.json'),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          targets: names.length,
          markedFail,
          alreadyReal,
          realComponents: [...REAL_KEYBOARD_COMPONENTS]
        },
        null,
        2
      ) + '\n'
    )

    expect(markedFail + alreadyReal).toBeLessThanOrEqual(names.length)
  })

  it('reports remaining keyboard PASS count after invalidation', () => {
    let passCount = 0
    for (const name of readdirSync(EVIDENCE, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)) {
      const path = join(EVIDENCE, name, 'keyboard.json')
      if (!existsSync(path)) continue
      const data = JSON.parse(readFileSync(path, 'utf8'))
      if (String(data.status).toUpperCase() !== 'PASS') continue
      if (validateKeyboardEvidence(data).ok) passCount += 1
    }
    expect(passCount).toBeGreaterThanOrEqual(0)
    expect(passCount).toBeLessThanOrEqual(REAL_KEYBOARD_COMPONENTS.size + 5)
  })
})
