import zhCN from './zh-CN'
import zhTW from './zh-TW'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import koKP from './ko-KP'
import ruRU from './ru-RU'

export type LocaleCode =
  | 'zh-CN'
  | 'zh-TW'
  | 'en-US'
  | 'ja-JP'
  | 'ko-KR'
  | 'ko-KP'
  | 'ru-RU'

export type LocaleMessages = Record<string, string>

export const locales: Record<LocaleCode, LocaleMessages> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'ko-KP': koKP,
  'ru-RU': ruRU
}

export const LOCALE_CODES: LocaleCode[] = [
  'zh-CN',
  'zh-TW',
  'en-US',
  'ja-JP',
  'ko-KR',
  'ko-KP',
  'ru-RU'
]

/** Native labels for language pickers (not translated) */
export const LOCALE_META: Record<
  LocaleCode,
  { label: string; lang: string; dir: 'ltr' | 'rtl' }
> = {
  'zh-CN': { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
  'zh-TW': { label: '繁體中文', lang: 'zh-TW', dir: 'ltr' },
  'en-US': { label: 'English', lang: 'en', dir: 'ltr' },
  'ja-JP': { label: '日本語', lang: 'ja', dir: 'ltr' },
  'ko-KR': { label: '한국어', lang: 'ko', dir: 'ltr' },
  'ko-KP': { label: '조선어', lang: 'ko', dir: 'ltr' },
  'ru-RU': { label: 'Русский', lang: 'ru', dir: 'ltr' }
}
