import type { BaseProps, DisabledProps, InvalidProps } from '@amg-webui/types'

export type SliderValue = number | [number, number]

export interface SliderProps extends BaseProps, DisabledProps, InvalidProps {
  /** Native id — falls back to FormItem field id when nested */
  id?: string
  /** Native name — falls back to FormItem `prop` when nested */
  name?: string
  modelValue?: SliderValue
  min?: number
  max?: number
  step?: number
  range?: boolean
  showTooltip?: boolean
  ariaLabel?: string
}

export interface SliderEmits {
  (e: 'update:modelValue', value: SliderValue): void
  (e: 'change', value: SliderValue): void
}
