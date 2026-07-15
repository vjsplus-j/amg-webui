import type { InjectionKey } from 'vue'
import type { Severity } from '@amg-webui/types'
import type { TypographyFontFamily, TypographyType } from './types'

/** Global defaults for Typography (provide via TYPOGRAPHY_CONFIG_KEY). */
export interface TypographyGlobalConfig {
  type?: TypographyType
  typeColor?: Severity
  fontFamily?: TypographyFontFamily
  lineHeight?: string | number
  /** Default multi-line clamp when ellipsis is true */
  ellipsisRows?: number
  ellipsisTooltip?: boolean
  copyable?: boolean
}

export const TYPOGRAPHY_CONFIG_KEY: InjectionKey<TypographyGlobalConfig> = Symbol(
  'vpTypographyConfig'
)
