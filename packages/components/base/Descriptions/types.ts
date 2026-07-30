import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export type DescriptionsSize = 'sm' | 'md' | 'lg'

export interface DescriptionsContext {
  column: Ref<number>
  bordered: Ref<boolean>
  size: Ref<DescriptionsSize>
  labelWidth: Ref<string | number | undefined>
}

export const DESCRIPTIONS_INJECTION_KEY: InjectionKey<DescriptionsContext> =
  Symbol('vp-descriptions')

export interface DescriptionsProps extends BaseProps {
  title?: string
  column?: number
  bordered?: boolean
  size?: DescriptionsSize
  labelWidth?: string | number
}

export interface DescriptionsItemProps extends BaseProps {
  label?: string
  span?: number
  colon?: boolean
  labelAlign?: 'start' | 'end'
  labelWidth?: string | number
}
