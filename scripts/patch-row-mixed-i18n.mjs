import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.row.when':
    '24 栅格 Row / Col：混合跨度、偏移、嵌套、弹性列、push/pull 与对齐。',
  'example.doc.row.demo.basic': '交互栅格',
  'example.doc.row.demo.basicDesc': '切换跨度组合。',
  'example.doc.row.demo.mixed': '混合栅格',
  'example.doc.row.demo.mixedDesc':
    '仪表盘 / 侧栏 / 不等分 / 换行等多行混合布局，模拟真实页面分栏。',
  'example.doc.row.demo.offset': '偏移 offset',
  'example.doc.row.demo.offsetDesc': '用 offset 把列推到中间或留白，适合居中卡片、阶梯排版。',
  'example.doc.row.demo.nested': '嵌套栅格',
  'example.doc.row.demo.nestedDesc': 'Col 内再嵌套 Row，内外 gutter 可不同。',
  'example.doc.row.demo.flex': '弹性列 flex',
  'example.doc.row.demo.flexDesc': '两侧定宽，中间 Col flex 吃满剩余空间。',
  'example.doc.row.demo.pushPull': 'push / pull',
  'example.doc.row.demo.pushPullDesc': '视觉换位：push 右移、pull 左移（相对定位）。',
  'example.doc.row.demo.align': '对齐',
  'example.doc.row.demo.alignDesc': '切换 Row 的 justify / align，观察不等高列。',
  'example.doc.row.prop.gutter': '列间距（Token 或 spacing 倍数）',
  'example.doc.row.prop.align': '对齐与是否换行',
  'example.doc.row.prop.span': 'Col 跨度 1–24',
  'example.doc.row.prop.offset': '列前偏移格数',
  'example.doc.row.prop.pushPull': '相对定位左右挪动',
  'example.doc.row.prop.flex': '吃满剩余横向空间',
  'example.doc.row.sample.col': '跨度 {n}',
  'example.doc.row.sample.offset': 'span {span} · offset {offset}',
  'example.doc.row.sample.nestedOuter': '外层 Col · span {n}',
  'example.doc.row.sample.fixed': '定宽 {n}',
  'example.doc.row.sample.flexGrow': 'flex 弹性列',
  'example.doc.row.sample.push': 'push {n}',
  'example.doc.row.sample.pull': 'pull {n}',
  'example.doc.row.sample.preset.dashboard': '仪表盘',
  'example.doc.row.sample.preset.aside': '侧栏',
  'example.doc.row.sample.preset.uneven': '不等分',
  'example.doc.row.sample.preset.wrap': '换行'
}

const en = {
  'example.doc.row.when':
    '24-col Row / Col: mixed spans, offset, nest, flex, push/pull, and align.',
  'example.doc.row.demo.basic': 'Interactive grid',
  'example.doc.row.demo.basicDesc': 'Switch span presets.',
  'example.doc.row.demo.mixed': 'Mixed grid',
  'example.doc.row.demo.mixedDesc':
    'Dashboard / aside / uneven / wrap multi-row layouts for real page chrome.',
  'example.doc.row.demo.offset': 'Offset',
  'example.doc.row.demo.offsetDesc': 'Push columns with offset for centered cards and stepped layouts.',
  'example.doc.row.demo.nested': 'Nested grid',
  'example.doc.row.demo.nestedDesc': 'Nest Row inside Col; inner/outer gutters can differ.',
  'example.doc.row.demo.flex': 'Flex column',
  'example.doc.row.demo.flexDesc': 'Fixed sides; middle Col flex fills the rest.',
  'example.doc.row.demo.pushPull': 'push / pull',
  'example.doc.row.demo.pushPullDesc': 'Visual reorder via relative push/pull.',
  'example.doc.row.demo.align': 'Align',
  'example.doc.row.demo.alignDesc': 'Toggle Row justify / align with uneven heights.',
  'example.doc.row.prop.gutter': 'Column gap (token or spacing multiple)',
  'example.doc.row.prop.align': 'Align / justify / wrap',
  'example.doc.row.prop.span': 'Col span 1–24',
  'example.doc.row.prop.offset': 'Leading offset columns',
  'example.doc.row.prop.pushPull': 'Relative shift left/right',
  'example.doc.row.prop.flex': 'Grow to fill remaining width',
  'example.doc.row.sample.col': 'Span {n}',
  'example.doc.row.sample.offset': 'span {span} · offset {offset}',
  'example.doc.row.sample.nestedOuter': 'Outer Col · span {n}',
  'example.doc.row.sample.fixed': 'Fixed {n}',
  'example.doc.row.sample.flexGrow': 'flex grow',
  'example.doc.row.sample.push': 'push {n}',
  'example.doc.row.sample.pull': 'pull {n}',
  'example.doc.row.sample.preset.dashboard': 'Dashboard',
  'example.doc.row.sample.preset.aside': 'Aside',
  'example.doc.row.sample.preset.uneven': 'Uneven',
  'example.doc.row.sample.preset.wrap': 'Wrap'
}

const tw = {
  ...zh,
  'example.doc.row.when':
    '24 柵格 Row / Col：混合跨度、偏移、巢狀、彈性欄、push/pull 與對齊。',
  'example.doc.row.demo.mixed': '混合柵格',
  'example.doc.row.demo.mixedDesc':
    '儀表板 / 側欄 / 不等分 / 換行等多行混合版面，模擬真實頁面分欄。',
  'example.doc.row.demo.offset': '偏移 offset',
  'example.doc.row.demo.offsetDesc': '用 offset 把欄推到中間或留白，適合置中卡片、階梯排版。',
  'example.doc.row.demo.nested': '巢狀柵格',
  'example.doc.row.demo.nestedDesc': 'Col 內再巢狀 Row，內外 gutter 可不同。',
  'example.doc.row.demo.flex': '彈性欄 flex',
  'example.doc.row.demo.flexDesc': '兩側定寬，中間 Col flex 吃滿剩餘空間。',
  'example.doc.row.demo.align': '對齊',
  'example.doc.row.demo.alignDesc': '切換 Row 的 justify / align，觀察不等高欄。',
  'example.doc.row.sample.nestedOuter': '外層 Col · span {n}',
  'example.doc.row.sample.fixed': '定寬 {n}',
  'example.doc.row.sample.flexGrow': 'flex 彈性欄',
  'example.doc.row.sample.preset.dashboard': '儀表板',
  'example.doc.row.sample.preset.aside': '側欄',
  'example.doc.row.sample.preset.uneven': '不等分',
  'example.doc.row.sample.preset.wrap': '換行'
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
    const keyJson = JSON.stringify(k)
    const valJson = JSON.stringify(v)
    if (text.includes(keyJson)) {
      text = text.replace(
        new RegExp(`${keyJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*"[^"]*"`),
        `${keyJson}: ${valJson}`
      )
    } else {
      const before = text.slice(0, text.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      text = `${before}${needsComma ? ',\n' : '\n'}  ${keyJson}: ${valJson},\n${text.slice(text.lastIndexOf('}'))}`
    }
  }
  writeFileSync(file, text, 'utf8')
  console.log('patched', locale)
}
