import type { ThemeSnapshot } from './types'
import {
  DESIGN_ATTR,
  SCHEME_ATTR,
  FONT_ATTR,
  ICON_STYLE_ATTR,
  THEME_STORAGE_SUFFIX,
  getDesignConfig,
  isDesignStyleName,
  isColorScheme,
  isFontName,
  isIconStyleName,
  mapLegacyTheme,
  storageKey,
  type DesignStyleName,
  type ColorScheme,
  type FontName,
  type IconStyleName
} from './registry'
import type { ThemeStorage } from './types'

export function normalizeCssVarName(key: string): string {
  return key.startsWith('--') ? key : `--${key}`
}

/** Build data-* attribute map for SSR HTML serialization. */
export function serializeThemeAttrs(state: Pick<ThemeSnapshot, 'design' | 'scheme' | 'font' | 'iconStyle'>): Record<string, string> {
  const attrs: Record<string, string> = {
    [DESIGN_ATTR]: state.design,
    [FONT_ATTR]: state.font,
    [ICON_STYLE_ATTR]: state.iconStyle
  }
  const cfg = getDesignConfig(state.design)
  if (cfg?.supportsScheme) {
    attrs[SCHEME_ATTR] = state.scheme
  }
  return attrs
}

/** `data-design="linear" data-scheme="dark" …` for `<html …>`. */
export function themeAttrsToHtmlString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
    .join(' ')
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

export interface ResolveThemeFromStorageOptions {
  storage: ThemeStorage
  namespace?: string
  defaults?: Partial<Pick<ThemeSnapshot, 'design' | 'scheme' | 'font' | 'iconStyle'>>
}

export function resolveThemeFromStorage(options: ResolveThemeFromStorageOptions): Pick<
  ThemeSnapshot,
  'design' | 'scheme' | 'font' | 'iconStyle'
> {
  const ns = options.namespace ?? 'amg-webui'
  const defaults = {
    design: (options.defaults?.design ?? 'linear') as DesignStyleName,
    scheme: (options.defaults?.scheme ?? 'dark') as ColorScheme,
    font: (options.defaults?.font ?? 'inter') as FontName,
    iconStyle: (options.defaults?.iconStyle ?? 'outline') as IconStyleName
  }

  const storedDesign =
    options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.design)) ||
    mapLegacyTheme(options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.legacyDesignV2))) ||
    mapLegacyTheme(options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.legacyTheme)))

  const storedScheme = options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.scheme))
  const storedFont = options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.font))
  const storedIcon = options.storage.getItem(storageKey(ns, THEME_STORAGE_SUFFIX.iconStyle))

  return {
    design: isDesignStyleName(storedDesign) ? storedDesign : defaults.design,
    scheme: isColorScheme(storedScheme) ? storedScheme : defaults.scheme,
    font: isFontName(storedFont) ? storedFont : defaults.font,
    iconStyle: isIconStyleName(storedIcon) ? storedIcon : defaults.iconStyle
  }
}

/**
 * Inline script that mirrors storage → documentElement attrs before first paint.
 * Embed in `<head>` ahead of stylesheets for FOUC control.
 */
export function createThemeBootScript(options?: {
  namespace?: string
  rootSelector?: string
}): string {
  const ns = options?.namespace ?? 'amg-webui'
  const rootExpr = options?.rootSelector
    ? `document.querySelector(${JSON.stringify(options.rootSelector)})||document.documentElement`
    : 'document.documentElement'

  // Keep this string self-contained — no imports, runs before app JS.
  return `(function(){try{var d=${rootExpr};var ns=${JSON.stringify(ns)};var g=function(s){try{return localStorage.getItem(ns+'-'+s)}catch(e){return null}};var design=g('design-v3')||g('design-v2')||g('theme');var legacy={default:'linear',admin:'linear',tech:'linear',corporate:'mercedes',borderless:'mercedes',ecommerce:'apple',government:'mercedes',business:'mercedes',screen:'porsche'};if(design&&legacy[design])design=legacy[design];var ok={mercedes:1,linear:1,porsche:1,lamborghini:1,ferrari:1,apple:1,wechat:1,alipay:1};if(design&&ok[design])d.setAttribute('data-design',design);var scheme=g('scheme');if(scheme==='dark'||scheme==='light'){var cur=d.getAttribute('data-design')||'linear';if(cur==='linear'||cur==='apple'||cur==='wechat'||cur==='alipay')d.setAttribute('data-scheme',scheme)}var font=g('font-v3');var fonts={inter:1,barlow:1,anton:1,archivo:1,'albert-sans':1,yahei:1,song:1,heiti:1,apple:1};if(font&&fonts[font])d.setAttribute('data-font',font);var icon=g('icon-style-v2');if(icon==='outline'||icon==='solid'){d.setAttribute('data-icon-style',icon);d.style.setProperty('--icon-stroke-width',icon==='solid'?'2.25':'1.75')}}catch(e){}})();`
}

/** Wrap boot script as a full HTML tag for SSR templates. */
export function themeBootScriptTag(options?: { namespace?: string; rootSelector?: string }): string {
  return `<script>${createThemeBootScript(options)}</script>`
}
