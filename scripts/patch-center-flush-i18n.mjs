import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.center.demo.basicDesc':
    '切换轴向与是否贴边；不贴边时在贴边方向留出 --spacing-lg。',
  'example.doc.center.prop.flush': '是否贴边；false 时用 --spacing-lg 做内边距',
  'example.doc.center.sample.flushOn': '贴边',
  'example.doc.center.sample.flushOff': '留白'
}

const en = {
  'example.doc.center.demo.basicDesc':
    'Toggle axis and flush; when not flush, inset with --spacing-lg on the edge side(s).',
  'example.doc.center.prop.flush': 'Stick to edge; false insets with --spacing-lg',
  'example.doc.center.sample.flushOn': 'Flush',
  'example.doc.center.sample.flushOff': 'Inset'
}

const tw = {
  'example.doc.center.demo.basicDesc':
    '切換方向與是否貼邊；不貼邊時在貼邊方向留出 --spacing-lg。',
  'example.doc.center.prop.flush': '是否貼邊；false 時用 --spacing-lg 做內邊距',
  'example.doc.center.sample.flushOn': '貼邊',
  'example.doc.center.sample.flushOff': '留白'
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
