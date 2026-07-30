import type { BaseProps } from '@amg-webui/types'
export interface VcrTimelinePlayerProps extends BaseProps {
  currentTime?: number
  duration?: number
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface VcrTimelinePlayerEmits {
  (e: 'update:currentTime', v: number): void
  (e: 'seek', v: number): void
}
