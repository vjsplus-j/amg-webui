import type { BaseProps } from '@amg-webui/types'

export interface DragRulerProps extends BaseProps {
  scale?: number
  showGuides?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragRulerEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'toggle-guides', value: boolean): void
}
