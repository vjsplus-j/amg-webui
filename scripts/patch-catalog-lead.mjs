import { readFileSync, writeFileSync } from 'node:fs'

const map = {
  'zh-CN': '267 个 base 组件按专区同步演示；支持检索。',
  'zh-TW': '267 個 base 元件按專區同步演示；支援檢索。',
  'en-US': 'All 267 base components synced into play zones with search.',
  'ja-JP': '267 個の base コンポーネントを専区に同期。検索可。',
  'ko-KR': '267개 base 컴포넌트를 구역별로 동기화 · 검색 지원.',
  'ko-KP': '267개 base 구성요소를 구역별로 동기화 · 검색.',
  'ru-RU': 'Все 267 base-компонентов синхронизированы по зонам play.'
}

for (const code of Object.keys(map)) {
  const f = `packages/locale/${code}/page.ts`
  let s = readFileSync(f, 'utf8')
  s = s.replace(
    /'page\.base\.catalog\.lead':\s*'[^']*'/,
    `'page.base.catalog.lead': '${map[code].replace(/'/g, "\\'")}'`
  )
  writeFileSync(f, s)
  console.log(code)
}
