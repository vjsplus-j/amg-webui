import type { InjectionKey } from 'vue'
import type { TagEffect, TagSeverity, TagSize } from './types'

/** Global defaults for Tag (provide via TAG_CONFIG_KEY). */
export interface TagGlobalConfig {
  size?: TagSize
  severity?: TagSeverity
  effect?: TagEffect
  /** Default border-radius CSS value (token preferred) */
  borderRadius?: string
  /** Default close debounce wait (ms) */
  wait?: number
}

export const TAG_CONFIG_KEY: InjectionKey<TagGlobalConfig> = Symbol('vpTagConfig')
