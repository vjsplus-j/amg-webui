import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface ColorInputProps extends BaseProps, DisabledProps {
  modelValue?: string
  size?: Size
  placeholder?: string
}

export interface ColorInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
