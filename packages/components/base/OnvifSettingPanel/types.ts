import type { BaseProps } from '@amg-webui/types'
export interface OnvifSettings {
  username: string
  password: string
  port: number
}

export interface OnvifSettingPanelProps extends BaseProps {
  modelValue?: OnvifSettings
  disabled?: boolean
  loading?: boolean
  title?: string
}

export interface OnvifSettingPanelEmits {
  (e: 'update:modelValue', v: OnvifSettings): void
  (e: 'submit', v: OnvifSettings): void
}
