import type { BaseProps } from '@amg-webui/types'

export interface CalendarProps extends BaseProps {
  modelValue?: string | Date | null
  valueFormat?: 'date' | 'iso'
}

export interface CalendarEmits {
  (e: 'update:modelValue', value: string | Date | null): void
  (e: 'select', value: string | Date): void
  (e: 'change', value: string | Date | null): void
}
