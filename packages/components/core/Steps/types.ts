import type { InjectionKey, Ref, ComputedRef } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export const STEPS_INJECTION_KEY: InjectionKey<{
  active: ComputedRef<number> | Ref<number>
  direction: Ref<'horizontal' | 'vertical'>
  clickable: Ref<boolean>
  register: (id: symbol) => void
  unregister: (id: symbol) => void
  indexOf: (id: symbol) => number
  setActive: (index: number) => void
}> = Symbol('vp-steps')

export interface StepsProps extends BaseProps {
  /** Controlled active step index (0-based) */
  active?: number
  /** Alias for v-model */
  modelValue?: number
  direction?: 'horizontal' | 'vertical'
  /** Allow clicking finished / upcoming steps */
  clickable?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface StepsEmits {
  (e: 'update:active', index: number): void
  (e: 'update:modelValue', index: number): void
  (e: 'change', index: number): void
}

export interface StepItemProps extends BaseProps {
  title?: string
  description?: string
  icon?: string
  /** Override computed state */
  status?: StepStatus
  disabled?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface StepItemEmits {
  (e: 'click', index: number, event: MouseEvent): void
}
