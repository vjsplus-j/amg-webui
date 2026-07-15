/**
 * Patch dashboard shell-note i18n keys across 7 locales (UTF-8).
 * Usage: node scripts/patch-dashboard-shell-notes-i18n.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** @type {Record<string, Record<string, string>>} */
const patches = {
  'zh-CN': {
    'page.dashboard.notesTitle': '壳层约定（请先读）',
    'page.dashboard.note.purpose':
      '本页与七大专区仅供库作者本地调试，禁止当作对外 demo 部署；标准示例与 API 请写到 docs（VitePress）。',
    'page.dashboard.note.contextMenu':
      '已禁用浏览器右键菜单，避免误开「检查 / 另存为」干扰调试；库消费者应用不受影响。',
    'page.dashboard.note.tabsNav':
      '打开内容页或顶栏标签时，左侧对应分类菜单会自动展开并高亮；分类可手动收起，再次切入标签会重新展开。',
    'page.dashboard.note.structure':
      '改组件请动 packages/；调试路由与页面只在 example/；发包产物是 dist/，example-dist 仅本地冒烟不上线。'
  },
  'zh-TW': {
    'page.dashboard.notesTitle': '殼層約定（請先讀）',
    'page.dashboard.note.purpose':
      '本頁與七大專區僅供庫作者本機調試，禁止當作對外 demo 部署；標準範例與 API 請寫到 docs（VitePress）。',
    'page.dashboard.note.contextMenu':
      '已停用瀏覽器右鍵選單，避免誤開「檢查 / 另存」干擾調試；庫消費者應用不受影響。',
    'page.dashboard.note.tabsNav':
      '開啟內容頁或頂欄標籤時，左側對應分類選單會自動展開並高亮；分類可手動收起，再次切入標籤會重新展開。',
    'page.dashboard.note.structure':
      '改元件請動 packages/；調試路由與頁面只在 example/；發包產物是 dist/，example-dist 僅本機冒煙不上線。'
  },
  'en-US': {
    'page.dashboard.notesTitle': 'Shell conventions (read first)',
    'page.dashboard.note.purpose':
      'This page and the seven zones are for local library debugging only — never deploy example as the public demo. Ship standard samples and API docs via docs (VitePress).',
    'page.dashboard.note.contextMenu':
      'The browser context menu is disabled here so Inspect / Save-as does not interrupt debugging. Consumer apps are unaffected.',
    'page.dashboard.note.tabsNav':
      'Opening a content page or a top tab expands and highlights the matching sidebar category. You can collapse it manually; switching back to the tab expands it again.',
    'page.dashboard.note.structure':
      'Change components in packages/; keep debug routes/pages in example/; publish dist/ only — example-dist is local smoke, not for shipping.'
  },
  'ja-JP': {
    'page.dashboard.notesTitle': 'シェル規約（先に読む）',
    'page.dashboard.note.purpose':
      '本ページと七つのゾーンはライブラリ作者のローカルデバッグ専用です。example を公開デモとしてデプロイしないでください。標準サンプルと API は docs（VitePress）へ。',
    'page.dashboard.note.contextMenu':
      'ブラウザの右クリックメニューは無効です（検証 / 名前を付けて保存の誤操作防止）。消費アプリには影響しません。',
    'page.dashboard.note.tabsNav':
      'コンテンツページや上部タブを開くと、対応するサイドバー分類が展開・強調されます。手動で閉じても、タブ再選択で再び開きます。',
    'page.dashboard.note.structure':
      'コンポーネント変更は packages/、デバッグ導線は example/ のみ。公開成果物は dist/。example-dist はローカル確認用で未公開。'
  },
  'ko-KR': {
    'page.dashboard.notesTitle': '셸 규칙 (먼저 읽기)',
    'page.dashboard.note.purpose':
      '이 페이지와 일곱 구역은 라이브러리 작성자용 로컬 디버그 전용입니다. play를 공개 데모로 배포하지 마세요. 표준 샘플·API는 docs(VitePress)에 작성합니다.',
    'page.dashboard.note.contextMenu':
      '브라우저 우클릭 메뉴는 비활성화되어 있습니다(검사/다른 이름으로 저장 방해 방지). 소비자 앱에는 영향 없습니다.',
    'page.dashboard.note.tabsNav':
      '콘텐츠 페이지나 상단 탭을 열면 대응하는 사이드바 분류가 펼쳐지고 강조됩니다. 수동으로 접어도 탭을 다시 열면 다시 펼쳐집니다.',
    'page.dashboard.note.structure':
      '컴포넌트 수정은 packages/, 디버그 라우트·페이지는 example/만. 배포물은 dist/, example-dist는 로컬 스모크용이며 배포하지 않습니다.'
  },
  'ko-KP': {
    'page.dashboard.notesTitle': '셸 약속 (먼저 읽기)',
    'page.dashboard.note.purpose':
      '이 페지와 일곱 구역은 서고 작성자용 국부 조률 전용입니다. play를 공개 데모로 배포하지 마십시오. 표준 본보기·API는 docs(VitePress)에 쓰십시오.',
    'page.dashboard.note.contextMenu':
      '브라우저 오른쪽찰칵 차림표는 꺼져 있습니다(검사/다른 이름으로 보관 방해 방지). 소비자 프로그람에는 영향 없습니다.',
    'page.dashboard.note.tabsNav':
      '내용 페지나 웃단 표를 열면 대응하는 결창 분류가 펼쳐지고 강조됩니다. 수동으로 접어도 표를 다시 열면 다시 펼쳐집니다.',
    'page.dashboard.note.structure':
      '부품 수정은 packages/, 조률 경로·페지는 example/만. 배포물은 dist/, example-dist는 국부 확인용이며 배포하지 않습니다.'
  },
  'ru-RU': {
    'page.dashboard.notesTitle': 'Правила оболочки (прочитать сначала)',
    'page.dashboard.note.purpose':
      'Эта страница и семь зон — только для локальной отладки авторами библиотеки. Не деплойте example как публичное демо. Публичные примеры и API — в docs (VitePress).',
    'page.dashboard.note.contextMenu':
      'Контекстное меню браузера отключено, чтобы Inspect / «Сохранить как» не мешали отладке. Приложения потребителей не затрагиваются.',
    'page.dashboard.note.tabsNav':
      'При открытии страницы или верхней вкладки раскрывается и подсвечивается соответствующая категория сайдбара. Можно свернуть вручную; повторный выбор вкладки снова раскроет её.',
    'page.dashboard.note.structure':
      'Компоненты меняйте в packages/; отладочные маршруты/страницы — только в example/; публикуйте dist/. example-dist — локальный smoke, не для публикации.'
  }
}

for (const [loc, entries] of Object.entries(patches)) {
  const file = path.join(root, 'packages/locale', loc, 'page.ts')
  let text = fs.readFileSync(file, 'utf8')

  text = text.replace(/\n\s*'page\.dashboard\.notesTitle':\s*'[^']*',?/g, '')
  text = text.replace(/\n\s*'page\.dashboard\.note\.[^']+':\s*'[^']*',?/g, '')

  const lines = Object.entries(entries).map(([k, v]) => {
    const escaped = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    return `  '${k}': '${escaped}',`
  })

  const insertAfter = text.indexOf("'page.dashboard.msg':")
  if (insertAfter < 0) throw new Error(`Missing msg in ${file}`)
  const lineEnd = text.indexOf('\n', insertAfter)
  text = text.slice(0, lineEnd + 1) + lines.join('\n') + '\n' + text.slice(lineEnd + 1)
  fs.writeFileSync(file, text, 'utf8')
  console.log(loc, 'ok')
}
