import type { BaseProps } from '@amg-webui/types'

export interface ImageCropProps extends BaseProps {
  src?: string | File | Blob | null
  aspectRatio?: number
  disabled?: boolean
}

export interface ImageCropEmits {
  (e: 'crop', blob: Blob): void
  (e: 'error', error: Error): void
}
