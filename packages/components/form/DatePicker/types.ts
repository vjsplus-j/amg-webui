import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export interface DatePickerProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: string | Date | null
  placeholder?: string
  valueFormat?: 'date' | 'iso'
}

export interface DatePickerEmits {
  (e: 'update:modelValue', value: string | Date | null): void
  (e: 'change', value: string | Date | null): void
}

export interface DatePickerSlots {
  /** Trailing auxiliary content beside the control */
  default?(props: Record<string, never>): unknown
}

export interface DatePickerExpose {
  /** Focus the trigger button */
  focus: () => void
  /** Blur the trigger button */
  blur: () => void
  /** Open the calendar panel */
  open: () => void
  /** Close the calendar panel */
  close: () => void
}

export type DatePickerInstance = DatePickerExpose
