import type {
  ThemeHost,
  ThemeInitOptions,
  ThemeListener,
  ThemeRuntime,
  ThemeRuntimeOptions,
  ThemeSnapshot,
  ThemeStorage
} from './types'
import {
  DESIGN_ATTR,
  SCHEME_ATTR,
  FONT_ATTR,
  ICON_STYLE_ATTR,
  THEME_STORAGE_SUFFIX,
  DEFAULT_DESIGN,
  DEFAULT_SCHEME,
  DEFAULT_FONT,
  DEFAULT_ICON_STYLE,
  getDesignConfig,
  isDesignStyleName,
  isFontName,
  isIconStyleName,
  iconStrokeWidth,
  storageKey,
  type DesignStyleName,
  type ColorScheme
} from './registry'
import { createNullHost, applyLegacyThemeClassCleanup } from './host'
import { createMemoryStorage } from './storage'
import {
  createThemeBootScript,
  normalizeCssVarName,
  resolveThemeFromStorage,
  serializeThemeAttrs
} from './attrs'
import { generatePrimaryScale } from './scale'
import { serializeThemeStyle, themeStyleTag } from './serialize'

function cloneState(state: ThemeSnapshot): ThemeSnapshot {
  return {
    design: state.design,
    scheme: state.scheme,
    font: state.font,
    iconStyle: state.iconStyle,
    customTokens: { ...state.customTokens }
  }
}

/**
 * Framework-free theme runtime: state + storage + host adapters.
 * Never touches `document` / `localStorage` unless adapters do.
 */
