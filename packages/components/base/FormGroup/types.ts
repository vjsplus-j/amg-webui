import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface FormGroupProps extends BaseProps, DisabledProps {
  title?: string
  collapsible?: boolean
  collapsed?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface FormGroupEmits {
  (e: 'update:collapsed', value: boolean): void
  (e: 'toggle', collapsed: boolean): void
}
