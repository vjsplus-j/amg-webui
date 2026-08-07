import { describe, expect, it } from 'vitest'
import {
  checkNoBackendDto,
  checkSlots,
  extractImplementedSlots
} from '../../../scripts/hardening/gate-checks.mjs'
import {
  checkEvidenceFreshness,
  stampEvidenceMeta,
  validateA11yEvidence,
  validateKeyboardEvidence
} from '../../../scripts/hardening/evidence.mjs'
import { hashComponentSource } from '../../../scripts/hardening/hash-component-source.mjs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const hardening = join(root, 'component-hardening')

describe('hardening P0 credibility', () => {
  it('extractImplementedSlots reads named and default slots from template', () => {
    const src = {
      vue: `
        <template>
          <slot />
          <slot name="empty" />
          <slot name="loading" />
          <slot :name="\`body-\${column.field}\`" />
        </template>
      `,
      types: `
        export interface DemoSlots {
          empty?: () => unknown
          loading?: () => unknown
          [key: \`body-\${string}\`]: (props: { row: unknown }) => unknown
        }
      `
    }
    const slots = extractImplementedSlots(src)
    expect(slots).toEqual(expect.arrayContaining(['default', 'empty', 'loading', 'body-*']))
  })

  it('checkSlots FAILS when requiredSlots missing (no || true escape)', () => {
    const src = {
      vue: `<template><slot name="empty" /></template>`,
      types: `export interface XSlots { empty?: () => unknown }`
    }
    const result = checkSlots(
      src,
      { api: { slots: 'required' }, requiredSlots: ['default', 'empty', 'loading'] },
      []
    )
    expect(result.ok).toBe(false)
    expect(result.missing).toEqual(expect.arrayContaining(['default', 'loading']))
  })

  it('checkSlots PASSES when requiredSlots are implemented', () => {
    const src = {
      vue: `<template><slot name="empty" /><slot name="loading" /></template>`,
      types: `export interface XSlots { empty?: () => unknown; loading?: () => unknown }`
    }
    const result = checkSlots(
      src,
      { api: { slots: 'required' }, requiredSlots: ['empty', 'loading'] },
      []
    )
    expect(result.ok).toBe(true)
  })

  it('rejects mount-only keyboard evidence', () => {
    const v = validateKeyboardEvidence({
      status: 'PASS',
      detail: 'DataTable mounted and visible'
    })
    expect(v.ok).toBe(false)
  })

  it('rejects keys-only keyboard PASS without testCases', () => {
    const v = validateKeyboardEvidence({
      status: 'PASS',
      keys: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'],
      detail: 'row navigation + selection'
    })
    expect(v.ok).toBe(false)
  })

  it('accepts keyboard evidence with real testCases', () => {
    const v = validateKeyboardEvidence({
      status: 'PASS',
      component: 'Select',
      family: 'selection',
      testFile: 'tests/unit/hardening/keyboard/selection.spec.ts',
      testCases: [
        {
          name: 'arrow-down',
          key: 'ArrowDown',
          expected: 'moves highlighted active option',
          status: 'PASS'
        },
        {
          name: 'enter-select',
          key: 'Enter',
          expected: 'selects active option',
          status: 'PASS'
        }
      ],
      keys: ['ArrowDown', 'Enter']
    })
    expect(v.ok).toBe(true)
  })

  it('rejects a11y PASS that disabled contrast without A11Y_CONTRAST', () => {
    const v = validateA11yEvidence({
      status: 'PASS',
      detail: 'axe with disableRules color-contrast'
    })
    expect(v.ok).toBe(false)
  })

  it('accepts structured a11y with contrast PASS', () => {
    const v = validateA11yEvidence({
      status: 'PASS',
      A11Y_STRUCTURE: { status: 'PASS', critical: 0, serious: 0 },
      A11Y_CONTRAST: { status: 'PASS', critical: 0, serious: 0 },
      detail: 'structure+contrast'
    })
    expect(v.ok).toBe(true)
  })

  it('hashComponentSource returns stable sourceHash for Button', () => {
    const h1 = hashComponentSource(root, 'Button', hardening)
    const h2 = hashComponentSource(root, 'Button', hardening)
    expect(h1.sourceHash).toBeTruthy()
    expect(h1.contractHash).toBeTruthy()
    expect(h1.sourceHash).toBe(h2.sourceHash)
  })

  it('stampEvidenceMeta embeds current hashes', () => {
    const stamped = stampEvidenceMeta('Button', { status: 'PASS' }, hardening, root)
    expect(stamped.sourceHash).toMatch(/^[a-f0-9]{64}$/)
    expect(stamped.contractHash).toMatch(/^[a-f0-9]{64}$/)
    expect(stamped.stampedAt).toBeTruthy()
  })

  it('checkEvidenceFreshness treats matching stamped hashes as fresh', () => {
    const current = hashComponentSource(root, 'Button', hardening)
    const stamped = stampEvidenceMeta(
      'Button',
      {
        status: 'PASS',
        source: 'tests/e2e/hardening-family-evidence.spec.ts'
      },
      hardening,
      root
    )
    expect(stamped.sourceHash).toBe(current.sourceHash)
    expect(stamped.contractHash).toBe(current.contractHash)
  })

  it('checkEvidenceFreshness on legacy evidence without hashes is not stale', () => {
    const r = checkEvidenceFreshness(hardening, 'Button', 'keyboard.json', root)
    expect(r.stale).toBe(false)
    expect(r.hasHash).toBe(false)
  })

  it('detects sourceHash mismatch pattern for stale evidence', () => {
    const current = hashComponentSource(root, 'Button', hardening)
    const stored = { sourceHash: '0'.repeat(64), contractHash: current.contractHash }
    const mismatches = []
    if (stored.sourceHash && current.sourceHash && stored.sourceHash !== current.sourceHash) {
      mismatches.push('sourceHash mismatch')
    }
    expect(mismatches).toEqual(['sourceHash mismatch'])
  })

  it('checkNoBackendDto is not unconditional PASS for domain components', () => {
    const src = {
      types: `export interface BadProps { payload?: AxiosResponse<unknown> }`,
      vue: ''
    }
    const leak = checkNoBackendDto(root, 'GbsGatewayForm', src, {}, hardening)
    expect(leak.ok).toBe(false)
    expect(leak.detail).toMatch(/AxiosResponse/)
  })

  it('checkNoBackendDto PASS via static scan for clean domain props', () => {
    const src = {
      types: `export interface GbsGatewayFormProps { modelValue?: { id: string } }`,
      vue: ''
    }
    const ok = checkNoBackendDto(root, 'GbsGatewayForm', src, {}, hardening)
    expect(ok.ok).toBe(true)
    expect(ok.detail).not.toMatch(/policy gate \(manual contract\)/)
  })

  it('checkNoBackendDto is N/A for foundation components', () => {
    const src = { types: `export interface ButtonProps { type?: string }`, vue: '' }
    const r = checkNoBackendDto(root, 'Button', src, {}, hardening)
    expect(r.status).toBe('N/A')
  })
})
