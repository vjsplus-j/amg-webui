import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface RichTextProps extends BaseProps, DisabledProps {
  modelValue?: string
  placeholder?: string
}

export interface RichTextEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
