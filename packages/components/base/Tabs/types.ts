import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const TABS_INJECTION_KEY: InjectionKey<{
  activeName: Ref<string | number | undefined>
  setActive: (name: string | number) => void
}> = Symbol('vp-tabs')

export interface TabsProps extends BaseProps {
  modelValue?: string | number
}

export interface TabsEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

export interface TabPaneProps extends BaseProps {
  name: string | number
  label?: string
  disabled?: boolean
}
