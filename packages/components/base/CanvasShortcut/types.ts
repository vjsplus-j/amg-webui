import type { BaseProps } from '@amg-webui/types'

export interface CanvasShortcutProps extends BaseProps {
  enabled?: boolean
  loading?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface CanvasShortcutEmits {
  (e: 'copy'): void
  (e: 'paste'): void
  (e: 'delete'): void
  (e: 'undo'): void
  (e: 'redo'): void
}
