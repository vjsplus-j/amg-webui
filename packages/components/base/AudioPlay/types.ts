import type { BaseProps } from '@amg-webui/types'

export interface AudioPlayProps extends BaseProps {
  src?: string | File | Blob | null
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface AudioPlayEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'clear'): void
}
