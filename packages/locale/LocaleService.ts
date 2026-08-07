import {
  LOCALE_CODES,
  LOCALE_META,
  getLocaleMeta,
  getLocalePack,
  listLocaleCodes,
  resolveLocaleCode,
  type LocaleCode,
  type LocaleKey,
  type LocaleMessages,
  type TextDirection
} from './messages'
import { resolvePlurals } from './plural'

const STORAGE_KEY = 'amg-webui-locale-v1'
const DIR_STORAGE_KEY = 'amg-webui-dir-v1'
const ATTR = 'data-locale'
const DEFAULT: LocaleCode = 'zh-CN'
const DEFAULT_DIR: TextDirection = 'ltr'

let current: string = DEFAULT
/** Document reading direction — independent of locale pack. */
let currentDir: TextDirection = DEFAULT_DIR
const listeners = new Set<(code: string) => void>()
const dirListeners = new Set<(dir: TextDirection) => void>()

function notify() {
  listeners.forEach((fn) => fn(current))
}

function notifyDir() {
  dirListeners.forEach((fn) => fn(currentDir))
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`
  )
}

function parseDir(raw: string | null | undefined): TextDirection | null {
  if (raw === 'rtl' || raw === 'ltr') return raw
  return null
}

function applyDocumentAttrs(code: string): void {
  if (typeof document === 'undefined') return
  const meta = getLocaleMeta(code) ?? LOCALE_META[DEFAULT]
  document.documentElement.setAttribute(ATTR, code)
  document.documentElement.setAttribute('lang', meta.lang)
  document.documentElement.setAttribute('dir', currentDir)
}

export class LocaleService {
  static getLocale(): string {
    return current
  }

  static getMessages(): LocaleMessages {
    return getLocalePack(current) ?? getLocalePack(DEFAULT)!
  }

  /** Active document direction (not derived from locale). */
  static getDir(): TextDirection {
    return currentDir
  }

  /**
   * Set document / chrome reading direction independently of language pack.
   * `null` resets to `ltr` (legacy alias — does **not** follow locale meta).
   */
  static setDirection(dir: TextDirection | null): void {
    currentDir = dir ?? DEFAULT_DIR
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DIR_STORAGE_KEY, currentDir)
    }
    applyDocumentAttrs(current)
    notifyDir()
  }

  /** Flip between `ltr` and `rtl`. */
  static toggleDirection(): TextDirection {
    const next: TextDirection = currentDir === 'rtl' ? 'ltr' : 'rtl'
    LocaleService.setDirection(next)
    return next
  }

  static t(key: LocaleKey, params?: Record<string, string | number>, fallback?: string): string {
    const pack = LocaleService.getMessages()
    const raw = pack[key] ?? fallback ?? key
    return interpolate(resolvePlurals(raw, params, current), params)
  }

  static setLocale(code: string): void {
    const resolved = resolveLocaleCode(code) ?? code
    if (!getLocalePack(resolved)) return
    current = resolved
    applyDocumentAttrs(resolved)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, resolved)
    }
    notify()
  }

  static init(): void {
    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
    const fromQuery = params?.get('lang') ?? null
    const stored =
      typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    const candidate = fromQuery || stored || DEFAULT
    const resolved = resolveLocaleCode(candidate) ?? candidate
    const nextLocale =
      (getLocalePack(resolved) && resolved) || DEFAULT

    const fromDirQuery = parseDir(params?.get('dir'))
    const storedDir =
      typeof localStorage !== 'undefined'
        ? parseDir(localStorage.getItem(DIR_STORAGE_KEY))
        : null
    currentDir = fromDirQuery ?? storedDir ?? DEFAULT_DIR

    current = nextLocale
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, current)
      localStorage.setItem(DIR_STORAGE_KEY, currentDir)
    }
    applyDocumentAttrs(current)
    notify()
    notifyDir()
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
