import type { InjectionKey, Ref } from 'vue'
import type { AvatarShape, AvatarSize } from './types'

/** Global defaults for Avatar (provide via AVATAR_CONFIG_KEY). */
export interface AvatarGlobalConfig {
  size?: AvatarSize
  shape?: AvatarShape
  borderRadius?: string
  bordered?: boolean
  borderColor?: string
  colorBg?: string
  colorText?: string
  fallbackIcon?: string
  tooltipDelay?: number
}

export const AVATAR_CONFIG_KEY: InjectionKey<AvatarGlobalConfig> = Symbol('vpAvatarConfig')

/** Provided by AvatarGroup — cascades size / shape / disabled / variant to children. */
export interface AvatarGroupContext {
  size: Ref<AvatarSize | undefined>
  shape: Ref<AvatarShape | undefined>
  disabled: Ref<boolean>
  variant: Ref<'default' | 'neon' | undefined>
}

export const AVATAR_GROUP_KEY: InjectionKey<AvatarGroupContext> = Symbol('vpAvatarGroup')
