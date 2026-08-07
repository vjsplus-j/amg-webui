import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export interface ColorPickerProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: string
  presets?: string[]
  /** When true, skip FormItem inject (composite parents own the hook). */
  skipFormItem?: boolean
}

export interface ColorPickerEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
