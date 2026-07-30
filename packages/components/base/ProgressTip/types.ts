import type { BaseProps, Severity } from '@amg-webui/types'

export type ProgressTipSize = 'sm' | 'md' | 'lg'

export interface ProgressTipProps extends BaseProps {
  message?: string
  percentage?: number
  severity?: Severity
  size?: ProgressTipSize
  showText?: boolean
  striped?: boolean
}

export interface ProgressTipEmits {
  (e: 'complete'): void
}
