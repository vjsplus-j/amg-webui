import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface TimePickerProps extends BaseProps, DisabledProps {
  modelValue?: string | Date | null
  placeholder?: string
  showSeconds?: boolean
  valueFormat?: 'time' | 'date'
}

export interface TimePickerEmits {
  (e: 'update:modelValue', value: string | Date | null): void
  (e: 'change', value: string | Date | null): void
}
