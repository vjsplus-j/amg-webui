import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { LocaleKey } from '@amg-webui/locale'

export interface SettingItem {
  key: string
  label?: string
  /** i18n key — resolved when label is omitted */
  labelKey?: LocaleKey
  type: 'switch' | 'select' | 'text'
  value?: unknown
  options?: { label: string; value: unknown }[]
}

export interface SettingGroup {
  id: string
  title?: string
  titleKey?: LocaleKey
  items: SettingItem[]
}

export interface SettingPanelProps extends BaseProps, DisabledProps {
  modelValue?: Record<string, unknown>
  /** Flat list — used when groups is empty */
  items?: SettingItem[]
  /** Grouped settings rows */
  groups?: SettingGroup[]
  /** Snapshot for reset emit */
  defaultValue?: Record<string, unknown>
}

export interface SettingPanelEmits {
  (e: 'update:modelValue', value: Record<string, unknown>): void
  (e: 'change', value: Record<string, unknown>): void
  (e: 'save', value: Record<string, unknown>): void
  (e: 'reset', value: Record<string, unknown>): void
}
