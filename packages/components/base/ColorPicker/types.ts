import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface ColorPickerProps extends BaseProps, DisabledProps {
  modelValue?: string
  presets?: string[]
}

export interface ColorPickerEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