export function createThemeRuntime(options: ThemeRuntimeOptions = {}): ThemeRuntime {
  let host: ThemeHost = options.host ?? createNullHost()
  let storage: ThemeStorage = options.storage ?? createMemoryStorage()
  const namespace = options.storageNamespace ?? 'amg-webui'
  const syncBrandFont = options.syncBrandFont !== false
  const persist = options.persist !== false

  let state: ThemeSnapshot = {
    design: options.defaults?.design ?? DEFAULT_DESIGN,
    scheme: options.defaults?.scheme ?? DEFAULT_SCHEME,
    font: options.defaults?.font ?? DEFAULT_FONT,
    iconStyle: options.defaults?.iconStyle ?? DEFAULT_ICON_STYLE,
    customTokens: {}
  }

  const listeners = new Set<ThemeListener>()
  let disposed = false

  function notify() {
    const snap = cloneState(state)
    listeners.forEach((fn) => {
      try {
        fn(snap)
      } catch {
        /* listener isolation */
      }
    })
  }

  function persistAxis(suffix: string, value: string) {
    if (!persist) return
    storage.setItem(storageKey(namespace, suffix), value)
  }

  function clearLegacyDesignKeys() {
    if (!persist) return
    storage.removeItem(storageKey(namespace, THEME_STORAGE_SUFFIX.legacyTheme))
    storage.removeItem(storageKey(namespace, THEME_STORAGE_SUFFIX.legacyDesignV2))
  }

  function clearHostPaint() {
    if (disposed) return
    host.setAttribute(DESIGN_ATTR, null)
    host.setAttribute(FONT_ATTR, null)
    host.setAttribute(ICON_STYLE_ATTR, null)
    host.setAttribute(SCHEME_ATTR, null)
    host.setStyleProperty('--icon-stroke-width', null)
    for (const key of Object.keys(state.customTokens)) {
      host.setStyleProperty(key, null)
    }
  }

  function paint() {
    if (disposed) return
    applyLegacyThemeClassCleanup(host)
    host.setAttribute(DESIGN_ATTR, state.design)
    host.setAttribute(FONT_ATTR, state.font)
    host.setAttribute(ICON_STYLE_ATTR, state.iconStyle)
    host.setStyleProperty('--icon-stroke-width', iconStrokeWidth(state.iconStyle))

    const cfg = getDesignConfig(state.design)
    if (cfg?.supportsScheme) {
      host.setAttribute(SCHEME_ATTR, state.scheme)
    } else {
      host.setAttribute(SCHEME_ATTR, null)
    }

    for (const [key, value] of Object.entries(state.customTokens)) {
      host.setStyleProperty(normalizeCssVarName(key), value)
    }
  }

  function applyDesign(design: DesignStyleName, opts?: { skipBrandFont?: boolean }) {
    if (!isDesignStyleName(design)) return
    state.design = design
    persistAxis(THEME_STORAGE_SUFFIX.design, design)
    clearLegacyDesignKeys()
    if (syncBrandFont && !opts?.skipBrandFont) {
      const cfg = getDesignConfig(design)
      if (cfg && isFontName(cfg.font)) {
        state.font = cfg.font
        persistAxis(THEME_STORAGE_SUFFIX.font, cfg.font)
      }
    }
    paint()
    notify()
  }

  const api: ThemeRuntime = {
    getState() {
      return cloneState(state)
    },

    setDesign(design) {
      if (disposed) return
      applyDesign(design)
    },

    setScheme(scheme: ColorScheme) {
      if (disposed) return
      if (scheme !== 'dark' && scheme !== 'light') return
      state.scheme = scheme
      persistAxis(THEME_STORAGE_SUFFIX.scheme, scheme)
      paint()
      notify()
    },

    setFont(font) {
      if (disposed) return
      if (!isFontName(font)) return
      state.font = font
      persistAxis(THEME_STORAGE_SUFFIX.font, font)
      paint()
      notify()
    },

    setIconStyle(style) {
      if (disposed) return
      if (!isIconStyleName(style)) return
      state.iconStyle = style
      persistAxis(THEME_STORAGE_SUFFIX.iconStyle, style)
      paint()
      notify()
    },

    applyCustom(tokens) {
      if (disposed) return
      for (const [key, value] of Object.entries(tokens)) {
        const prop = normalizeCssVarName(key)
        state.customTokens[prop] = value
        host.setStyleProperty(prop, value)
      }
      notify()
    },

    replaceCustom(tokens) {
      if (disposed) return
      const next: Record<string, string> = {}
      for (const [key, value] of Object.entries(tokens)) {
        next[normalizeCssVarName(key)] = value
      }
      for (const key of Object.keys(state.customTokens)) {
        if (!(key in next)) {
          host.setStyleProperty(key, null)
        }
      }
      state.customTokens = next
      for (const [key, value] of Object.entries(next)) {
        host.setStyleProperty(key, value)
      }
      notify()
    },

    clearCustom() {
      if (disposed) return
      for (const key of Object.keys(state.customTokens)) {
        host.setStyleProperty(key, null)
      }
      state.customTokens = {}
      notify()
    },

    setPrimary(primary) {
      if (disposed) return
      const scale = generatePrimaryScale(primary)
      if (Object.keys(scale).length === 0) return
      api.applyCustom(scale)
    },

    init(initOptions: ThemeInitOptions = {}) {
      if (disposed) return
      const preferStorage = initOptions.preferStorage !== false
      const fromStorage = preferStorage
        ? resolveThemeFromStorage({ storage, namespace, defaults: options.defaults })
        : {
            design: state.design,
            scheme: state.scheme,
            font: state.font,
            iconStyle: state.iconStyle
          }

      const nextDesign = initOptions.overrides?.design ?? fromStorage.design
      const nextScheme = initOptions.overrides?.scheme ?? fromStorage.scheme
      const nextFont = initOptions.overrides?.font ?? fromStorage.font
      const nextIcon = initOptions.overrides?.iconStyle ?? fromStorage.iconStyle

      state.scheme = nextScheme
      persistAxis(THEME_STORAGE_SUFFIX.scheme, nextScheme)

      // Design may sync brand font — apply storage/override font after if explicit font override
      applyDesign(nextDesign, { skipBrandFont: !!initOptions.overrides?.font })

      if (initOptions.overrides?.font || !syncBrandFont) {
        if (isFontName(nextFont)) {
          state.font = nextFont
          persistAxis(THEME_STORAGE_SUFFIX.font, nextFont)
        }
      } else if (preferStorage && isFontName(fromStorage.font)) {
        // Legacy: ThemeService.init overwrites font via brand sync; keep that.
        // FontService.init before ThemeService.init is effectively ignored for brand designs.
      }

      if (isIconStyleName(nextIcon)) {
        state.iconStyle = nextIcon
        persistAxis(THEME_STORAGE_SUFFIX.iconStyle, nextIcon)
      }

      paint()
      notify()
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },

    bindHost(next) {
      if (disposed) return
      host = next
      paint()
    },

    getHost() {
      return host
    },

    bindStorage(next) {
      if (disposed) return
      storage = next
    },

    dispose() {
      if (disposed) return
      clearHostPaint()
      disposed = true
      listeners.clear()
      host = createNullHost()
    },

    serializeAttrs() {
      return serializeThemeAttrs(state)
    },

    serializeStyle(selector = ':root') {
      return serializeThemeStyle(state, { selector })
    },

    toStyleTag(options) {
      return themeStyleTag(state, {
        id: options?.id,
        selector: options?.selector
      })
    },

    toBootScript() {
      return createThemeBootScript({ namespace })
    }
  }

  return api
}
