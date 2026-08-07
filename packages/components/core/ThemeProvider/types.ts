import type { BaseProps } from '@amg-webui/types'
import type {
  ThemeRuntime,
  DesignStyleName,
  ColorScheme,
  FontName,
  IconStyleName
} from '@amg-webui/theme'

export interface ThemeProviderProps extends BaseProps {
  /** Official design brand (mercedes / linear / …). */
  design?: DesignStyleName | string
  /** Alias of `design` for ConfigProvider-compatible naming. */
  theme?: string
  scheme?: ColorScheme
  font?: FontName | string
  iconStyle?: IconStyleName | string
  /** CSS custom property overlay (keys with or without `--`). */
  tokens?: Record<string, string>
  /** Primary color → full `--primary-*` scale + semantic bridges. */
  primary?: string
  /** Inject an existing runtime (provider will not dispose it). */
  runtime?: ThemeRuntime
  /** Persist axes to storage. Default false for scoped providers. */
  persist?: boolean
  storageNamespace?: string
  tag?: string
  display?: 'block' | 'contents' | 'inline'
  ariaLabel?: string
}

export interface ThemeProviderEmits {
  (e: 'change', state: ReturnType<ThemeRuntime['getState']>): void
}
