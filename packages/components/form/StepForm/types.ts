import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface StepFormStep {
  name: string | number
  label: string
  description?: string
}

export interface StepFormProps extends BaseProps, DisabledProps {
  modelValue?: number
  steps?: StepFormStep[]
  stepData?: Record<string, Record<string, unknown>>
  loading?: boolean
}

export interface StepFormEmits {
  (e: 'update:modelValue', value: number): void
  (e: 'update:stepData', value: Record<string, Record<string, unknown>>): void
  (e: 'change', step: number): void
  (e: 'submit', data: Record<string, Record<string, unknown>>): void
}
