#!/usr/bin/env node
/**
 * Remove hand-written PropsTable / propRows from curated example demos.
 * ComponentDocPage renders ApiRenderer — inline API tables are SSOT drift.
 */
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

/** Remove `const name = computed<...>(() => [ ... ])` blocks. */
function removeComputedRowBlocks(src) {
  for (const name of ['propRows', 'eventRows', 'slotRows']) {
    const marker = `const ${name} = computed`
    let idx = src.indexOf(marker)
    while (idx !== -1) {
      const lineStart = src.lastIndexOf('\n', idx) + 1
      const afterMarker = src.indexOf('(() => [', idx)
      if (afterMarker === -1 || afterMarker > idx + 80) {
        idx = src.indexOf(marker, idx + 1)
        continue
      }
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
      const end = i
      let removeEnd = end
      if (src[removeEnd] === '\n') removeEnd++
      src = src.slice(0, lineStart) + src.slice(removeEnd)
      idx = src.indexOf(marker, lineStart)
    }
  }
  return src
}

function stripInlineApi(src) {
  if (!/PropsTable|propRows|propsRows|propsTable/.test(src)) return src

  let out = src

  out = out.replace(/^import PropsTable from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ ApiRow, PropRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ PropRow, ApiRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ ApiRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ PropRow \} from .+\r?\n/gm, '')

  out = removeComputedRowBlocks(out)

  out = out.replace(
    /\n\s*<section class="vp-curated__api">[\s\S]*?<\/section>/g,
    ''
  )

  out = out.replace(/\n\s*<PropsTable[^/]*\/>\s*/g, '\n')

  out = out.replace(/\n\s*<h3 class="vp-curated__api-sub"[^>]*>[\s\S]*?<\/h3>\s*\n\s*<PropsTable[^/]*\/>\s*/g, '\n')

  out = out.replace(/\n\s*\.vp-curated__api-title \{[\s\S]*?\}\s*/g, '\n')
  out = out.replace(/\n\s*\.vp-curated__api-sub \{[\s\S]*?\}\s*/g, '\n')
  out = out.replace(/\n\s*\.vp-curated__api-sub:first-of-type \{[\s\S]*?\}\s*/g, '\n')

  out = out.replace(/\n{3,}/g, '\n\n')

  return out
}

let changed = 0
for (const file of walkDemos()) {
  const before = fs.readFileSync(file, 'utf8')
  const after = stripInlineApi(before)
  if (after !== before) {
    fs.writeFileSync(file, after)
    changed++
    console.log('stripped:', path.relative(demosDir, file))
  }
}

console.log(`Done. Updated ${changed} demo files.`)
