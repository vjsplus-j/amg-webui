import type { BaseProps, Severity } from '@amg-webui/types'

export interface NoticeBarProps extends BaseProps {
  message?: string
  severity?: Severity
  closable?: boolean
  scrollable?: boolean
  /** Marquee duration in seconds when scrollable */
  speed?: number
  /** Pause marquee on hover */
  pauseOnHover?: boolean
}

export interface NoticeBarEmits {
  (e: 'close'): void
  (e: 'click', event: MouseEvent): void
}
