import type { BaseProps } from '@amg-webui/types'

export interface TemplateDragItem {
  id: string
  name: string
}

export interface TemplateDragProps extends BaseProps {
  templates?: TemplateDragItem[]
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface TemplateDragEmits {
  (e: 'apply', tpl: TemplateDragItem): void
  (e: 'refresh'): void
}
