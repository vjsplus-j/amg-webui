import { filterDangerousInput } from './filterInput'
import type { FilterInputOptions } from './types'

/**
 * When to run `filterDangerousInput` on plain text controls.
 * Opt-in field filter (usernames, search terms) — not XSS defense.
 * - `false` / `'off'` / `undefined` (default): no filter
 * - `true` / `'blur'`: filter on blur — avoids mid-tag cursor fights
 * - `'input'`: filter every keystroke (strict)
 */
export type SanitizeInputMode = boolean | 'blur' | 'input' | 'off'

export function resolveSanitizeInputMode(
  mode: SanitizeInputMode | undefined
): 'blur' | 'input' | 'off' {
  if (mode === true || mode === 'blur') return 'blur'
  if (mode === 'input') return 'input'
  return 'off'
}

/** Apply filter when the current event phase matches the configured mode. */
export function applySanitizeInput(
  value: string,
  mode: SanitizeInputMode | undefined,
  phase: 'input' | 'blur',
  options?: FilterInputOptions
): string {
  const resolved = resolveSanitizeInputMode(mode)
  if (resolved === 'off') return value
  if (resolved === 'blur' && phase !== 'blur') return value
  if (resolved === 'input' && phase !== 'input') return value
  return filterDangerousInput(value, options)
}

/** Deep-filter string leaves in a plain object (Form submit boundary). */
export function sanitizeModelStrings<T extends Record<string, unknown>>(
  model: T,
  options?: FilterInputOptions
): T {
  const out: Record<string, unknown> = { ...model }
  for (const [key, value] of Object.entries(model)) {
    if (typeof value === 'string') {
      out[key] = filterDangerousInput(value, options)
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = sanitizeModelStrings(value as Record<string, unknown>, options)
    }
  }
  return out as T
}
