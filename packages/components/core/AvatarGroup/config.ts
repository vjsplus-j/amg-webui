import type { InjectionKey } from 'vue'
import type { AvatarShape, AvatarSize } from '../Avatar/types'

/** Global defaults for AvatarGroup (provide via AVATAR_GROUP_CONFIG_KEY). */
export interface AvatarGroupGlobalConfig {
  max?: number
  size?: AvatarSize
  shape?: AvatarShape
  overlap?: string
}

export const AVATAR_GROUP_CONFIG_KEY: InjectionKey<AvatarGroupGlobalConfig> = Symbol(
  'vpAvatarGroupConfig'
)
