import type { BaseProps } from '@amg-webui/types'

export interface PropField {
  key: string
  label?: string
  type?: 'text' | 'number' | 'boolean'
}

export interface PropPanelProps extends BaseProps {
  fields?: PropField[]
  readonly?: boolean
}

export interface PropPanelEmits {
  (e: 'update:prop', payload: { key: string; value: unknown }): void
}
