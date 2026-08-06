import { Size, BaseProps, InputEmits } from '@amg-webui/types'

export interface TextareaProps extends BaseProps {
  modelValue?: string
  id?: string
  name?: string
  autocomplete?: string
  ariaLabel?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  rows?: number
  cols?: number
  size?: Size
  invalid?: boolean
  fluid?: boolean
  autoResize?: boolean
  showCounter?: boolean
  /**
   * Filter dangerous input via `@amg-webui/security`.
   * Default `true` (= blur). Use `'input'` for strict keystroke filtering, `false` to opt out.
   */
  sanitizeInput?: boolean | 'blur' | 'input' | 'off'
}

export interface TextareaEmits extends InputEmits<string> {
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup', event: KeyboardEvent): void
}
