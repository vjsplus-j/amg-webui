import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasPreviewProps extends BaseProps {
  nodes?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface CanvasPreviewEmits {
  (e: 'select', id: string): void
  (e: 'refresh'): void
}
