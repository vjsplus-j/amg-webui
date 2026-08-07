/**
 * Design specs — machine-readable mirror of packages/theme/SPEC.md
 * Components and agents must prefer these tokens over magic numbers.
 */

export const TYPE_SCALE = {
  displayXl: 'var(--font-size-display-xl)',
  displayLg: 'var(--font-size-display-lg)',
  display: 'var(--font-size-display)',
  h1: 'var(--font-size-2xl)',
  h2: 'var(--font-size-xl)',
  h3: 'var(--font-size-lg)',
  body: 'var(--font-size-md)',
  bodySm: 'var(--font-size-sm)',
  caption: 'var(--font-size-xs)',
  bodyLg: 'var(--theme-body-lg)'
} as const

export const TYPE_WEIGHT = {
  display: 'var(--font-weight-display)',
  heading: 'var(--font-weight-heading)',
  body: 'var(--font-weight-body)'
} as const

export const TYPE_LEADING = {
  body: 'var(--line-height-body)'
} as const

/** 4px-based spacing scale */
export const SPACING = {
  xs: 'var(--spacing-xs)', // 4
  sm: 'var(--spacing-sm)', // 8
  md: 'var(--spacing-md)', // 12
  lg: 'var(--spacing-lg)', // 16
  xl: 'var(--spacing-xl)', // 24
  xxl: 'var(--spacing-2xl)', // 32
  pagePad: 'var(--theme-page-pad)',
  sectionGap: 'var(--theme-section-gap)',
  cardPad: 'var(--theme-card-pad)'
} as const

export const RADIUS = {
  sm: 'var(--border-radius-sm)',
  md: 'var(--border-radius-md)',
  lg: 'var(--border-radius-lg)',
  xl: 'var(--border-radius-xl)',
  pill: 'var(--border-radius-full)',
  card: 'var(--theme-card-radius)',
  button: 'var(--theme-btn-radius)',
  input: 'var(--theme-input-radius)',
  badge: 'var(--theme-badge-radius)',
  avatar: 'var(--theme-avatar-radius)',
  tab: 'var(--theme-tab-radius)'
} as const

export const CONTROL_HEIGHT = {
  sm: 'var(--height-sm)',
  md: 'var(--height-md)',
  lg: 'var(--height-lg)'
} as const

/** DataTable / virtual table stride tokens */
export const TABLE_LAYOUT = {
  rowHeight: 'var(--theme-table-row-height)',
  colMinWidth: 'var(--theme-table-col-min-width)'
} as const

export const CHROME_LAYOUT = {
  sidebarWidth: '244px',
  sidebarCollapsed: '64px',
  headerHeight: '48px',
  tabsHeight: '36px',
  shellHeight: '100vh'
} as const

export type DensityProfile = 'compact' | 'comfortable' | 'retail'

/** Per-theme density & radius intent (documentation + tooling) */
export const THEME_SURFACE_SPEC = {
  mercedes: {
    density: 'comfortable' as DensityProfile,
    radius: { sm: 0, md: 0, lg: 0, xl: 0 },
    controlHeight: { sm: 32, md: 40, lg: 48 },
    font: 'inter'
  },
  linear: {
    density: 'compact' as DensityProfile,
    radius: { sm: 4, md: 6, lg: 8, xl: 12 },
    controlHeight: { sm: 28, md: 32, lg: 36 },
    font: 'inter'
  },
  porsche: {
    density: 'comfortable' as DensityProfile,
    radius: { sm: 0, md: 8, lg: 8, xl: 9999 },
    controlHeight: { sm: 32, md: 40, lg: 48 },
    font: 'barlow'
  },
  lamborghini: {
    density: 'comfortable' as DensityProfile,
    radius: { sm: 2, md: 4, lg: 8, xl: 8 },
    controlHeight: { sm: 32, md: 40, lg: 48 },
    font: 'anton'
  },
  ferrari: {
    density: 'compact' as DensityProfile,
    radius: { sm: 2, md: 2, lg: 2, xl: 4 },
    controlHeight: { sm: 28, md: 36, lg: 44 },
    font: 'archivo'
  },
  apple: {
    density: 'retail' as DensityProfile,
    radius: { sm: 8, md: 11, lg: 14, xl: 18 },
    controlHeight: { sm: 32, md: 36, lg: 44 },
    font: 'albert-sans'
  }
} as const

export const BUTTON_FORMS = ['solid', 'outlined', 'dashed', 'text'] as const
export type ButtonForm = (typeof BUTTON_FORMS)[number]

export const CARD_RULES = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-color)',
  radius: 'var(--theme-card-radius)',
  padding: 'var(--theme-card-pad)',
  shadow: 'var(--shadow-sm)'
} as const

/** Semantic color CSS variables — never hardcode hex in components */
export const COLOR_SEMANTIC = {
  bg: 'var(--ds-bg)',
  surface: 'var(--ds-surface)',
  surfaceRaised: 'var(--ds-surface-raised)',
  text: 'var(--ds-text)',
  textMuted: 'var(--ds-text-muted)',
  border: 'var(--ds-border)',
  panelBorder: 'var(--ds-panel-border)',
  accent: 'var(--ds-accent)',
  accentHover: 'var(--ds-accent-hover)',
  accentMuted: 'var(--ds-accent-muted)',
  focusRing: 'var(--ds-focus-ring)',
  primary: 'var(--primary-500)',
  success: 'var(--success-500)',
  warning: 'var(--warning-500)',
  danger: 'var(--danger-500)',
  info: 'var(--info-500)'
} as const

export const SHADOW = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)'
} as const

export const BORDER = {
  color: 'var(--border-color)',
  colorHover: 'var(--border-color-hover)',
  default: '1px solid var(--ds-border)',
  focus: '2px solid var(--ds-focus-ring)'
} as const

export const DESIGN_ATTRS = {
  design: 'data-design',
  scheme: 'data-scheme',
  font: 'data-font',
  iconStyle: 'data-icon-style',
  locale: 'data-locale'
} as const

export const PAGE_COMPOSITION = [
  'ln-page-hero: eyebrow → title → lead → actions',
  'Tabs belong to chrome, not content',
  'Scroll lists inside viewport; shell stays 100vh',
  'One solid primary CTA per content view'
] as const
