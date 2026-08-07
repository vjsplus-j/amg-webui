import type { InjectionKey } from 'vue'
import type { Size } from '@amg-webui/types'
import type { ButtonSeverity, ButtonClickGuard } from './types'

/** Global defaults for Button (provide via BUTTON_CONFIG_KEY). */
export interface ButtonGlobalConfig {
  size?: Size
  severity?: ButtonSeverity
  /** Default wait (ms) for debounce / throttle */
  wait?: number
  /** Default click guard mode */
  clickGuard?: ButtonClickGuard
  /** Default border-radius CSS value (token preferred) */
  borderRadius?: string
  /** Enable ripple by default */
  ripple?: boolean
}

export const BUTTON_CONFIG_KEY: InjectionKey<ButtonGlobalConfig> = Symbol('vpButtonConfig')

export const BUTTON_GROUP_KEY: InjectionKey<{
  size?: Size
  severity?: ButtonSeverity
  variant?: string
  disabled?: boolean
  loading?: boolean
}> = Symbol('vpButtonGroup')
