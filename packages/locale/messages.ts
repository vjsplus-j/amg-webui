import zhCN from './zh-CN'
import zhTW from './zh-TW'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import koKP from './ko-KP'
import ruRU from './ru-RU'
import arSA from './ar-SA'
import type { LocaleKey, LocaleMessages } from './message-schema'

export type { LocaleKey, LocaleMessages } from './message-schema'

export type LocaleCode =
  | 'zh-CN'
  | 'zh-TW'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'ko-KP'
  | 'ru-RU'
  | 'ar-SA'

export type TextDirection = 'ltr' | 'rtl'

export interface LocaleMeta {
  /** Native label for language pickers (not translated) */
  label: string
  /** BCP 47 / HTML lang */
  lang: string
  dir: TextDirection
}

export const locales = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'ko-KP': koKP,
  'ru-RU': ruRU,
  'ar-SA': arSA
} as Record<LocaleCode, LocaleMessages>

export const LOCALE_CODES: LocaleCode[] = [
  'zh-CN',
  'zh-TW',
  'en-US',
  'ja-JP',
  'ko-KR',
  'ko-KP',
  'ru-RU',
  'ar-SA'
]

/** Native labels for language pickers (not translated) */
export const LOCALE_META: Record<LocaleCode, LocaleMeta> = {
  'zh-CN': { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
  'zh-TW': { label: '繁體中文', lang: 'zh-TW', dir: 'ltr' },
  'en-US': { label: 'English', lang: 'en', dir: 'ltr' },
  'ja-JP': { label: '日本語', lang: 'ja', dir: 'ltr' },
  'ko-KR': { label: '한국어', lang: 'ko', dir: 'ltr' },
  'ko-KP': { label: '조선어', lang: 'ko', dir: 'ltr' },
  'ru-RU': { label: 'Русский', lang: 'ru', dir: 'ltr' },
  'ar-SA': { label: 'العربية', lang: 'ar', dir: 'rtl' }
}

/** Runtime-registered packs (custom / remote). */
const customLocales = new Map<
  string,
  { messages: LocaleMessages; meta: LocaleMeta }
>()

export function getLocalePack(code: string): LocaleMessages | undefined {
  if (code in locales) return locales[code as LocaleCode]
  return customLocales.get(code)?.messages
}

export function getLocaleMeta(code: string): LocaleMeta | undefined {
  if (code in LOCALE_META) return LOCALE_META[code as LocaleCode]
  return customLocales.get(code)?.meta
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
