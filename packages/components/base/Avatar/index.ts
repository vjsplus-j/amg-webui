import Comp from './index.vue'
import type { AvatarProps, AvatarEmits, AvatarSlots, AvatarSize, AvatarShape } from './types'
import { AVATAR_CONFIG_KEY, AVATAR_GROUP_KEY } from './config'
import type { AvatarGlobalConfig, AvatarGroupContext } from './config'

export { Comp as Avatar, AVATAR_CONFIG_KEY, AVATAR_GROUP_KEY }
export type {
  AvatarProps,
  AvatarEmits,
  AvatarSlots,
  AvatarSize,
  AvatarShape,
  AvatarGlobalConfig,
  AvatarGroupContext
}
export default Comp
