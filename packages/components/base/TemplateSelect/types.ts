import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface FormTemplate {
  id: string
  name: string
  description?: string
  preview?: string
  data: Record<string, unknown>
}

export interface TemplateSelectProps extends BaseProps, DisabledProps {
  modelValue?: string | null
  templates?: FormTemplate[]
}

export interface TemplateSelectEmits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', template: FormTemplate | null): void
  (e: 'apply', data: Record<string, unknown>): void
}
