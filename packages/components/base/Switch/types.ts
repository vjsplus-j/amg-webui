import type { BaseProps, DisabledProps, LoadingProps } from '@amg-webui/types'

export interface SwitchProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: boolean
  inlinePrompt?: boolean
  activeText?: string
  inactiveText?: string
}

export interface SwitchEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}
