import { Severity, BaseProps } from '@amg-webui/types'

export interface MessageProps extends BaseProps {
  severity?: Severity
  text?: string
  showIcon?: boolean
  closable?: boolean
  autoHide?: boolean
  hideDelay?: number
}

export interface MessageEmits {
  (e: 'close'): void
}