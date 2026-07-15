import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface DragSelectItem {
  id: string | number
  label: string
  [key: string]: unknown
}

export interface DragSelectProps extends BaseProps, DisabledProps {
  modelValue?: (string | number)[]
  options?: DragSelectItem[]
}

export interface DragSelectEmits {
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'change', value: (string | number)[]): void
  (e: 'reorder', options: DragSelectItem[]): void
}
