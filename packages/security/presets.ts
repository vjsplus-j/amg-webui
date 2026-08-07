import type { SanitizeInputMode } from './sanitizeInput'

/**
 * Opt-in secure defaults for plain text controls (`InputText` / `Textarea` / `Password`).
 * Filters dangerous fragments on blur — does not replace CSP or output-side sanitization.
 */
export const SECURE_INPUT_PRESET = {
  sanitizeInput: 'blur' as SanitizeInputMode
} as const

/**
 * Opt-in Form submit boundary — deep-filters string leaves via `sanitizeModelStrings`.
 * Pair with field-level `SECURE_INPUT_PRESET` when inputs are user-editable.
 */
export const SECURE_FORM_PRESET = {
  sanitizeOnSubmit: true
} as const

/** Combined preset for registration / admin forms (submit + blur-phase inputs). */
export const SECURE_FORM_KIT = {
  ...SECURE_FORM_PRESET,
  ...SECURE_INPUT_PRESET
} as const
