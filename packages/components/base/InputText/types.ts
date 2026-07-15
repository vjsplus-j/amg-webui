import { Size, BaseProps, InputEmits } from '@amg-webui/types'

export interface InputTextProps extends BaseProps {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  size?: Size
  invalid?: boolean
  fluid?: boolean
  type?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search'
}

export interface InputTextEmits extends InputEmits<string> {
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup', event: KeyboardEvent): void
}