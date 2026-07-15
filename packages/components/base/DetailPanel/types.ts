import type { BaseProps } from '@amg-webui/types'

export interface DetailField {
  key: string
  label: string
  value?: unknown
}

export interface DetailSection {
  id: string
  title: string
  fields?: DetailField[]
  collapsed?: boolean
}

export interface DetailPanelProps extends BaseProps {
  sections?: DetailSection[]
  activeTab?: string
}

export interface DetailPanelEmits {
  (e: 'update:activeTab', value: string): void
  (e: 'toggle-section', id: string, collapsed: boolean): void
}
