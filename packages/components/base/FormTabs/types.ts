import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface FormTabItem {
  name: string | number
  label: string
  disabled?: boolean
}

export interface FormTabsProps extends BaseProps, DisabledProps {
  modelValue?: string | number
  tabs?: FormTabItem[]
  tabData?: Record<string, Record<string, unknown>>
}

export interface FormTabsEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'update:tabData', value: Record<string, Record<string, unknown>>): void
  (e: 'change', name: string | number): void
}
