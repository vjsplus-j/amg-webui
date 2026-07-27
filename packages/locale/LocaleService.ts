import { LOCALE_CODES, LOCALE_META, locales, type LocaleCode, type LocaleMessages } from './messages'
import { resolvePlurals } from './plural'

const STORAGE_KEY = 'amg-webui-locale-v1'
const ATTR = 'data-locale'
const DEFAULT: LocaleCode = 'zh-CN'

let current: LocaleCode = DEFAULT
const listeners = new Set<(code: LocaleCode) => void>()

function notify() {
  listeners.forEach((fn) => fn(current))
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  )
}

export class LocaleService {
  static getLocale(): LocaleCode {
    return current
  }

  static getMessages(): LocaleMessages {
    return locales[current]
  }

  static t(key: string, params?: Record<string, string | number>, fallback?: string): string {
    const raw = locales[current][key] ?? fallback ?? key
    // Plural segments first ({count, plural, …}), then plain {param} interpolation
    return interpolate(resolvePlurals(raw, params, current), params)
  }

  static setLocale(code: LocaleCode): void {
    if (!locales[code]) return
    current = code
    if (typeof document !== 'undefined') {
      const meta = LOCALE_META[code]
      document.documentElement.setAttribute(ATTR, code)
      document.documentElement.setAttribute('lang', meta.lang)
      document.documentElement.setAttribute('dir', meta.dir)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code)
    }
    notify()
  }

  static init(): void {
    const fromQuery =
      typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('lang') as LocaleCode | null)
        : null
    const stored =
      typeof localStorage !== 'undefined'
        ? (localStorage.getItem(STORAGE_KEY) as LocaleCode | null)
        : null
    const next =
      (fromQuery && locales[fromQuery] && fromQuery) ||
      (stored && locales[stored] && stored) ||
      DEFAULT
    LocaleService.setLocale(next)
  }

  /** Cycle through all registered locales */
  static toggle(): LocaleCode {
    const idx = LOCALE_CODES.indexOf(current)
    const next = LOCALE_CODES[(idx + 1) % LOCALE_CODES.length]!
    LocaleService.setLocale(next)
    return next
  }

  static subscribe(fn: (code: LocaleCode) => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }
}
