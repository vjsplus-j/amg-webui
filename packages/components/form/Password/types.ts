import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface PasswordProps extends BaseProps, DisabledProps {
  modelValue?: string
  id?: string
  name?: string
  autocomplete?: string
  ariaLabel?: string
  showToggle?: boolean
  placeholder?: string
  size?: Size
  fluid?: boolean
  invalid?: boolean
  readonly?: boolean
  maxlength?: number
  /**
   * Opt-in field filter via `@amg-webui/security` (not XSS defense).
   * Default `false`. Use `true` / `'blur'` on blur, `'input'` for keystroke filtering.
   */
  sanitizeInput?: boolean | 'blur' | 'input' | 'off'
}

export interface PasswordEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
  (e: 'change', event: Event): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}
