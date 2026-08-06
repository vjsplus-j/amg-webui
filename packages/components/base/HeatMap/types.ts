import type { BaseProps } from '@amg-webui/types'

export interface HeatMapProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: number | string | null
  disabled?: boolean
  loading?: boolean
  rows?: number
  cols?: number
  min?: number
  max?: number
  showValues?: boolean
  selectable?: boolean
  emptyText?: string
}

export interface HeatMapEmits {
  (e: 'update:modelValue', value: number | string): void
  (e: 'change', value: { x: number; y: number; value: number; index: number }): void
  (e: 'click', event: MouseEvent): void
}
