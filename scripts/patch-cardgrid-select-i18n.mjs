import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.cardGrid.prop.selected': 'Card.selected 选中态；selectable 可点击切换',
  'example.doc.cardGrid.sample.selectSingle': '单选',
  'example.doc.cardGrid.sample.selectMultiple': '多选',
  'example.doc.cardGrid.sample.clear': '清空',
  'example.doc.cardGrid.sample.selected': '已选：{list}',
  'example.doc.cardGrid.sample.noneSelected': '无',
  'example.doc.cardGrid.demo.basicDesc':
    '切换自适应/定列、单选/多选、轨道、间距、等高；选中卡片有强调描边与浅底。'
}

const en = {
  'example.doc.cardGrid.prop.selected': 'Card.selected visual; selectable enables click toggle',
  'example.doc.cardGrid.sample.selectSingle': 'Single',
  'example.doc.cardGrid.sample.selectMultiple': 'Multiple',
  'example.doc.cardGrid.sample.clear': 'Clear',
  'example.doc.cardGrid.sample.selected': 'Selected: {list}',
  'example.doc.cardGrid.sample.noneSelected': 'none',
  'example.doc.cardGrid.demo.basicDesc':
    'Toggle auto/fixed, single/multi select, track, gap, equal height; selected cards use accent stroke.'
}

const tw = {
  ...zh,
  'example.doc.cardGrid.prop.selected': 'Card.selected 選中態；selectable 可點擊切換',
  'example.doc.cardGrid.sample.selectSingle': '單選',
  'example.doc.cardGrid.sample.selectMultiple': '多選',
  'example.doc.cardGrid.sample.clear': '清空',
  'example.doc.cardGrid.sample.selected': '已選：{list}',
  'example.doc.cardGrid.sample.noneSelected': '無',
  'example.doc.cardGrid.demo.basicDesc':
    '切換自適應/定欄、單選/多選、軌道、間距、等高；選中卡片有強調描邊與淺底。'
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
      text = text.replace(new RegExp(`${keyJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*"[^"]*"`), `${keyJson}: ${valJson}`)
    } else {
      const before = text.slice(0, text.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      text = `${before}${needsComma ? ',\n' : '\n'}  ${keyJson}: ${valJson},\n${text.slice(text.lastIndexOf('}'))}`
    }
  }
  writeFileSync(file, text, 'utf8')
  console.log('patched', locale)
}
