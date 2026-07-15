import type { BaseProps } from '@amg-webui/types'

export interface VideoPlayerProps extends BaseProps {
  src?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  disabled?: boolean
}

export interface VideoPlayerEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'timeupdate', currentTime: number): void
  (e: 'volumechange', volume: number): void
  (e: 'fullscreen', active: boolean): void
}
