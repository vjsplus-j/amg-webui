import { Size, BaseProps, InputEmits } from '@amg-webui/types'

export interface InputTextProps extends BaseProps {
  modelValue?: string
  /** Native input id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  autocomplete?: string
  /** Maps to aria-label on the native input */
  ariaLabel?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  size?: Size
  invalid?: boolean
  fluid?: boolean
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search'
  /**
   * Filter dangerous input via `@amg-webui/security`.
   * Default `true` (= blur). Use `'input'` for strict keystroke filtering, `false` to opt out.
   */
  sanitizeInput?: boolean | 'blur' | 'input' | 'off'
}

export interface InputTextEmits extends InputEmits<string> {
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup', event: KeyboardEvent): void
}
