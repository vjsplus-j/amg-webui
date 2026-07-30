import type { BaseProps } from '@amg-webui/types'
export interface VideoSnapshotProps extends BaseProps {
  videoRef?: HTMLVideoElement | null
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface VideoSnapshotEmits {
  (e: 'capture', dataUrl: string): void
}
