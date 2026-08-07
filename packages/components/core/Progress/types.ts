import type { BaseProps } from '@amg-webui/types'

export type ProgressType = 'line' | 'circle'
export type ProgressStatus = 'success' | 'warning' | 'danger' | 'normal'

export interface ProgressProps extends BaseProps {
  percentage: number
  type?: ProgressType
  status?: ProgressStatus
  showText?: boolean
  strokeWidth?: number | string
}

export interface ProgressEmits {
  /** Percentage clamped value changed */
  (e: 'change', percentage: number): void
  /** Fires once when percentage reaches 100 */
  (e: 'finish'): void
}
