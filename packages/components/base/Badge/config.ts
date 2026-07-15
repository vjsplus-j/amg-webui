import type { InjectionKey } from 'vue'
import type { BadgePosition, BadgeSeverity, BadgeSize } from './types'

/** Global defaults for Badge (provide via BADGE_CONFIG_KEY). */
export interface BadgeGlobalConfig {
  max?: number
  size?: BadgeSize
  severity?: BadgeSeverity
  position?: BadgePosition
  /** Default translate offset `[x, y]` in px */
  offset?: [number, number]
  colorBg?: string
  colorText?: string
  tooltipDelay?: number
  /** Default pulse animation */
  pulse?: boolean
}

export const BADGE_CONFIG_KEY: InjectionKey<BadgeGlobalConfig> = Symbol('vpBadgeConfig')
