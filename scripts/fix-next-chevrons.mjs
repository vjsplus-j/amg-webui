import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = resolve(root, 'packages/components/base')

function walk(d, acc = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (e.name.endsWith('.vue')) acc.push(p)
  }
  return acc
}

let n = 0
for (const f of walk(base)) {
  let t = readFileSync(f, 'utf8')
  const orig = t
  // next* buttons that incorrectly got ‹
  t = t.replace(/(@click="next(?:Month|Year|Range)?"[^>]*>)‹<\/button>/g, '$1›</button>')
  t = t.replace(/(@click="next\(\)"[^>]*>)‹<\/button>/g, '$1›</button>')
  t = t.replace(/(arrow--next[^>]*>)‹<\/button>/g, '$1›</button>')
  t = t.replace(/(nav--next[^>]*>)‹<\/button>/g, '$1›</button>')
  t = t.replace(/(zoomIn[^>]*>)‹<\/button>/g, '$1›</button>')
  // remaining FFFD?/tag without <
  t = t.replace(/>\uFFFD\?\/(button|span)>/g, '>•</$1>')
  t = t.replace(/>–\?\/(button|span)>/g, '>–</$1>') // unlikely
  // broken sep spans: >–?/span> style after earlier bad replace
  t = t.replace(/>–<\/span>/g, '>–</span>')
  t = t.replace(/>\uFFFD–<\/span>/g, '>–</span>')
  if (t !== orig) {
    writeFileSync(f, t)
    n++
    console.log('patched', f.slice(root.length + 1))
  }
}
console.log('done', n)
