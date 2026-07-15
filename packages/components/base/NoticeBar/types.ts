import type { BaseProps, Severity } from '@amg-webui/types'

export interface NoticeBarProps extends BaseProps {
  message?: string
  severity?: Severity
  closable?: boolean
  scrollable?: boolean
}

export interface NoticeBarEmits {
  (e: 'close'): void
}
