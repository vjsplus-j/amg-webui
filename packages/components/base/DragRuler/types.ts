import type { BaseProps } from '@amg-webui/types'

export interface DragRulerProps extends BaseProps {
  scale?: number
  showGuides?: boolean
}

export interface DragRulerEmits {
  (e: 'click', event: MouseEvent): void
}
