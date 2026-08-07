import { parseCssColor } from '../core/scale'
import { designStyles, isDesignStyleName, isColorScheme } from '../core/registry'
import type { ThemeStudioDraft, ThemeValidationIssue, ThemeValidationResult } from './types'
import { normalizeTokenMap } from './model'

const HEX_OR_RGB = /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|var\(--)/i
const SIZE_VALUE = /^(\d+(\.\d+)?(px|rem|em|%|vh|vw)|0)$/
const SHADOW_VALUE = /^(none|0\s|var\(--|\d)/i

function isValidColor(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v.startsWith('var(')) return true
  if (parseCssColor(v)) return true
  return HEX_OR_RGB.test(v)
}

function isValidSize(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v.startsWith('var(')) return true
  return SIZE_VALUE.test(v)
}

function isValidShadow(value: string): boolean {
  const v = value.trim()
  if (!v) return false
  if (v === 'none') return true
  if (v.startsWith('var(')) return true
  return SHADOW_VALUE.test(v)
}

export function validateThemeDraft(draft: ThemeStudioDraft): ThemeValidationResult {
  const issues: ThemeValidationIssue[] = []

  if (!draft.name.trim()) {
    issues.push({
      code: 'name_required',
      message: 'Theme name is required',
      severity: 'error'
    })
  }

  if (!isDesignStyleName(draft.baseDesign)) {
    issues.push({
      code: 'invalid_design',
      message: `Unknown base design: ${draft.baseDesign}`,
      severity: 'error'
    })
  }

  if (!isColorScheme(draft.scheme)) {
    issues.push({
      code: 'invalid_scheme',
      message: `Unknown color scheme: ${draft.scheme}`,
      severity: 'error'
    })
  }

  const cfg = designStyles.find((s) => s.name === draft.baseDesign)
  if (cfg && !cfg.supportsScheme && draft.scheme === 'light') {
    issues.push({
      code: 'scheme_unsupported',
      message: `${draft.baseDesign} does not support light scheme override`,
      severity: 'warning'
    })
  }

  for (const [key, value] of Object.entries(draft.tokens)) {
    if (!key.startsWith('--')) {
      issues.push({
        code: 'token_key',
        message: `Token keys must start with -- (${key})`,
        token: key,
        severity: 'error'
      })
      continue
    }

    if (!value.trim()) {
      issues.push({
        code: 'token_empty',
        message: `Empty value for ${key}`,
        token: key,
        severity: 'error'
      })
      continue
    }

    if (key.includes('shadow')) {
      if (!isValidShadow(value)) {
        issues.push({
          code: 'invalid_shadow',
          message: `Invalid shadow value for ${key}`,
          token: key,
          severity: 'error'
        })
      }
    } else if (
      key.includes('font-size') ||
      key.includes('radius') ||
      key.includes('spacing') ||
      key.includes('height')
    ) {
      if (!isValidSize(value)) {
        issues.push({
          code: 'invalid_size',
          message: `Invalid size value for ${key}`,
          token: key,
          severity: 'warning'
        })
      }
    } else if (
      key.includes('color') ||
      key.includes('primary') ||
      key.includes('success') ||
      key.includes('warning') ||
      key.includes('danger') ||
      key.includes('info') ||
      key.startsWith('--ds-')
    ) {
      if (!isValidColor(value)) {
        issues.push({
          code: 'invalid_color',
          message: `Invalid color value for ${key}`,
          token: key,
          severity: 'error'
        })
      }
    }
  }

  if (Object.keys(draft.tokens).length === 0) {
    issues.push({
      code: 'no_tokens',
      message: 'No custom tokens defined — export will be empty',
      severity: 'warning'
    })
  }

  return {
    valid: !issues.some((i) => i.severity === 'error'),
    issues
  }
}

export interface ThemeImportPayload {
  name?: string
  baseDesign?: string
  scheme?: string
  tokens?: Record<string, string>
}

export function parseImportPayload(raw: unknown): ThemeImportPayload | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as ThemeImportPayload
  if (!obj.tokens || typeof obj.tokens !== 'object') return null
  return obj
}

export function draftFromImportPayload(payload: ThemeImportPayload): ThemeStudioDraft | null {
  const baseDesign = payload.baseDesign
  const scheme = payload.scheme
  if (!isDesignStyleName(baseDesign) || !isColorScheme(scheme)) return null

  return {
    name: String(payload.name || 'imported-theme').trim() || 'imported-theme',
    baseDesign,
    scheme,
    tokens: normalizeTokenMap(payload.tokens ?? {})
  }
}

/** Roundtrip: export → parse → compare token keys/values. */
export function verifyExportRoundtrip(
  draft: ThemeStudioDraft,
  exported: string,
  format: 'json' | 'css' | 'theme-ts' | 'scss'
): ThemeValidationResult {
  const issues: ThemeValidationIssue[] = []

  try {
    let parsed: ThemeStudioDraft | null = null

    if (format === 'json') {
      const payload = parseImportPayload(JSON.parse(exported))
      parsed = payload ? draftFromImportPayload(payload) : null
    } else if (format === 'theme-ts') {
      const match = exported.match(/tokens:\s*\{([^}]+)\}/s)
      if (match) {
        const tokens: Record<string, string> = {}
        const pairs = exported.matchAll(/['"](--[^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)
        for (const m of pairs) tokens[m[1]] = m[2]
        parsed = {
          name: draft.name,
          baseDesign: draft.baseDesign,
          scheme: draft.scheme,
          tokens: normalizeTokenMap(tokens)
        }
      }
    } else {
      const tokens: Record<string, string> = {}
      const decls = exported.matchAll(/(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g)
      for (const m of decls) tokens[m[1].trim()] = m[2].trim()
      parsed = {
        name: draft.name,
        baseDesign: draft.baseDesign,
        scheme: draft.scheme,
        tokens: normalizeTokenMap(tokens)
      }
    }

    if (!parsed) {
      issues.push({
        code: 'roundtrip_parse',
        message: `Failed to parse ${format} export`,
        severity: 'error'
      })
      return { valid: false, issues }
    }

    for (const [key, value] of Object.entries(draft.tokens)) {
      if (parsed.tokens[key] !== value) {
        issues.push({
          code: 'roundtrip_mismatch',
          message: `Roundtrip mismatch for ${key}`,
          token: key,
          severity: 'error'
        })
      }
    }
  } catch {
    issues.push({
      code: 'roundtrip_error',
      message: 'Export roundtrip threw during parse',
      severity: 'error'
    })
  }

  return {
    valid: issues.length === 0,
    issues
  }
}
