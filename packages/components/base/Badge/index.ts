import Comp from './index.vue'
import type { BadgeEmits, BadgeProps, BadgeSlots } from './types'
import { BADGE_CONFIG_KEY } from './config'
import type { BadgeGlobalConfig } from './config'

export { Comp as Badge, BADGE_CONFIG_KEY }
export type { BadgeProps, BadgeEmits, BadgeSlots, BadgeGlobalConfig }
export default Comp
