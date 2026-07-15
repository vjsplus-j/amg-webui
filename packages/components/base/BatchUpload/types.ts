import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface BatchFileItem {
  uid: string
  name: string
  size: number
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  raw?: File
}

export interface BatchUploadProps extends BaseProps, DisabledProps {
  modelValue?: BatchFileItem[]
  concurrent?: number
  accept?: string
  drag?: boolean
}

export interface BatchUploadEmits {
  (e: 'update:modelValue', value: BatchFileItem[]): void
  (e: 'change', value: BatchFileItem[]): void
}
