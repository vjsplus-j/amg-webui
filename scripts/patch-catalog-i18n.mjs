import fs from 'node:fs'
import path from 'node:path'

const inserts = {
  'zh-CN': null, // already updated
  'zh-TW': {
    lead: '全部 base 元件按 8 類列出（側欄預設可展開查看）；點名稱進入文件頁。未深化的元件仍可探針掛載。',
    visible: '目前可見 {count} 個元件',
    filter: '篩選元件'
  },
  'en-US': {
    lead: 'All base components listed in 8 categories (sidebar expands by default). Click a name to open its doc page; uncurated components still mount via fallback.',
    visible: '{count} components visible',
    filter: 'Filter components'
  },
  'ja-JP': {
    lead: 'base コンポーネントを 8 分類で一覧表示（サイドバーは既定で展開）。名前をクリックしてドキュメントへ。未整備コンポーネントもフォールバック表示できます。',
    visible: '表示中 {count} 件',
    filter: 'コンポーネント検索'
  },
  'ko-KR': {
    lead: 'base 컴포넌트를 8개 분류로 모두 나열합니다(사이드바 기본 펼침). 이름을 누르면 문서 페이지로 이동합니다.',
    visible: '표시 중 {count}개',
    filter: '컴포넌트 필터'
  },
  'ko-KP': {
    lead: 'base 컴포넌트를 8개 분류로 모두 나열합니다(사이드바 기본 펼침). 이름을 누르면 문서 페이지로 이동합니다.',
    visible: '표시 중 {count}개',
    filter: '컴포넌트 필터'
  },
  'ru-RU': {
    lead: 'Все base-компоненты в 8 категориях (боковая панель развёрнута по умолчанию). Клик по имени открывает страницу документа.',
    visible: 'Видно компонентов: {count}',
    filter: 'Фильтр компонентов'
  }
}

for (const [loc, pack] of Object.entries(inserts)) {
  if (!pack) continue
  const file = path.join('packages', 'locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  if (s.includes('example.doc.catalog.visibleCount')) {
    console.log(loc, 'skip')
    continue
  }
  // update lead if present
  s = s.replace(
    /'page\.base\.catalog\.lead':\s*\n?\s*(['"`])[\s\S]*?\1,/,
    `'page.base.catalog.lead':\n    ${JSON.stringify(pack.lead)},`
  )
  if (!s.includes("'page.base.catalog.lead'")) {
    // try single-line
    s = s.replace(
      /'page\.base\.catalog\.lead':\s*[^,\n]+,/,
      `'page.base.catalog.lead': ${JSON.stringify(pack.lead)},`
    )
  }
  const block = `
  'example.doc.catalog.visibleCount': ${JSON.stringify(pack.visible)},
  'example.doc.catalog.navFilter': ${JSON.stringify(pack.filter)},
`
  if (s.includes("'example.doc.whenToUse'")) {
    s = s.replace("'example.doc.whenToUse'", `${block}  'example.doc.whenToUse'`)
  } else {
    s = s.replace(/export default \{/, `export default {${block}`)
  }
  fs.writeFileSync(file, s)
  console.log(loc, 'ok')
}
