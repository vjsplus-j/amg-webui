import type { BaseProps, Size } from '@amg-webui/types'
import type { ButtonGlobalConfig } from '../Button/config'
import type { TagGlobalConfig } from '../Tag/config'
import type { BadgeGlobalConfig } from '../Badge/config'
import type { AvatarGlobalConfig } from '../Avatar/config'
import type {
  ThemeRuntime,
  DesignStyleName,
  ColorScheme,
  FontName,
  IconStyleName
} from '@amg-webui/theme'

export interface ConfigProviderEmptyConfig {
  description?: string
}

export type ConfigProviderDirection = 'ltr' | 'rtl'
export type ConfigProviderDensity = 'compact' | 'comfortable' | 'spacious'

export interface ConfigProviderRuntimeConfig {
  direction?: ConfigProviderDirection
  density?: ConfigProviderDensity
  /** @deprecated Prefer `design` — kept as alias for design brand name. */
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
  /**
   * Legacy alias for `design` (official brand name).
   * When set with other theme axes, scopes a local ThemeRuntime on this root.
   */
  theme?: string
  /** Official design brand — scopes local ThemeRuntime when set. */
  design?: DesignStyleName | string
  scheme?: ColorScheme
  font?: FontName | string
  iconStyle?: IconStyleName | string
  /** CSS custom property overlay on this provider root. */
  tokens?: Record<string, string>
  /** Primary → full `--primary-*` scale via Theme Core. */
  primary?: string
  /** Inject existing runtime (will not be disposed by this provider). */
  themeRuntime?: ThemeRuntime
  /** Persist scoped theme axes. Default false. */
  themePersist?: boolean
  themeStorageNamespace?: string
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
