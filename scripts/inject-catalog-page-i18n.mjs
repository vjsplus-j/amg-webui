import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']
const entries = {
  'zh-CN': { title: '基础 · 全量目录', lead: '266 个 base 组件检索与预览；半成品亦可调试。' },
  'zh-TW': { title: '基礎 · 全量目錄', lead: '266 個 base 元件檢索與預覽；半成品亦可調試。' },
  'en-US': { title: 'Base · Full catalog', lead: 'Search and preview all 266 base components.' },
  'ja-JP': { title: '基本 · 全量カタログ', lead: '266 個の base コンポーネントを検索・プレビュー。' },
  'ko-KR': { title: '기본 · 전체 목록', lead: '266개 base 컴포넌트 검색 및 미리보기.' },
  'ko-KP': { title: '기본 · 전체 목록', lead: '266개 base 구성요소 검색 및 미리보기.' },
  'ru-RU': { title: 'База · Каталог', lead: 'Поиск и превью всех 266 base-компонентов.' }
}

for (const code of locales) {
  const f = resolve(root, 'packages/locale', code, 'page.ts')
  let s = readFileSync(f, 'utf8')
  if (s.includes('page.base.catalog.title')) {
    console.log('skip', code)
    continue
  }
  const e = entries[code]
  s = s.replace(
    "'page.base.thirdParty.title':",
    `'page.base.catalog.title': '${e.title}',\n  'page.base.thirdParty.title':`
  )
  if (s.includes("'page.base.thirdParty.lead'")) {
    s = s.replace(
      "'page.base.thirdParty.lead':",
      `'page.base.catalog.lead': '${e.lead.replace(/'/g, "\\'")}',\n  'page.base.thirdParty.lead':`
    )
  }
  writeFileSync(f, s, 'utf8')
  console.log('patched', code)
}
