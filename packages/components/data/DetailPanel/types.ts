import type { BaseProps, LoadingProps } from '@amg-webui/types'

export interface DetailField {
  key: string
  label: string
  value?: unknown
  span?: number
}

export interface DetailSection {
  id: string
  title: string
  fields?: DetailField[]
  collapsed?: boolean
}

export interface DetailPanelProps extends BaseProps, LoadingProps {
  title?: string
  sections?: DetailSection[]
  activeTab?: string
  /** tabs: section tabs; stack: vertical collapsible sections */
  layout?: 'tabs' | 'stack'
  /** Allow collapsing section bodies in stack layout */
  collapsible?: boolean
  /** Force empty state even when sections exist */
  empty?: boolean
  /** Descriptions column count */
  column?: number
}

export interface DetailPanelEmits {
  (e: 'update:activeTab', value: string): void
  (e: 'toggle-section', id: string, collapsed: boolean): void
}
