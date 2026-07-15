import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface ChunkFileItem {
  uid: string
  name: string
  size: number
  progress: number
  status: 'ready' | 'uploading' | 'success' | 'error'
  chunks: number
  uploadedChunks: number
  raw?: File
}

export interface ChunkUploadProps extends BaseProps, DisabledProps {
  modelValue?: ChunkFileItem[]
  chunkSize?: number
  accept?: string
  drag?: boolean
}

export interface ChunkUploadEmits {
  (e: 'update:modelValue', value: ChunkFileItem[]): void
  (e: 'change', value: ChunkFileItem[]): void
  (e: 'upload', file: ChunkFileItem): void
}
