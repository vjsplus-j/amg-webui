import type { BaseProps, Size } from '@amg-webui/types'
import type { ButtonGlobalConfig } from '../Button/config'
import type { TagGlobalConfig } from '../Tag/config'
import type { BadgeGlobalConfig } from '../Badge/config'
import type { AvatarGlobalConfig } from '../Avatar/config'

export interface ConfigProviderEmptyConfig {
  description?: string
}

export interface ConfigProviderProps extends BaseProps {
  size?: Size
  zIndex?: number
  namespace?: string
  /** Empty component / message override */
  empty?: ConfigProviderEmptyConfig
  button?: ButtonGlobalConfig
  tag?: TagGlobalConfig
  badge?: BadgeGlobalConfig
  avatar?: AvatarGlobalConfig
}
