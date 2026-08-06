export type DesignStyleName =
  | 'mercedes'
  | 'linear'
  | 'porsche'
  | 'lamborghini'
  | 'ferrari'
  | 'apple'

export type ColorScheme = 'dark' | 'light'
export type ThemeIconSet = 'lucide' | 'material'

export type FontName =
  | 'inter'
  | 'barlow'
  | 'anton'
  | 'archivo'
  | 'albert-sans'
  | 'yahei'
  | 'song'
  | 'heiti'
  | 'apple'

export type IconStyleName = 'outline' | 'solid'

export interface DesignStyleConfig {
  name: DesignStyleName
  label: string
  description: string
  category: 'Auto' | 'SaaS' | 'Retail'
  font: FontName
  iconSet: ThemeIconSet
  /** designmd reference */
  ref: string
  supportsScheme?: boolean
  preview: {
    primary: string
    background: string
  }
}

export interface FontConfig {
  name: FontName
  label: string
  description: string
  sample: string
}

export interface IconStyleConfig {
  name: IconStyleName
  label: string
  description: string
}

/**
 * Locked brand themes — tokens aligned to designmd.
 * Do not invent alternate product skins outside this registry.
 */
export const designStyles: DesignStyleConfig[] = [
  {
    name: 'mercedes',
    label: 'Mercedes-Benz',
    description: '近黑墨色 × 亮白 · 银灰色点缀 · 零圆角精密度 · Lucide · Inter',
    category: 'Auto',
    font: 'inter',
    iconSet: 'lucide',
    ref: 'https://designmd.santiagoalonso.com/mercedes-benz',
    preview: { primary: '#171717', background: '#ffffff' }
  },
  {
    name: 'linear',
    label: 'Linear',
    description: '近黑画布 · 靛紫 #5e6ad2 · 6px 圆角 · Lucide · Inter Variable',
    category: 'SaaS',
    font: 'inter',
    iconSet: 'lucide',
    ref: 'https://designmd.santiagoalonso.com/linear.app',
    supportsScheme: true,
    preview: { primary: '#5e6ad2', background: '#08090a' }
  },
  {
    name: 'porsche',
    label: 'Porsche',
    description: '纯黑舞台 · 白色墨迹 · 零强调色 · Lucide · Barlow',
    category: 'Auto',
    font: 'barlow',
    iconSet: 'lucide',
    ref: 'https://designmd.santiagoalonso.com/porsche',
    preview: { primary: '#ffffff', background: '#000000' }
  },
  {
    name: 'lamborghini',
    label: 'Lamborghini',
    description: '黑底金强调 #ffc000 · Anton 冲击标题 · Material · 大写排版',
    category: 'Auto',
    font: 'anton',
    iconSet: 'material',
    ref: 'https://designmd.santiagoalonso.com/lamborghini',
    preview: { primary: '#ffc000', background: '#000000' }
  },
  {
    name: 'ferrari',
    label: 'Ferrari',
    description: '明暗跳切 · Rosso Corsa #da291c · Archivo · 锐利 2px',
    category: 'Auto',
    font: 'archivo',
    iconSet: 'material',
    ref: 'https://designmd.santiagoalonso.com/ferrari',
    preview: { primary: '#da291c', background: '#ffffff' }
  },
  {
    name: 'apple',
    label: 'Apple',
    description: '浅灰画布 #f5f5f7 · 链接蓝 #0071e3 · Albert Sans · 胶囊按钮',
    category: 'Retail',
    font: 'albert-sans',
    iconSet: 'material',
    supportsScheme: true,
    ref: 'https://designmd.santiagoalonso.com/apple',
    preview: { primary: '#0071e3', background: '#f5f5f7' }
  }
]

