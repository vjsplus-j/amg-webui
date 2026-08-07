/**
 * Register example.doc.* locale overlays (kept out of the published library bundle).
 */
import {
  extendLocaleMessages,
  type LocaleCode
} from '@amg-webui/locale'
import zhCN from '../../packages/locale/zh-CN/exampleDoc'
import zhHK from '../../packages/locale/zh-HK/exampleDoc'
import enUS from '../../packages/locale/en-US/exampleDoc'
import jaJP from '../../packages/locale/ja-JP/exampleDoc'
import koKR from '../../packages/locale/ko-KR/exampleDoc'
import koKP from '../../packages/locale/ko-KP/exampleDoc'
import ruRU from '../../packages/locale/ru-RU/exampleDoc'
import arSA from '../../packages/locale/ar-SA/exampleDoc'
import hiIN from '../../packages/locale/hi-IN/exampleDoc'
import ugCN from '../../packages/locale/ug-CN/exampleDoc'

const packs: Record<LocaleCode, Record<string, string>> = {
  'zh-CN': zhCN as Record<string, string>,
  'zh-HK': zhHK as Record<string, string>,
  'en-US': enUS as Record<string, string>,
  'ja-JP': jaJP as Record<string, string>,
  'ko-KR': koKR as Record<string, string>,
  'ko-KP': koKP as Record<string, string>,
  'ru-RU': ruRU as Record<string, string>,
  'ar-SA': arSA as Record<string, string>,
  'hi-IN': hiIN as Record<string, string>,
  'ug-CN': ugCN as Record<string, string>
}

export function registerExampleDocLocales(): void {
  for (const [code, messages] of Object.entries(packs) as Array<
    [LocaleCode, Record<string, string>]
  >) {
    extendLocaleMessages(code, messages)
  }
}
