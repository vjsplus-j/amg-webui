import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = join(root, 'packages/locale')

const values = {
  'zh-CN': '打开文档',
  'zh-TW': '開啟文件',
  'en-US': 'Open docs',
  'ja-JP': 'ドキュメントを開く',
  'ko-KR': '문서 열기',
  'ko-KP': '문서 열기',
  'ru-RU': 'Открыть документацию'
}

const labKeys = {
  'zh-CN': {
    'example.doc.layoutLab.section.primitives': 'Stack · Flow · Column · CardGrid',
    'example.doc.layoutLab.section.misc': 'Container · Center · Block · Embed · Scale · Fixed · Form',
    'example.doc.layoutLab.stackH': '横向堆叠',
    'example.doc.layoutLab.stackV': '纵向堆叠',
    'example.doc.layoutLab.colN': '{n} 列',
    'example.doc.layoutLab.tagMinus': '减少标签',
    'example.doc.layoutLab.tagPlus': '增加标签'
  },
  'en-US': {
    'example.doc.layoutLab.section.primitives': 'Stack · Flow · Column · CardGrid',
    'example.doc.layoutLab.section.misc': 'Container · Center · Block · Embed · Scale · Fixed · Form',
    'example.doc.layoutLab.stackH': 'Stack horizontal',
    'example.doc.layoutLab.stackV': 'Stack vertical',
    'example.doc.layoutLab.colN': '{n} cols',
    'example.doc.layoutLab.tagMinus': 'Fewer tags',
    'example.doc.layoutLab.tagPlus': 'More tags'
  }
}

for (const locale of readdirSync(localeRoot).filter((d) => !d.includes('.'))) {
  const pageFile = join(localeRoot, locale, 'page.ts')
  try {
    let page = readFileSync(pageFile, 'utf8')
    if (!page.includes('"page.gallery.openDoc"') && !page.includes("'page.gallery.openDoc'")) {
      const before = page.slice(0, page.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      const line = `  'page.gallery.openDoc': ${JSON.stringify(values[locale] ?? values['en-US'])},`
      page = before + (needsComma ? ',\n' : '\n') + line + '\n' + page.slice(page.lastIndexOf('}'))
      writeFileSync(pageFile, page, 'utf8')
      console.log('page', locale)
    }
  } catch {
    /* skip */
  }

  const docFile = join(localeRoot, locale, 'exampleDoc.ts')
  try {
    let doc = readFileSync(docFile, 'utf8')
    const pack = locale === 'zh-CN' || locale === 'zh-TW' ? labKeys['zh-CN'] : labKeys['en-US']
    const tw = locale === 'zh-TW'
      ? {
          'example.doc.layoutLab.stackH': '橫向堆疊',
          'example.doc.layoutLab.stackV': '縱向堆疊',
          'example.doc.layoutLab.colN': '{n} 欄',
          'example.doc.layoutLab.tagMinus': '減少標籤',
          'example.doc.layoutLab.tagPlus': '增加標籤'
        }
      : {}
    const map = { ...pack, ...tw }
    const missing = Object.entries(map).filter(([k]) => !doc.includes(`"${k}"`))
    if (missing.length) {
      const insert = missing.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')
      const before = doc.slice(0, doc.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      doc = before + (needsComma ? ',\n' : '\n') + insert + '\n' + doc.slice(doc.lastIndexOf('}'))
      writeFileSync(docFile, doc, 'utf8')
      console.log('doc', locale, missing.length)
    }
  } catch {
    /* skip */
  }
}
