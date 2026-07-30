import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const TABS_INJECTION_KEY: InjectionKey<{
  activeName: Ref<string | number | undefined>
  setActive: (name: string | number) => void
}> = Symbol('vp-tabs')

export interface TabsProps extends BaseProps {
  modelValue?: string | number
  /** Accessible name for the tablist */
  ariaLabel?: string
}

export interface TabsEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'tabClick', value: string | number, event: MouseEvent | KeyboardEvent): void
}

export interface TabPaneProps extends BaseProps {
  name: string | number
  label?: string
  disabled?: boolean
  /** Lazy-render pane until first activation */
  lazy?: boolean
  /** Always keep content mounted (overrides lazy after first paint) */
  forceRender?: boolean
}
