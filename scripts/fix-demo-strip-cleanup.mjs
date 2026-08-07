#!/usr/bin/env node
/** Fix fallout from strip-demo-inline-api: restore computed imports, remove stale PropsTable imports. */
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

function needsComputed(src) {
  return /\bcomputed\s*[<(]/.test(src)
}

function hasComputedImport(src) {
  return /import\s*\{[^}]*\bcomputed\b[^}]*\}\s*from\s*['"]vue['"]/.test(src)
}

function fixVueImport(src) {
  const usesComputed = needsComputed(src)
  const vueImportRe = /import\s*\{([^}]*)\}\s*from\s*['"]vue['"]/
  const m = src.match(vueImportRe)
  if (!m) {
    if (usesComputed) return `import { computed } from 'vue'\n${src}`
    return src
  }
  const parts = m[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const set = new Set(parts)
  if (usesComputed) set.add('computed')
  else set.delete('computed')
  const next = `import { ${[...set].join(', ')} } from 'vue'`
  return src.replace(vueImportRe, next)
}

function cleanup(src) {
  let out = src
  out = out.replace(/^import PropsTable from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ ApiRow, PropRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ PropRow, ApiRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ ApiRow \} from .+\r?\n/gm, '')
  out = out.replace(/^import type \{ PropRow \} from .+\r?\n/gm, '')
  out = out.replace(/\r?\n\s*<section class="vp-curated__api">[\s\S]*?<\/section>/g, '')
  out = out.replace(/\r?\n\s*<PropsTable[^/]*\/>\s*/g, '\n')
  out = fixVueImport(out)
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
console.log(`Cleanup fixed ${changed} demo files.`)
