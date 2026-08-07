import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FOUNDATION_PACKAGES } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docName = readdirSync(root).find((f) => f.includes('全量组件') && f.endsWith('.md'))
if (!docName) {
  console.error('doc not found')
  process.exit(1)
}
const doc = readFileSync(resolve(root, docName), 'utf8')
const names = []
for (const line of doc.split(/\r?\n/)) {
  let m = line.match(/^###\s*\d+\\\.\s+.+?\s+([A-Za-z][A-Za-z0-9]*)\s*$/)
  if (!m) m = line.match(/^###\s*\d+\.\s+.+?\s+([A-Za-z][A-Za-z0-9]*)\s*$/)
  if (m) names.push(m[1])
}
const uniq = [...new Set(names)]
const impl = new Set()
for (const pkg of FOUNDATION_PACKAGES) {
  const pkgDir = resolve(root, 'packages/components', pkg)
  if (!existsSync(pkgDir)) continue
  for (const d of readdirSync(pkgDir, { withFileTypes: true })) {
    if (d.isDirectory()) impl.add(d.name)
  }
}
const alias = { Input: 'InputText', Modal: 'Dialog', Table: 'DataTable' }
const missing = uniq.filter((n) => !impl.has(alias[n] || n) && !impl.has(n))
console.log('doc headings parsed:', names.length, 'unique:', uniq.length)
console.log('implemented foundation folders:', impl.size)
console.log('still missing:', missing.length)
if (missing.length) console.log(missing.join('\n'))
else console.log('coverage COMPLETE (aliases Input→InputText, Modal→Dialog, Table→DataTable)')
