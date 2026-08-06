import type { BaseProps, Size } from '@amg-webui/types'
import type { ButtonGlobalConfig } from '../Button/config'
import type { TagGlobalConfig } from '../Tag/config'
import type { BadgeGlobalConfig } from '../Badge/config'
import type { AvatarGlobalConfig } from '../Avatar/config'

export interface ConfigProviderEmptyConfig {
  description?: string
}

export type ConfigProviderDirection = 'ltr' | 'rtl'
export type ConfigProviderDensity = 'compact' | 'comfortable' | 'spacious'

export interface ConfigProviderRuntimeConfig {
  direction?: ConfigProviderDirection
  density?: ConfigProviderDensity
  theme?: string
  locale?: string
  validateMessages?: Record<string, string>
  componentDefaults?: Record<string, Record<string, unknown> | undefined>
}

export interface ConfigProviderProps extends BaseProps {
  size?: Size
  zIndex?: number
  namespace?: string
  direction?: ConfigProviderDirection
  density?: ConfigProviderDensity
  theme?: string
  locale?: string
  validateMessages?: Record<string, string>
  componentDefaults?: Record<string, Record<string, unknown> | undefined>
  /** Empty component / message override */
  empty?: ConfigProviderEmptyConfig
  button?: ButtonGlobalConfig
  tag?: TagGlobalConfig
  badge?: BadgeGlobalConfig
  avatar?: AvatarGlobalConfig
}

export type ConfigProviderResolvedConfig = ConfigProviderProps & ConfigProviderRuntimeConfig

export interface ConfigProviderEmits {
  (e: 'change', config: ConfigProviderResolvedConfig): void
}
