#!/usr/bin/env node
/** Remove unused LocaleKeys imports and leftover *Rows API blocks after inline API strip. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const demosDir = path.join(__dirname, '..', 'example', 'demos')

function walkDemos() {
  return fs
    .readdirSync(demosDir)
    .filter((d) => !d.startsWith('_') && fs.statSync(path.join(demosDir, d)).isDirectory())
    .map((d) => path.join(demosDir, d, 'index.vue'))
    .filter((p) => fs.existsSync(p))
}

function removeRowBlocks(src) {
  for (const name of ['propRows', 'eventRows', 'slotRows', 'panePropRows', 'paneSlotRows', 'itemPropRows', 'itemSlotRows']) {
    const marker = `const ${name} = computed`
    let idx = src.indexOf(marker)
    while (idx !== -1) {
      const lineStart = src.lastIndexOf('\n', idx) + 1
      const afterMarker = src.indexOf('(() => [', idx)
      if (afterMarker === -1 || afterMarker > idx + 80) break
      let i = afterMarker + '(() => ['.length - 1
      let depth = 0
      for (; i < src.length; i++) {
        const ch = src[i]
        if (ch === '[') depth++
        else if (ch === ']') {
          depth--
          if (depth === 0) {
            i++
            while (i < src.length && /[\s)]/.test(src[i])) i++
            break
          }
        }
      }
      let removeEnd = i
      if (src[removeEnd] === '\r') removeEnd++
      if (src[removeEnd] === '\n') removeEnd++
      src = src.slice(0, lineStart) + src.slice(removeEnd)
      idx = src.indexOf(marker, lineStart)
    }
    const typedMarker = `const ${name}: PropRow[]`
    const typedMarker2 = `const ${name}: ApiRow[]`
    for (const tm of [typedMarker, typedMarker2]) {
      idx = src.indexOf(tm)
      if (idx === -1) continue
      const lineStart = src.lastIndexOf('\n', idx) + 1
      const bracket = src.indexOf('[', idx)
      if (bracket === -1) continue
      let i = bracket
      let depth = 0
      for (; i < src.length; i++) {
        const ch = src[i]
        if (ch === '[') depth++
        else if (ch === ']') {
          depth--
          if (depth === 0) {
            i++
            break
          }
        }
      }
      let removeEnd = i
      if (src[removeEnd] === '\r') removeEnd++
      if (src[removeEnd] === '\n') removeEnd++
      src = src.slice(0, lineStart) + src.slice(removeEnd)
    }
  }
  return src
}

function cleanup(src) {
  let out = removeRowBlocks(src)
  if (/import\s*\{\s*LocaleKeys\s*\}\s*from\s*['"]@amg-webui\/locale['"]/.test(out)) {
    if (!/\bLocaleKeys\b/.test(out.replace(/import\s*\{\s*LocaleKeys\s*\}\s*from\s*['"]@amg-webui\/locale['"]\r?\n?/, ''))) {
      out = out.replace(/^import\s*\{\s*LocaleKeys\s*\}\s*from\s*['"]@amg-webui\/locale['"]\r?\n/gm, '')
    }
  }
  return out
}

let changed = 0
for (const file of walkDemos()) {
  const before = fs.readFileSync(file, 'utf8')
  const after = cleanup(before)
  if (after !== before) {
    fs.writeFileSync(file, after)
    changed++
  }
}
console.log(`Removed unused imports/blocks in ${changed} demo files.`)
