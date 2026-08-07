import type { BaseProps, DisabledProps } from '@amg-webui/types'

/** ISO week value e.g. `2024-W15` */
export type WeekValue = string | null

export interface WeekPickerProps extends BaseProps, DisabledProps {
  modelValue?: WeekValue
  id?: string
  invalid?: boolean
  minYear?: number
  maxYear?: number
}

export interface WeekPickerEmits {
  (e: 'update:modelValue', value: WeekValue): void
  (e: 'change', value: WeekValue): void
  (e: 'blur', event: FocusEvent): void
}
