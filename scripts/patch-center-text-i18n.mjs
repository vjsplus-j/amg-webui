import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.center.sample.body': '居中内容',
  'example.doc.center.sample.bodyState': '{axis} · {flush}'
}

const en = {
  'example.doc.center.sample.body': 'Centered content',
  'example.doc.center.sample.bodyState': '{axis} · {flush}'
}

const tw = {
  'example.doc.center.sample.body': '置中內容',
  'example.doc.center.sample.bodyState': '{axis} · {flush}'
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
