import type { BaseProps, Severity } from '@amg-webui/types'

export interface ProgressTipProps extends BaseProps {
  message?: string
  percentage?: number
  severity?: Severity
}

export interface ProgressTipEmits {
}
