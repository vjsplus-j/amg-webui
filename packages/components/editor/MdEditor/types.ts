import type { BaseProps, DisabledProps } from '@amg-webui/types'

export interface MdEditorProps extends BaseProps, DisabledProps {
  modelValue?: string
  preview?: boolean
}

export interface MdEditorEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
