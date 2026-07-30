import type { BaseProps } from '@amg-webui/types'

export interface CanvasLayerProps extends BaseProps {
  compact?: boolean
  showActions?: boolean
}

export interface CanvasLayerEmits {
  (e: 'select', id: string): void
  (e: 'reorder', payload: { id: string; direction: 'up' | 'down' | 'top' | 'bottom' }): void
  (e: 'visibility-change', payload: { id: string; hidden: boolean }): void
}
