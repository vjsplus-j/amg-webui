/**
 * Build family-evidence/summary.json from per-family JSON shards (unit and/or e2e).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const dir = join(root, 'component-hardening/reports/family-evidence')

function main() {
  mkdirSync(dir, { recursive: true })
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.json') && f !== 'summary.json'
  )
  const families = []
  for (const f of files) {
    const row = JSON.parse(readFileSync(join(dir, f), 'utf8'))
    if (!row.family) continue
    families.push({
      family: row.family,
      batch: row.batch,
      axe: row.axe,
      keyboard: row.keyboard,
      visual: row.visual,
      unit: row.unit,
      verifiedAt: row.verifiedAt || new Date().toISOString()
    })
  }
  const out = {
    generatedAt: new Date().toISOString(),
    source: 'unit+e2e family evidence shards',
    families: families.sort((a, b) => String(a.family).localeCompare(String(b.family)))
  }
  writeFileSync(join(dir, 'summary.json'), JSON.stringify(out, null, 2) + '\n')
  console.log(`[summarize-family-evidence] families=${families.length}`)
}

main()
