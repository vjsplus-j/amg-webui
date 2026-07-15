import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']
const entries = {
  'zh-CN': { title: '基础 · 行业套件', lead: '404 / 视频 / ONVIF / GB28181 / VCR / 低代码画布调试。' },
  'zh-TW': { title: '基礎礎 · 行業套件', lead: '404 / 視頻 / ONVIF / GB28181 / VCR / 低代碼畫布調試。' },
  'en-US': { title: 'Base · Industry kits', lead: '404 / Video / ONVIF / GB28181 / VCR / low-code canvas debug.' },
  'ja-JP': { title: '基本 · 業界キット', lead: '404 / 動画 / ONVIF / GB28181 / VCR / ローコード確認。' },
  'ko-KR': { title: '기본 · 산업 키트', lead: '404 / 비디오 / ONVIF / GB28181 / VCR / 로우코드 디버그.' },
  'ko-KP': { title: '기본 · 산업 키트', lead: '404 / 동영상 / ONVIF / GB28181 / VCR / 저코드 디버그.' },
  'ru-RU': { title: 'База · Отраслевые наборы', lead: '404 / Видео / ONVIF / GB28181 / VCR / low-code отладка.' }
}

for (const code of locales) {
  const f = resolve(root, 'packages/locale', code, 'page.ts')
  let s = readFileSync(f, 'utf8')
  if (s.includes('page.base.industry.title')) continue
  const e = entries[code]
  s = s.replace(
    "'page.base.catalog.title':",
    `'page.base.industry.title': '${e.title}',\n  'page.base.catalog.title':`
  )
  if (s.includes("'page.base.catalog.lead'")) {
    s = s.replace(
      "'page.base.catalog.lead':",
      `'page.base.industry.lead': '${e.lead.replace(/'/g, "\\'")}',\n  'page.base.catalog.lead':`
    )
  }
  writeFileSync(f, s, 'utf8')
  console.log('patched', code)
}
