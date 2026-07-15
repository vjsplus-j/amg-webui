import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface TransferItem {
  key: string | number
  label: string
  disabled?: boolean
}

export interface TransferProps extends BaseProps, DisabledProps {
  data?: TransferItem[]
  modelValue?: (string | number)[]
  filterable?: boolean
}

export interface TransferEmits {
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'change', value: (string | number)[]): void
}
