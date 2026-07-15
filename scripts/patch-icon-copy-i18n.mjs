import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const patches = {
  'zh-CN': {
    browserDesc:
      '精选 500 个 Lucide 图标，按 14 类筛选与搜索；点击复制 `<Icon name="…" />`。',
    when:
      '图标用于表达操作与状态。本库精选约 500 个 Lucide 图标（14 类），name 使用 PascalCase（如 Settings）。支持尺寸、颜色、旋转/翻转、spin/pulse、禁用与 loading。'
  },
  'zh-TW': {
    browserDesc:
      '精選 500 個 Lucide 圖示，按 14 類篩選與搜尋；點擊複製 `<Icon name="…" />`。',
    when:
      '圖示用於表達操作與狀態。本庫精選約 500 個 Lucide 圖示（14 類），name 使用 PascalCase（如 Settings）。支援尺寸、顏色、旋轉/翻轉、spin/pulse、停用與 loading。'
  },
  'en-US': {
    browserDesc:
      'Browse 500 curated Lucide icons across 14 categories; click to copy `<Icon name="…" />`.',
    when:
      'Icons communicate actions and status. AMG ships ~500 curated Lucide glyphs in 14 categories; use PascalCase names (e.g. Settings). Supports size, color, rotate/flip, spin/pulse, disabled, and loading.'
  },
  'ja-JP': {
    browserDesc:
      '精選 500 個の Lucide アイコンを 14 カテゴリで検索。クリックで `<Icon name="…" />` をコピー。',
    when:
      'アイコンは操作や状態を表します。約 500 個の Lucide（14 カテゴリ）、PascalCase 名（例: Settings）。サイズ・色・回転/反転・spin/pulse・disabled・loading に対応。'
  },
  'ko-KR': {
    browserDesc:
      '14개 분류의 Lucide 아이콘 500개를 검색하고, 클릭해 `<Icon name="…" />`를 복사합니다.',
    when:
      '아이콘은 동작과 상태를 나타냅니다. Lucide 기반 약 500개(14분류), PascalCase 이름(예: Settings). 크기·색·회전/뒤집기·spin/pulse·비활성·loading 지원.'
  },
  'ko-KP': {
    browserDesc:
      '14개 분류의 Lucide 아이콘 500개를 검색하고, 찰칵하여 `<Icon name="…" />`를 복사합니다.',
    when:
      '아이콘은 동작과 상태를 나타냅니다. Lucide 기초 약 500개(14분류), PascalCase 이름(례: Settings). 크기·색·회전/뒤집기·spin/pulse·비활성·loading 지원.'
  },
  'ru-RU': {
    browserDesc:
      '500 курируемых иконок Lucide в 14 категориях; клик копирует `<Icon name="…" />`.',
    when:
      'Иконки обозначают действия и статусы. ~500 глифов Lucide в 14 категориях, имена PascalCase (напр. Settings). Поддерживаются размер, цвет, поворот/отражение, spin/pulse, disabled и loading.'
  }
}

for (const [loc, p] of Object.entries(patches)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let text = fs.readFileSync(file, 'utf8')
  text = text.replace(
    /"example\.doc\.icon\.demo\.browserDesc":\s*"(?:\\.|[^"\\])*"/,
    `"example.doc.icon.demo.browserDesc": ${JSON.stringify(p.browserDesc)}`
  )
  text = text.replace(
    /"example\.doc\.icon\.when":\s*"(?:\\.|[^"\\])*"/,
    `"example.doc.icon.when": ${JSON.stringify(p.when)}`
  )
  fs.writeFileSync(file, text, 'utf8')
  console.log(loc)
}
