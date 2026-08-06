import type { BaseProps } from '@amg-webui/types'

export interface WordCloudProps extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: string | number | null
  disabled?: boolean
  loading?: boolean
  minFontSize?: number
  maxFontSize?: number
  rotate?: boolean
  showValues?: boolean
  selectable?: boolean
  emptyText?: string
}

export interface WordCloudEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: { label: string; value: number; index: number }): void
  (e: 'click', event: MouseEvent): void
}
