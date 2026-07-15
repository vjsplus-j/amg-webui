import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const base = 'packages/components/base'

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name === 'index.vue') out.push(p)
  }
  return out
}

const replacements = [
  [/\{ label: '\uFFFD\?, value: 'ne' \}/g, "{ label: '!=', value: 'ne' }"],
  [/return '\uFFFD\?\s*$/gm, "return 'v'"],
  [/\{\{ stat\.trend === 'up' \? '\uFFFD\? : stat\.trend === 'down' \? '\uFFFD\? : '\uFFFD\? \}\}/g, "{{ stat.trend === 'up' ? '+' : stat.trend === 'down' ? '-' : '=' }}"],
  [/\{\{ isCollapsed \? '\uFFFD\? : '\uFFFD\? \}\}/g, "{{ isCollapsed ? '+' : '-' }}"],
  [/\{\{ expanded\.has\(node\.id\) \? '\uFFFD\? : '\uFFFD\? \}\}/g, "{{ expanded.has(node.id) ? '-' : '+' }}"],
  [/\{\{ expanded\.has\(node\.value\) \? '\uFFFD\? : '\uFFFD\? \}\}/g, "{{ expanded.has(node.value) ? '-' : '+' }}"],
  [/\{\{ openMap\[nid\(n, 'r'\)\] \? '\uFFFD\? : '\+' \}\}/g, "{{ openMap[nid(n, 'r')] ? '-' : '+' }}"],
  [/<span aria-hidden="true">\uFFFD\?\/span>/g, '<span aria-hidden="true">v</span>'],
  [/\?\s*:\s*'\uFFFD\?/g, "? '-' : '+'"],
]

let total = 0
for (const file of walk(base)) {
  let s = readFileSync(file, 'utf8')
  const orig = s
  for (const [re, rep] of replacements) s = s.replace(re, rep)
  if (s !== orig) {
    writeFileSync(file, s)
    total++
    console.log('fixed', file.replace(/\\/g, '/').split('packages/components/base/')[1])
  }
}
console.log('total fixed:', total)
