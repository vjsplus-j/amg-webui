import { readFileSync, writeFileSync } from 'node:fs'

const p = 'packages/components/base/StickyTable/index.vue'
let s = readFileSync(p, 'utf8')
s = s.replace(/\{\{ sortDir === 'asc' \? '[^']*'-' : '\+' \}\}/, "{{ sortDir === 'asc' ? '^' : 'v' }}")
writeFileSync(p, s)
console.log('done')
