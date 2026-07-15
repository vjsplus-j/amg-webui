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
}

export interface FlowPanelEmits {
  (e: 'select', step: FlowStep): void
}
