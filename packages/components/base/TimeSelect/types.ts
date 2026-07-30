import type { BaseProps, DisabledProps, Size } from '@amg-webui/types'

export interface TimeSelectProps extends BaseProps, DisabledProps {
  modelValue?: string | null
  start?: string
  end?: string
  step?: string
  placeholder?: string
  clearable?: boolean
  size?: Size
}

export interface TimeSelectEmits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
  (e: 'clear'): void
}
