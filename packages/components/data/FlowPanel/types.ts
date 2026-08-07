import type { BaseProps } from '@amg-webui/types'

export interface FlowStep {
  id: string
  title: string
  status: 'pending' | 'active' | 'done' | 'error'
  time?: string
  description?: string
}

export interface FlowPanelProps extends BaseProps {
  steps?: FlowStep[]
  current?: string
  /** Show wizard prev/next controls */
  showNav?: boolean
  /** Disable next when current step has error status */
  blockOnError?: boolean
}

export interface FlowPanelEmits {
  (e: 'select', step: FlowStep): void
  (e: 'prev', step: FlowStep | null): void
  (e: 'next', step: FlowStep | null): void
  (e: 'update:current', id: string): void
}
