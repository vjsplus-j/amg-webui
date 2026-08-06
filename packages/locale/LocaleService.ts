import {
  LOCALE_CODES,
  LOCALE_META,
  getLocaleMeta,
  getLocalePack,
  listLocaleCodes,
  type LocaleCode,
  type LocaleKey,
  type LocaleMessages,
  type TextDirection
} from './messages'
import { resolvePlurals } from './plural'

const STORAGE_KEY = 'amg-webui-locale-v1'
const ATTR = 'data-locale'
const DEFAULT: LocaleCode = 'zh-CN'

let current: string = DEFAULT
/** `null` = follow locale meta */
let directionOverride: TextDirection | null = null
const listeners = new Set<(code: string) => void>()
const dirListeners = new Set<(dir: TextDirection) => void>()

function notify() {
  listeners.forEach((fn) => fn(current))
}

function notifyDir() {
  const dir = LocaleService.getDir()
  dirListeners.forEach((fn) => fn(dir))
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  )
}

function applyDocumentAttrs(code: string): void {
  if (typeof document === 'undefined') return
  const meta = getLocaleMeta(code) ?? LOCALE_META[DEFAULT]
  const dir = directionOverride ?? meta.dir
  document.documentElement.setAttribute(ATTR, code)
  document.documentElement.setAttribute('lang', meta.lang)
  document.documentElement.setAttribute('dir', dir)
}

export class LocaleService {
  static getLocale(): string {
    return current
  }

  static getMessages(): LocaleMessages {
    return getLocalePack(current) ?? getLocalePack(DEFAULT)!
  }

  static getDir(): TextDirection {
    if (directionOverride) return directionOverride
    return getLocaleMeta(current)?.dir ?? 'ltr'
  }

  /**
   * Force document / chrome direction, or `null` to follow the active locale meta.
   * Enables RTL preview without switching language packs.
   */
  static setDirection(dir: TextDirection | null): void {
    directionOverride = dir
    applyDocumentAttrs(current)
    notifyDir()
  }

  static t(key: LocaleKey, params?: Record<string, string | number>, fallback?: string): string {
    const pack = LocaleService.getMessages()
    const raw = pack[key] ?? fallback ?? key
    return interpolate(resolvePlurals(raw, params, current), params)
  }

  static setLocale(code: string): void {
    if (!getLocalePack(code)) return
    current = code
    applyDocumentAttrs(code)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code)
    }
    notify()
    notifyDir()
  }

  static init(): void {
    const fromQuery =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('lang')
        : null
    const stored =
      typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const next =
      (fromQuery && getLocalePack(fromQuery) && fromQuery) ||
      (stored && getLocalePack(stored) && stored) ||
      DEFAULT
    LocaleService.setLocale(next)
  }

  /** Cycle through built-in locales (custom packs are not in the cycle). */
  static toggle(): LocaleCode {
    const idx = LOCALE_CODES.indexOf(current as LocaleCode)
    const next = LOCALE_CODES[(idx + 1) % LOCALE_CODES.length]!
    LocaleService.setLocale(next)
    return next
  }

  static subscribe(fn: (code: string) => void): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  static subscribeDir(fn: (dir: TextDirection) => void): () => void {
    dirListeners.add(fn)
    return () => dirListeners.delete(fn)
  }

  static codes(): string[] {
    return listLocaleCodes()
  }
}
