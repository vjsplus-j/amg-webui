import type { BaseProps, DisabledProps } from '@amg-webui/types'

export type CodeLanguage = 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'sql'

export interface CodeEditorProps extends BaseProps, DisabledProps {
  modelValue?: string
  language?: CodeLanguage
  readonly?: boolean
}

export interface CodeEditorEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}
