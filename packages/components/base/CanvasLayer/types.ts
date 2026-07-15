import type { BaseProps } from '@amg-webui/types'

export interface CanvasLayerProps extends BaseProps {}

export interface CanvasLayerEmits {
  (e: 'select', id: string): void
}
