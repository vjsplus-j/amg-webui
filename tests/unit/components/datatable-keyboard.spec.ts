/**
 * DataTable keyboard tests — canonical implementation:
 * `tests/unit/hardening/keyboard/table.spec.ts`
 *
 * This shim avoids duplicate vitest registration when both paths are discovered.
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { validateKeyboardEvidence } from '../../../scripts/hardening/evidence.mjs'

describe('DataTable keyboard (shim → hardening/keyboard/table.spec.ts)', () => {
  it('points consumers at the canonical table family keyboard spec', () => {
    expect(existsSync(join(process.cwd(), 'tests/unit/hardening/keyboard/table.spec.ts'))).toBe(
      true
    )
  })

  it('on-disk DataTable keyboard evidence is written by table family spec', () => {
    const path = join(process.cwd(), 'component-hardening/evidence/DataTable/keyboard.json')
    expect(existsSync(path)).toBe(true)
    const data = JSON.parse(readFileSync(path, 'utf8'))
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.testFile).toBe('tests/unit/hardening/keyboard/table.spec.ts')
  })
})
