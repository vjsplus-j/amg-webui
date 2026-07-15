import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface SettingItem {
  key: string
  label: string
  type: 'switch' | 'select' | 'text'
  value?: unknown
  options?: { label: string; value: unknown }[]
}

export interface SettingPanelProps extends BaseProps, DisabledProps {
  modelValue?: Record<string, unknown>
  items?: SettingItem[]
}

export interface SettingPanelEmits {
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'change', value: Record<string, unknown>): void
  (e: 'save', value: Record<string, unknown>): void
}
