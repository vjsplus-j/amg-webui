import './styles/index.scss'

export {
  ThemeService,
  useTheme,
  themes,
  designStyles,
  type ThemeName,
  type ThemeConfig,
  type DesignStyleName,
  type DesignStyleConfig,
  type ColorScheme,
  type ThemeIconSet
} from './services/ThemeService'

export {
  FontService,
  useFont,
  fonts,
  type FontName,
  type FontConfig
} from './services/FontService'

export {
  IconStyleService,
  useIconStyle,
  iconStyles,
  type IconStyleName,
  type IconStyleConfig
} from './services/IconStyleService'

export { ToastService, useToast } from './services/ToastService'
export { ConfirmService, useConfirm } from './services/ConfirmService'

export {
  CHROME_MODULES,
  VIEW_CHROME_MODULES,
  CONTENT_MODULES,
  STYLE_LAYERS,
  COMPOSITION_RULES,
  LINEAR_REFS,
  DESIGNMD_THEMES
} from './design/linear/rules'

export {
  TYPE_SCALE,
  TYPE_WEIGHT,
  TYPE_LEADING,
  SPACING,
  RADIUS,
  CONTROL_HEIGHT,
  CHROME_LAYOUT,
  THEME_SURFACE_SPEC,
  BUTTON_FORMS,
  CARD_RULES,
  COLOR_SEMANTIC,
  SHADOW,
  BORDER,
  DESIGN_ATTRS,
  PAGE_COMPOSITION,
  type DensityProfile,
  type ButtonForm
} from './specs'
