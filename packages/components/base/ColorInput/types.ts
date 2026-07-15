import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface ColorInputProps extends BaseProps, DisabledProps {
  modelValue?: string
}

export interface ColorInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
