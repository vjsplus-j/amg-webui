import { Size, BaseProps, InputEmits } from '@amg-webui/types'

export interface TextareaProps extends BaseProps {
  modelValue?: string
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
}

export interface TextareaEmits extends InputEmits<string> {
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup', event: KeyboardEvent): void
}