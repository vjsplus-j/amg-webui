import { readFileSync } from 'node:fs'

const s = readFileSync('packages/components/base/Tree/index.vue', 'utf8')
const line = s.split(/\n/)[72]
console.log('line:', line)
const re = /\{\{\s*row\.expanded\s*\?\s*'[^:]*\s*:\s*'\+'\s*\}\}/g
console.log('match:', re.test(line))
console.log('match2:', line.match(re))
