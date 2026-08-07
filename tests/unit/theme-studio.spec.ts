import { describe, expect, it } from 'vitest'
import {
  createEmptyDraft,
  exportTheme,
  importThemeContent,
  validateThemeDraft,
  verifyExportRoundtrip
} from '@amg-webui/theme/studio'

describe('Theme Studio validation & export roundtrip', () => {
  const draft = {
    ...createEmptyDraft('linear', 'dark'),
    name: 'test-theme',
    tokens: {
      '--ds-accent': '#5e6ad2',
      '--primary-500': '#5e6ad2',
      '--border-radius-md': '6px',
      '--shadow-md': '0 4px 12px rgb(15 23 42 / 0.08)'
    }
  }

  it('validateThemeDraft passes for well-formed draft', () => {
    const result = validateThemeDraft(draft)
    expect(result.valid).toBe(true)
    expect(result.issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('validateThemeDraft fails on invalid color token', () => {
    const bad = {
      ...draft,
      tokens: { ...draft.tokens, '--primary-500': 'not-a-color' }
    }
    const result = validateThemeDraft(bad)
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.code === 'invalid_color')).toBe(true)
  })

  it('JSON export roundtrips token values', () => {
    const exported = exportTheme('json', draft)
    const imported = importThemeContent(exported, 'json')
    expect(imported).not.toBeNull()
    expect(imported!.tokens['--primary-500']).toBe('#5e6ad2')
    const roundtrip = verifyExportRoundtrip(draft, exported, 'json')
    expect(roundtrip.valid).toBe(true)
  })

  it('CSS export roundtrips token values', () => {
    const exported = exportTheme('css', draft)
    const roundtrip = verifyExportRoundtrip(draft, exported, 'css')
    expect(roundtrip.valid).toBe(true)
  })

  it('theme.ts export roundtrips token values', () => {
    const exported = exportTheme('theme-ts', draft)
    const roundtrip = verifyExportRoundtrip(draft, exported, 'theme-ts')
    expect(roundtrip.valid).toBe(true)
  })

  it('SCSS export roundtrips token values', () => {
    const exported = exportTheme('scss', draft)
    const roundtrip = verifyExportRoundtrip(draft, exported, 'scss')
    expect(roundtrip.valid).toBe(true)
  })
})
