import type { BaseProps, DisabledProps, LoadingProps, Size } from '@amg-webui/types'

export interface SwitchProps extends BaseProps, DisabledProps, LoadingProps {
  modelValue?: boolean
  id?: string
  name?: string
  size?: Size
  inlinePrompt?: boolean
  activeText?: string
  inactiveText?: string
  invalid?: boolean
  /** Accessible name; falls back to active/inactive prompt text */
  ariaLabel?: string
}

export interface SwitchEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}
