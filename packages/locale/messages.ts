import zhCN from './zh-CN'
import zhHK from './zh-HK'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import koKP from './ko-KP'
import ruRU from './ru-RU'
import arSA from './ar-SA'
import hiIN from './hi-IN'
import ugCN from './ug-CN'
import type { LocaleKey, LocaleMessages } from './message-schema'

export type { LocaleKey, LocaleMessages } from './message-schema'

export type LocaleCode =
  | 'zh-CN'
  | 'zh-HK'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'ko-KP'
  | 'ru-RU'
  | 'ar-SA'
  | 'hi-IN'
  | 'ug-CN'

export type TextDirection = 'ltr' | 'rtl'

export interface LocaleMeta {
  /** Native label for language pickers (not translated) */
  label: string
  /** BCP 47 / HTML lang */
  lang: string
  /**
   * Natural writing direction of the language script (hint only).
   * Does **not** drive `html[dir]` — use `LocaleService.setDirection` / `?dir=`.
   */
  dir: TextDirection
}

export const locales = {
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'ko-KP': koKP,
  'ru-RU': ruRU,
  'ar-SA': arSA,
  'hi-IN': hiIN,
  'ug-CN': ugCN
} as Record<LocaleCode, LocaleMessages>

export const LOCALE_CODES: LocaleCode[] = [
  'zh-CN',
  'zh-HK',
  'en-US',
  'hi-IN',
  'ja-JP',
  'ko-KR',
  'ko-KP',
  'ru-RU',
  'ar-SA',
  'ug-CN'
]

/** Native labels for language pickers (not translated) */
export const LOCALE_META: Record<LocaleCode, LocaleMeta> = {
  'zh-CN': { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
  'zh-HK': { label: '繁體中文（香港）', lang: 'zh-HK', dir: 'ltr' },
  'en-US': { label: 'English', lang: 'en', dir: 'ltr' },
  'hi-IN': { label: 'हिन्दी', lang: 'hi', dir: 'ltr' },
  'ja-JP': { label: '日本語', lang: 'ja', dir: 'ltr' },
  'ko-KR': { label: '한국어', lang: 'ko', dir: 'ltr' },
  'ko-KP': { label: '조선어', lang: 'ko', dir: 'ltr' },
  'ru-RU': { label: 'Русский', lang: 'ru', dir: 'ltr' },
  'ar-SA': { label: 'العربية', lang: 'ar', dir: 'rtl' },
  'ug-CN': { label: 'ئۇيغۇرچە', lang: 'ug', dir: 'rtl' }
}

/** Legacy codes remapped to current built-ins (storage / deep links). */
export const LOCALE_ALIASES: Record<string, LocaleCode> = {
  'zh-TW': 'zh-HK',
  'zh-HK': 'zh-HK'
}

/** Runtime-registered packs (custom / remote). */
const customLocales = new Map<
  string,
  { messages: LocaleMessages; meta: LocaleMeta }
>()

export function resolveLocaleCode(code: string | null | undefined): string | null {
  if (!code) return null
  if (code in LOCALE_ALIASES) return LOCALE_ALIASES[code]!
  return code
}

export function getLocalePack(code: string): LocaleMessages | undefined {
  const resolved = resolveLocaleCode(code) ?? code
  if (resolved in locales) return locales[resolved as LocaleCode]
  return customLocales.get(resolved)?.messages
}

export function getLocaleMeta(code: string): LocaleMeta | undefined {
  const resolved = resolveLocaleCode(code) ?? code
  if (resolved in LOCALE_META) return LOCALE_META[resolved as LocaleCode]
  return customLocales.get(resolved)?.meta
}

export function listLocaleCodes(): string[] {
  return [...LOCALE_CODES, ...customLocales.keys()]
}

/**
 * Register a custom / remote locale pack.
 * Messages must cover every LocaleKey (compile-time for built-ins; runtime checked here).
 */
export function registerLocale(
  code: string,
  messages: LocaleMessages,
  meta: LocaleMeta
): void {
  if (!code || code in locales) {
    throw new Error(`[locale] cannot register built-in or empty code: ${code}`)
  }
  customLocales.set(code, { messages, meta })
}

export function isLocaleKey(value: string): value is LocaleKey {
  return Object.prototype.hasOwnProperty.call(zhCN, value)
}
