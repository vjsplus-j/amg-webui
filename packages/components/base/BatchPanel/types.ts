import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface BatchPanelProps extends BaseProps, DisabledProps {
  selectedCount?: number
  totalCount?: number
}

export interface BatchPanelEmits {
  (e: 'action', action: 'edit' | 'delete' | 'export'): void
  (e: 'clear'): void
}
