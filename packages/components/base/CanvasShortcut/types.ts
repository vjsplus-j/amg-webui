import type { BaseProps } from '@amg-webui/types'

export interface CanvasShortcutProps extends BaseProps {
  enabled?: boolean
  loading?: boolean
  title?: string
  description?: string
  commands?: Array<{ key: string; label: string; shortcut?: string }>
  showCommands?: boolean
  keyboard?: boolean
  telemetry?: boolean
  trackId?: string
}

export interface CanvasShortcutEmits {
  (e: 'copy'): void
  (e: 'paste'): void
  (e: 'delete'): void
  (e: 'undo'): void
  (e: 'redo'): void
  (e: 'execute', command: string): void
}