/** Brand fonts first (synced by theme runtime), then optional OS stacks */
export const fonts: FontConfig[] = [
  {
    name: 'inter',
    label: 'Inter',
    description: 'Mercedes / Linear — Inter Variable（品牌代理 MB Corpo）',
    sample: 'Inter Aa 123'
  },
  {
    name: 'barlow',
    label: 'Barlow',
    description: 'Porsche — Barlow（品牌代理 Porsche Next）',
    sample: 'Barlow Aa 123'
  },
  {
    name: 'anton',
    label: 'Anton',
    description: 'Lamborghini — Anton（品牌代理 LamboType）',
    sample: 'ANTON Aa 123'
  },
  {
    name: 'archivo',
    label: 'Archivo',
    description: 'Ferrari — Archivo（品牌代理 FerrariSans）',
    sample: 'Archivo Aa 123'
  },
  {
    name: 'albert-sans',
    label: 'Albert Sans',
    description: 'Apple — Albert Sans（品牌代理 SF Pro Display）',
    sample: 'Albert Sans Aa'
  },
  {
    name: 'yahei',
    label: '微软雅黑',
    description: 'Windows 常见无衬线中文',
    sample: '微软雅黑 Aa 123'
  },
  {
    name: 'song',
    label: '宋体',
    description: '传统衬线中文',
    sample: '宋体 Aa 123'
  },
  {
    name: 'heiti',
    label: '黑体',
    description: '经典无衬线黑体',
    sample: '黑体 Aa 123'
  },
  {
    name: 'apple',
    label: '系统苹方',
    description: 'PingFang / SF 系统栈（非 Albert Sans）',
    sample: '苹方 Aa 123'
  }
]

/**
 * Lucide is stroke-based (Linear / Iconify Lucide).
 * Styles map to stroke weights, not fill vs stroke.
 */
export const iconStyles: IconStyleConfig[] = [
  {
    name: 'outline',
    label: 'Linear 线框',
    description: 'Lucide 默认描边（stroke ≈ 1.75），对齐 Linear UI'
  },
  {
    name: 'solid',
    label: '加粗描边',
    description: 'Lucide 加粗描边（stroke ≈ 2.25），强调操作态'
  }
]

export const DEFAULT_DESIGN: DesignStyleName = 'linear'
export const DEFAULT_SCHEME: ColorScheme = 'dark'
export const DEFAULT_FONT: FontName = 'inter'
export const DEFAULT_ICON_STYLE: IconStyleName = 'outline'

export const DESIGN_ATTR = 'data-design'
export const SCHEME_ATTR = 'data-scheme'
export const FONT_ATTR = 'data-font'
export const ICON_STYLE_ATTR = 'data-icon-style'

/** Storage key suffixes (prefixed by namespace). */
export const THEME_STORAGE_SUFFIX = {
  design: 'design-v3',
  scheme: 'scheme',
  font: 'font-v3',
  iconStyle: 'icon-style-v2',
  legacyDesignV2: 'design-v2',
  legacyTheme: 'theme'
} as const

export const LEGACY_THEME_CLASSES = [
  'default',
  'borderless',
  'ecommerce',
  'corporate',
  'admin',
  'tech',
  'government',
  'business',
  'screen',
  'linear',
  'mercedes',
  'porsche',
  'lamborghini',
  'ferrari',
  'apple'
] as const

export function getDesignConfig(style: DesignStyleName): DesignStyleConfig | undefined {
  return designStyles.find((s) => s.name === style)
}

export function isDesignStyleName(value: string | null | undefined): value is DesignStyleName {
  return !!value && designStyles.some((s) => s.name === value)
}

export function isFontName(value: string | null | undefined): value is FontName {
  return !!value && fonts.some((f) => f.name === value)
}

export function isIconStyleName(value: string | null | undefined): value is IconStyleName {
  return !!value && iconStyles.some((s) => s.name === value)
}

export function isColorScheme(value: string | null | undefined): value is ColorScheme {
  return value === 'dark' || value === 'light'
}

export function mapLegacyTheme(legacy: string | null): DesignStyleName | null {
  if (!legacy) return null
  const map: Record<string, DesignStyleName> = {
    default: 'linear',
    admin: 'linear',
    tech: 'linear',
    corporate: 'mercedes',
    borderless: 'mercedes',
    ecommerce: 'apple',
    government: 'mercedes',
    business: 'mercedes',
    screen: 'porsche',
    linear: 'linear',
    mercedes: 'mercedes',
    porsche: 'porsche',
    lamborghini: 'lamborghini',
    ferrari: 'ferrari',
    apple: 'apple'
  }
  return map[legacy] ?? null
}

export function iconStrokeWidth(style: IconStyleName): string {
  return style === 'solid' ? '2.25' : '1.75'
}

export function storageKey(namespace: string, suffix: string): string {
  return `${namespace}-${suffix}`
}
