import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.block.when': '语义块容器：外边距 / 内边距 / 边框 / 子项间距，页面分区。',
  'example.doc.block.demo.basic': '边距与边框',
  'example.doc.block.demo.basicDesc': '切换 bordered / padded / margin（外边距 Token）。',
  'example.doc.block.prop.flags': 'padded / bordered / gap',
  'example.doc.block.prop.margin': '外边距，映射 --spacing-* / --theme-section-gap；默认 none',
  'example.doc.block.sample.margin': '外边距 {m}'
}

const en = {
  'example.doc.block.when': 'Semantic block: margin / padding / border / child gap.',
  'example.doc.block.demo.basic': 'Margin, pad & border',
  'example.doc.block.demo.basicDesc': 'Toggle bordered / padded / margin (spacing tokens).',
  'example.doc.block.prop.flags': 'padded / bordered / gap',
  'example.doc.block.prop.margin': 'Outer margin via --spacing-* / --theme-section-gap; default none',
  'example.doc.block.sample.margin': 'margin {m}'
}

const tw = {
  ...zh,
  'example.doc.block.when': '語義塊容器：外邊距 / 內邊距 / 邊框 / 子項間距，頁面分區。',
  'example.doc.block.demo.basic': '邊距與邊框',
  'example.doc.block.demo.basicDesc': '切換 bordered / padded / margin（外邊距 Token）。',
  'example.doc.block.prop.margin': '外邊距，映射 --spacing-* / --theme-section-gap；預設 none',
  'example.doc.block.sample.margin': '外邊距 {m}'
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
    const re = new RegExp(`^(\\s*${JSON.stringify(k)}:\\s*)([\\s\\S]*?)(,)?$`, 'm')
    if (text.includes(`"${k}"`)) {
      text = text.replace(
        new RegExp(`"${k.replace(/\./g, '\\.')}":\\s*"[^"]*"`),
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
