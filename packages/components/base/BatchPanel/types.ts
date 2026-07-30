import type { BaseProps, DisabledProps, Severity, Variant } from '@amg-webui/types'

export interface BatchPanelAction {
  key: string
  label?: string
  variant?: Variant
  severity?: Severity
  primary?: boolean
}

export interface BatchPanelProps extends BaseProps, DisabledProps {
  selectedCount?: number
  totalCount?: number
  /** When true, show empty hint instead of hiding the panel */
  showEmpty?: boolean
  /** Custom action buttons; falls back to built-in edit/delete/export/clear */
  actions?: BatchPanelAction[]
}

export interface BatchPanelEmits {
  (e: 'action', action: string): void
  (e: 'clear'): void
}
