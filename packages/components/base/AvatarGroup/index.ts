import Comp from './index.vue'
import type { AvatarGroupEmits, AvatarGroupProps, AvatarGroupSlots } from './types'
import { AVATAR_GROUP_CONFIG_KEY } from './config'
import type { AvatarGroupGlobalConfig } from './config'

export { Comp as AvatarGroup, AVATAR_GROUP_CONFIG_KEY }
export type {
  AvatarGroupProps,
  AvatarGroupEmits,
  AvatarGroupSlots,
  AvatarGroupGlobalConfig
}
export default Comp
