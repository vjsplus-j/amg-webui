import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface UploadFile {
  uid: string
  name: string
  size: number
  status: 'ready' | 'uploading' | 'success' | 'error'
  raw?: File
}

export interface UploadProps extends BaseProps, DisabledProps {
  modelValue?: UploadFile[]
  id?: string
  invalid?: boolean
  multiple?: boolean
  accept?: string
  drag?: boolean
  beforeUpload?: (file: File) => boolean | void | Promise<boolean | void>
}

export interface UploadEmits {
  (e: 'update:modelValue', value: UploadFile[]): void
  (e: 'beforeUpload', file: File): void
  (e: 'change', files: UploadFile[]): void
  (e: 'remove', file: UploadFile): void
}
