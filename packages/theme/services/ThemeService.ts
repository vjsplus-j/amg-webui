import { FontService, type FontName } from './FontService'

export type DesignStyleName =
  | 'mercedes'
  | 'linear'
  | 'porsche'
  | 'lamborghini'
  | 'ferrari'
  | 'apple'

export type ColorScheme = 'dark' | 'light'
export type ThemeIconSet = 'lucide' | 'material'

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

const STORAGE_KEY = 'amg-webui-design-v3'
const SCHEME_KEY = 'amg-webui-scheme'
const ATTR = 'data-design'
const SCHEME_ATTR = 'data-scheme'
const DEFAULT_STYLE: DesignStyleName = 'linear'
const DEFAULT_SCHEME: ColorScheme = 'dark'

let currentStyle: DesignStyleName = DEFAULT_STYLE
let currentScheme: ColorScheme = DEFAULT_SCHEME
const listeners = new Set<(style: DesignStyleName) => void>()
const schemeListeners = new Set<(scheme: ColorScheme) => void>()

function notify() {
  listeners.forEach((fn) => fn(currentStyle))
}

function notifyScheme() {
  schemeListeners.forEach((fn) => fn(currentScheme))
}

function getConfig(style: DesignStyleName): DesignStyleConfig | undefined {
  return designStyles.find((s) => s.name === style)
}

function syncBrandFont(style: DesignStyleName) {
  const cfg = getConfig(style)
  if (cfg) FontService.setFont(cfg.font)
}

function applySchemeAttribute(style: DesignStyleName) {
  const html = document.documentElement
  const cfg = getConfig(style)
  if (cfg?.supportsScheme) {
    html.setAttribute(SCHEME_ATTR, currentScheme)
  } else {
    html.removeAttribute(SCHEME_ATTR)
  }
}

export class ThemeService {
  static getCurrentTheme(): DesignStyleName {
    return currentStyle
  }

  static getCurrentStyle(): DesignStyleName {
    return currentStyle
  }

  static getScheme(): ColorScheme {
    return currentScheme
  }

  static getConfig(style: DesignStyleName = currentStyle): DesignStyleConfig | undefined {
    return getConfig(style)
  }

  static setTheme(style: DesignStyleName): void {
    ThemeService.setStyle(style)
  }

  static setStyle(style: DesignStyleName): void {
    if (!designStyles.some((s) => s.name === style)) return

    const html = document.documentElement
    html.setAttribute(ATTR, style)

    ;[
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
    ].forEach((name) => html.classList.remove(`theme-${name}`))

    currentStyle = style
    localStorage.setItem(STORAGE_KEY, style)
    localStorage.removeItem('amg-webui-theme')
    localStorage.removeItem('amg-webui-design-v2')

    applySchemeAttribute(style)
    syncBrandFont(style)
    notify()
  }

  static setScheme(scheme: ColorScheme): void {
    currentScheme = scheme
    localStorage.setItem(SCHEME_KEY, scheme)
    applySchemeAttribute(currentStyle)
    notifyScheme()
  }

  static init(): void {
    const storedScheme = localStorage.getItem(SCHEME_KEY) as ColorScheme | null
    if (storedScheme === 'dark' || storedScheme === 'light') {
      currentScheme = storedScheme
    }

    const stored =
      (localStorage.getItem(STORAGE_KEY) as DesignStyleName | null) ||
      mapLegacyTheme(localStorage.getItem('amg-webui-design-v2')) ||
      mapLegacyTheme(localStorage.getItem('amg-webui-theme'))

    const next = stored && designStyles.some((s) => s.name === stored) ? stored : DEFAULT_STYLE
    ThemeService.setStyle(next)
  }

  static getThemes(): DesignStyleConfig[] {
    return designStyles
  }

  static getStyles(): DesignStyleConfig[] {
    return designStyles
  }

  static toggleTheme(): DesignStyleName {
    const idx = designStyles.findIndex((s) => s.name === currentStyle)
    const next = designStyles[(idx + 1) % designStyles.length].name
    ThemeService.setStyle(next)
    return next
  }

  static toggleScheme(): ColorScheme {
    const next: ColorScheme = currentScheme === 'dark' ? 'light' : 'dark'
    ThemeService.setScheme(next)
    return next
  }

  static subscribe(fn: (style: DesignStyleName) => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  static subscribeScheme(fn: (scheme: ColorScheme) => void): () => void {
    schemeListeners.add(fn)
    return () => schemeListeners.delete(fn)
  }
}

function mapLegacyTheme(legacy: string | null): DesignStyleName | null {
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

export function useTheme() {
  return {
    setTheme: ThemeService.setTheme,
    setStyle: ThemeService.setStyle,
    setScheme: ThemeService.setScheme,
    getTheme: ThemeService.getCurrentTheme,
    getStyle: ThemeService.getCurrentStyle,
    getScheme: ThemeService.getScheme,
    getConfig: ThemeService.getConfig,
    getThemes: ThemeService.getThemes,
    getStyles: ThemeService.getStyles,
    toggleTheme: ThemeService.toggleTheme,
    toggleScheme: ThemeService.toggleScheme,
    initTheme: ThemeService.init,
    subscribe: ThemeService.subscribe,
    subscribeScheme: ThemeService.subscribeScheme
  }
}

export { designStyles as themes }
export type ThemeName = DesignStyleName
export type ThemeConfig = DesignStyleConfig

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $theme: ReturnType<typeof useTheme>
  }
}
