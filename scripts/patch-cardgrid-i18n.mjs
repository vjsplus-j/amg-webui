import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.cardGrid.when':
    '卡片网格：自适应 auto-fill/fit，或固定列数；默认等高，适合仪表盘与资源列表。',
  'example.doc.cardGrid.demo.basic': '交互网格',
  'example.doc.cardGrid.demo.basicDesc':
    '切换自适应/定列、轨道、间距、等高；点击卡片有回显。故意混入长短文案以验证等高。',
  'example.doc.cardGrid.demo.fixed': '固定三列',
  'example.doc.cardGrid.demo.fixedDesc': 'columns=3，忽略 minTrack。',
  'example.doc.cardGrid.prop.columns': '固定列数 1–6；设置后走等分栅格',
  'example.doc.cardGrid.prop.minTrack': '自适应模式下的最小轨道宽度档',
  'example.doc.cardGrid.prop.fit': 'auto-fill 保留空轨 / auto-fit 收起空轨',
  'example.doc.cardGrid.prop.gap': '卡片间距（含 section）',
  'example.doc.cardGrid.prop.equalHeight': '同一行卡片等高拉伸',
  'example.doc.cardGrid.sample.card': '卡片 {n}',
  'example.doc.cardGrid.sample.title': '卡片 {n}',
  'example.doc.cardGrid.sample.body': '摘要内容 {n}',
  'example.doc.cardGrid.sample.bodyLong':
    '较长摘要：用于验证 equalHeight —— 同行卡片应拉齐高度。条目 {n}。',
  'example.doc.cardGrid.sample.modeAuto': '自适应',
  'example.doc.cardGrid.sample.modeFixed': '定列',
  'example.doc.cardGrid.sample.track': '轨道 {s}',
  'example.doc.cardGrid.sample.cols': '{n} 列',
  'example.doc.cardGrid.sample.count': '{n} 张',
  'example.doc.cardGrid.sample.equalHeight': '等高',
  'example.doc.cardGrid.sample.clicked': '点击了卡片 {n}',
  'example.doc.cardGrid.sample.fitFill': 'auto-fill',
  'example.doc.cardGrid.sample.fitFit': 'auto-fit'
}

const en = {
  'example.doc.cardGrid.when':
    'Card grid: auto-fill/fit or fixed columns; equal-height by default for dashboards.',
  'example.doc.cardGrid.demo.basic': 'Interactive grid',
  'example.doc.cardGrid.demo.basicDesc':
    'Toggle auto/fixed, track, gap, equal height; card click echoes. Mixed body lengths test stretch.',
  'example.doc.cardGrid.demo.fixed': 'Fixed 3 columns',
  'example.doc.cardGrid.demo.fixedDesc': 'columns=3; minTrack ignored.',
  'example.doc.cardGrid.prop.columns': 'Fixed columns 1–6; equal fr tracks',
  'example.doc.cardGrid.prop.minTrack': 'Min track tier in auto mode',
  'example.doc.cardGrid.prop.fit': 'auto-fill keeps empty tracks / auto-fit collapses them',
  'example.doc.cardGrid.prop.gap': 'Card gap (includes section)',
  'example.doc.cardGrid.prop.equalHeight': 'Stretch cards to equal row height',
  'example.doc.cardGrid.sample.card': 'Card {n}',
  'example.doc.cardGrid.sample.title': 'Card {n}',
  'example.doc.cardGrid.sample.body': 'Summary {n}',
  'example.doc.cardGrid.sample.bodyLong':
    'Longer summary to verify equalHeight — peers in the row should match height. Item {n}.',
  'example.doc.cardGrid.sample.modeAuto': 'Auto',
  'example.doc.cardGrid.sample.modeFixed': 'Fixed',
  'example.doc.cardGrid.sample.track': 'Track {s}',
  'example.doc.cardGrid.sample.cols': '{n} cols',
  'example.doc.cardGrid.sample.count': '{n} cards',
  'example.doc.cardGrid.sample.equalHeight': 'Equal height',
  'example.doc.cardGrid.sample.clicked': 'Clicked card {n}',
  'example.doc.cardGrid.sample.fitFill': 'auto-fill',
  'example.doc.cardGrid.sample.fitFit': 'auto-fit'
}

const tw = {
  ...zh,
  'example.doc.cardGrid.when':
    '卡片網格：自適應 auto-fill/fit，或固定欄數；預設等高，適合儀表板與資源列表。',
  'example.doc.cardGrid.demo.basic': '互動網格',
  'example.doc.cardGrid.demo.basicDesc':
    '切換自適應/定欄、軌道、間距、等高；點擊卡片有回顯。混入長短文案以驗證等高。',
  'example.doc.cardGrid.demo.fixed': '固定三欄',
  'example.doc.cardGrid.demo.fixedDesc': 'columns=3，忽略 minTrack。',
  'example.doc.cardGrid.prop.columns': '固定欄數 1–6；設定後走等分柵格',
  'example.doc.cardGrid.prop.minTrack': '自適應模式下的最小軌道寬度檔',
  'example.doc.cardGrid.prop.fit': 'auto-fill 保留空軌 / auto-fit 收起空軌',
  'example.doc.cardGrid.prop.gap': '卡片間距（含 section）',
  'example.doc.cardGrid.prop.equalHeight': '同一行卡片等高拉伸',
  'example.doc.cardGrid.sample.body': '摘要內容 {n}',
  'example.doc.cardGrid.sample.bodyLong':
    '較長摘要：用於驗證 equalHeight —— 同行卡片應拉齊高度。條目 {n}。',
  'example.doc.cardGrid.sample.modeAuto': '自適應',
  'example.doc.cardGrid.sample.modeFixed': '定欄',
  'example.doc.cardGrid.sample.track': '軌道 {s}',
  'example.doc.cardGrid.sample.cols': '{n} 欄',
  'example.doc.cardGrid.sample.count': '{n} 張',
  'example.doc.cardGrid.sample.equalHeight': '等高',
  'example.doc.cardGrid.sample.clicked': '點擊了卡片 {n}',
  'example.doc.cardGrid.sample.fitFill': 'auto-fill',
  'example.doc.cardGrid.sample.fitFit': 'auto-fit'
}

const packs = {
  'zh-CN': zh,
  'zh-TW': tw,
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en
}

for (const locale of readdirSync(localeRoot)) {
  const map = packs[locale]
  if (!map) continue
  const file = join(localeRoot, locale, 'exampleDoc.ts')
  let text = readFileSync(file, 'utf8')
  for (const [k, v] of Object.entries(map)) {
    if (text.includes(`"${k}"`)) {
      text = text.replace(
        new RegExp(`"${k.replace(/\./g, '\\\\.')}":\\s*"[^"]*"`),
        `${JSON.stringify(k)}: ${JSON.stringify(v)}`
      )
    } else {
      const before = text.slice(0, text.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      text =
        before +
        (needsComma ? ',\n' : '\n') +
        `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n` +
        text.slice(text.lastIndexOf('}'))
    }
  }
  writeFileSync(file, text, 'utf8')
  console.log('patched', locale)
}
