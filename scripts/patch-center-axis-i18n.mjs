import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.center.when': '单轴或双轴居中，含上居中 / 下居中，空态 / 启动页 / 对话框体。',
  'example.doc.center.demo.basicDesc': 'both / horizontal / vertical / top（上居中）/ bottom（下居中）。',
  'example.doc.center.prop.axis':
    'both 双轴 · horizontal 水平 · vertical 垂直 · top 上居中 · bottom 下居中',
  'example.doc.center.sample.axis.both': '双轴',
  'example.doc.center.sample.axis.horizontal': '水平',
  'example.doc.center.sample.axis.vertical': '垂直',
  'example.doc.center.sample.axis.top': '上居中',
  'example.doc.center.sample.axis.bottom': '下居中'
}

const en = {
  'example.doc.center.when':
    'Axis centering including top-center / bottom-center for empty / splash / dialog bodies.',
  'example.doc.center.demo.basicDesc': 'both / horizontal / vertical / top / bottom.',
  'example.doc.center.prop.axis':
    'both · horizontal · vertical · top (top-center) · bottom (bottom-center)',
  'example.doc.center.sample.axis.both': 'Both',
  'example.doc.center.sample.axis.horizontal': 'Horizontal',
  'example.doc.center.sample.axis.vertical': 'Vertical',
  'example.doc.center.sample.axis.top': 'Top',
  'example.doc.center.sample.axis.bottom': 'Bottom'
}

const tw = {
  ...zh,
  'example.doc.center.when': '單軸或雙軸置中，含上置中 / 下置中，空態 / 啟動頁 / 對話框體。',
  'example.doc.center.demo.basicDesc': 'both / horizontal / vertical / top（上置中）/ bottom（下置中）。',
  'example.doc.center.prop.axis':
    'both 雙軸 · horizontal 水平 · vertical 垂直 · top 上置中 · bottom 下置中',
  'example.doc.center.sample.axis.both': '雙軸',
  'example.doc.center.sample.axis.horizontal': '水平',
  'example.doc.center.sample.axis.vertical': '垂直',
  'example.doc.center.sample.axis.top': '上置中',
  'example.doc.center.sample.axis.bottom': '下置中'
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
