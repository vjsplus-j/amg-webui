import type { BaseProps } from '@amg-webui/types'

export type TourPlacement = 'top' | 'bottom' | 'left' | 'right'
export type TourType = 'default' | 'primary'

export interface TourStep {
  target: string
  title?: string
  description?: string
  placement?: TourPlacement
}

export interface TourProps extends BaseProps {
  modelValue?: number
  current?: number
  steps: TourStep[]
  open?: boolean
  mask?: boolean
  type?: TourType
}

export interface TourEmits {
  (e: 'update:open', value: boolean): void
  (e: 'update:current', index: number): void
  (e: 'update:modelValue', index: number): void
  (e: 'change', step: number): void
  (e: 'finish'): void
  (e: 'close'): void
  (e: 'skip'): void
}
