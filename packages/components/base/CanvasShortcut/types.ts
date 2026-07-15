import type { BaseProps } from '@amg-webui/types'

export interface CanvasShortcutProps extends BaseProps {
  enabled?: boolean
}

export interface CanvasShortcutEmits {
  (e: 'copy'): void
  (e: 'paste'): void
  (e: 'delete'): void
  (e: 'undo'): void
  (e: 'redo'): void
}
