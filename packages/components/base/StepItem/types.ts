import type { BaseProps } from '@amg-webui/types'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepItemProps extends BaseProps {
  title?: string
  description?: string
  icon?: string
  /** Override computed state */
  status?: StepStatus
  disabled?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface StepItemEmits {
  (e: 'click', index: number, event: MouseEvent): void
}
