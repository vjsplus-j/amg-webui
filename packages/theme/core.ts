/**
 * Theme Core — framework-free, SSR-safe.
 * Import from `amg-webui/theme/core` (or `@amg-webui/theme/core` in-repo).
 * Never imports Vue, components, or SCSS.
 */

export type {
  ThemeSnapshot,
  ThemeHost,
  ThemeStorage,
  ThemeRuntimeOptions,
  ThemeInitOptions,
  ThemeListener,
  ThemeRuntime,
  ThemeConfigureOptions,
  DesignStyleName,
  ColorScheme,
  ThemeIconSet,
  DesignStyleConfig,
  FontName,
  FontConfig,
  IconStyleName,
  IconStyleConfig
} from './core/types'

export {
  designStyles,
  fonts,
  iconStyles,
  DEFAULT_DESIGN,
  DEFAULT_SCHEME,
  DEFAULT_FONT,
  DEFAULT_ICON_STYLE,
  DESIGN_ATTR,
  SCHEME_ATTR,
  FONT_ATTR,
  ICON_STYLE_ATTR,
  THEME_STORAGE_SUFFIX,
  LEGACY_THEME_CLASSES,
  getDesignConfig,
  isDesignStyleName,
  isFontName,
  isIconStyleName,
  isColorScheme,
  mapLegacyTheme,
  iconStrokeWidth,
  storageKey
} from './core/registry'

export { createMemoryStorage, createWebStorage, createAutoStorage } from './core/storage'
export {
  createNullHost,
  createDocumentHost,
  createAutoHost,
  createShadowHost,
  applyLegacyThemeClassCleanup
} from './core/host'
export {
  serializeThemeAttrs,
  themeAttrsToHtmlString,
  resolveThemeFromStorage,
  createThemeBootScript,
  themeBootScriptTag,
  normalizeCssVarName
} from './core/attrs'
export {
  serializeThemeStyle,
  themeStyleTag,
  type SerializeThemeStyleOptions
} from './core/serialize'
export {
  generatePrimaryScale,
  parseCssColor,
  rgbToHsl,
  hslToRgb,
  type GeneratePrimaryScaleOptions,
  type PrimaryScaleStop,
  type RgbColor,
  type HslColor
} from './core/scale'
export { createThemeRuntime } from './core/runtime'
export {
  getDefaultThemeRuntime,
  configureDefaultThemeRuntime,
  resetDefaultThemeRuntime
} from './core/defaultRuntime'
