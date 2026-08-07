import Comp from './index.vue'
import type { TagProps, TagEmits, TagEffect, TagSeverity, TagSize } from './types'
import { TAG_CONFIG_KEY } from './config'
import type { TagGlobalConfig } from './config'

export { Comp as Tag, TAG_CONFIG_KEY }
export type { TagProps, TagEmits, TagEffect, TagSeverity, TagSize, TagGlobalConfig }
export default Comp
