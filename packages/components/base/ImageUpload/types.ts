import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface ImageFileItem {
  uid: string
  name: string
  url: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  raw?: File
}

export interface ImageUploadProps extends BaseProps, DisabledProps {
  modelValue?: ImageFileItem[]
  multiple?: boolean
  maxCount?: number
  accept?: string
}

export interface ImageUploadEmits {
  (e: 'update:modelValue', value: ImageFileItem[]): void
  (e: 'change', value: ImageFileItem[]): void
}
