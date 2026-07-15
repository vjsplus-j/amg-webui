import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface TagInputProps extends BaseProps, DisabledProps {
  modelValue?: string[]
  max?: number
  unique?: boolean
  placeholder?: string
  size?: Size
  fluid?: boolean
}

export interface TagInputEmits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'add', value: string): void
  (e: 'remove', value: string): void
}
