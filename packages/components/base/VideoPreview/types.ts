import type { BaseProps } from '@amg-webui/types'
export interface VideoPreviewProps extends BaseProps {
  src?: string | File | Blob | null
  poster?: string
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  loading?: boolean
  title?: string
}

export interface VideoPreviewEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'error'): void
  (e: 'fullscreen', active: boolean): void
}
