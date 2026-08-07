import { describe, expect, it } from 'vitest'
import {
  checkSlots,
  extractImplementedSlots
} from '../../../scripts/hardening/gate-checks.mjs'
import {
  validateA11yEvidence,
  validateKeyboardEvidence
} from '../../../scripts/hardening/evidence.mjs'

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

  it('accepts keyboard matrix with real keys', () => {
    const v = validateKeyboardEvidence({
      status: 'PASS',
      keys: ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', 'Escape'],
      detail: 'row navigation + selection'
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
})
