import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const STEPS_INJECTION_KEY: InjectionKey<{
  active: Ref<number>
  direction: Ref<'horizontal' | 'vertical'>
}> = Symbol('vp-steps')

export interface StepsProps extends BaseProps {
  active?: number
  direction?: 'horizontal' | 'vertical'
}

export interface StepItemProps extends BaseProps {
  title?: string
  description?: string
  icon?: string
}
