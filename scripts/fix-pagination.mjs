import { readFileSync, writeFileSync } from 'node:fs'

const fixes = [
  ['packages/components/base/Pagination/index.vue', /<span v-if="item === 'ellipsis'"[^>]*>[^<]*<\/span>/, '<span v-if="item === \'ellipsis\'" class="vp-pagination__ellipsis" aria-hidden="true">...</span>'],
]

for (const [file, re, rep] of fixes) {
  let s = readFileSync(file, 'utf8')
  s = s.replace(re, rep)
  writeFileSync(file, s)
}
