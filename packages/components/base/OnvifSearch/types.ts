import type { BaseProps } from '@amg-webui/types'

export interface OnvifDevice {
  id: string
  name: string
  ip: string
  port: number
  online: boolean
}

export interface OnvifSearchProps extends BaseProps {
  devices?: OnvifDevice[]
  filter?: string
  loading?: boolean
  disabled?: boolean
  /** Max rows before virtual hint (display only) */
  pageSize?: number
  emptyText?: string
}

export interface OnvifSearchEmits {
  (e: 'update:filter', v: string): void
  (e: 'discover'): void
  (e: 'select', device: OnvifDevice): void
}
