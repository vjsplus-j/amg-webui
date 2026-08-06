import type { BaseProps, DisabledProps, InvalidProps, Size } from '@amg-webui/types'

export interface TimeSelectProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
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
