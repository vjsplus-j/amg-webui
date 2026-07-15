import Comp from './index.vue'
import type { TypographyProps, TypographyEmits, TypographyType, TypographyEllipsis, TypographyCopyable, TypographyFontFamily } from './types'
import { TYPOGRAPHY_CONFIG_KEY } from './config'
import type { TypographyGlobalConfig } from './config'

export { Comp as Typography, TYPOGRAPHY_CONFIG_KEY }
export type {
  TypographyProps,
  TypographyEmits,
  TypographyType,
  TypographyEllipsis,
  TypographyCopyable,
  TypographyFontFamily,
  TypographyGlobalConfig
}
export default Comp
