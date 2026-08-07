import type { BaseProps, DisabledProps } from '@amg-webui/types'
import type { FormRules } from '../Form/types'

export interface FormTabItem {
  name: string | number
  label: string
  disabled?: boolean
}

export interface FormTabsProps extends BaseProps, DisabledProps {
  modelValue?: string | number
  tabs?: FormTabItem[]
  tabData?: Record<string, Record<string, unknown>>
  /** Optional per-tab field labels: { [tabName]: { [field]: label } } */
  fieldLabels?: Record<string, Record<string, string>>
  rules?: FormRules
  trackId?: string
  telemetry?: boolean
}

export interface FormTabsEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'update:tabData', value: Record<string, Record<string, unknown>>): void
  (e: 'change', name: string | number): void
}
