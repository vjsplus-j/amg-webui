import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export type DescriptionsSize = 'sm' | 'md' | 'lg'

export interface DescriptionsItemRegistration {
  id: symbol
  span: number
}

export interface DescriptionsContext {
  column: number
  bordered: boolean
  size: DescriptionsSize
  labelWidth?: string | number
  items: Ref<DescriptionsItemRegistration[]>
  register: (item: DescriptionsItemRegistration) => void
  unregister: (id: symbol) => void
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
}
