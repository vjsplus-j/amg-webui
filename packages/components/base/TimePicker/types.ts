import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export interface TimePickerProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: string | Date | null
  placeholder?: string
  showSeconds?: boolean
  valueFormat?: 'time' | 'date'
  minuteStep?: number
  secondStep?: number
  clearable?: boolean
  readonly?: boolean
  ariaLabel?: string
}

export interface TimePickerEmits {
  (e: 'update:modelValue', value: string | Date | null): void
  (e: 'change', value: string | Date | null): void
  (e: 'clear'): void
  (e: 'open-change', open: boolean): void
}
