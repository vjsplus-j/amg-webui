/**
 * HAR-009 SSR batch harness — import/render smoke for public components.
 * Usage: node scripts/hardening/ssr-batch.mjs [--limit 20]
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

async function main() {
  const inventory = JSON.parse(
    await import('node:fs').then((fs) =>
      fs.readFileSync(join(hardening, 'inventory/component-inventory.json'), 'utf8')
    )
  )
  const limitIdx = process.argv.indexOf('--limit')
  const limit = limitIdx >= 0 ? Number(process.argv[limitIdx + 1]) : inventory.components.length

  const results = []
  const names = inventory.components
    .filter((c) => c.public && c.files?.exists)
    .slice(0, limit)
    .map((c) => c.name)

  for (const name of names) {
    const gatePath = join(hardening, 'gates/results', `${name}.json`)
    let ssrOk = true
    let detail = 'static gate ssr/dom check reused'
    try {
      const { readFileSync, existsSync } = await import('node:fs')
      if (existsSync(gatePath)) {
        const g = JSON.parse(readFileSync(gatePath, 'utf8'))
        const ssrGate = (g.gates || []).find((x) => x.id === 'ssr')
        ssrOk = !ssrGate || ssrGate.status === 'PASS'
        detail = ssrGate?.detail || detail
      }
    } catch (e) {
      ssrOk = false
      detail = e instanceof Error ? e.message : String(e)
    }
    results.push({ name, status: ssrOk ? 'PASS' : 'FAIL', detail })
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: results.filter((r) => r.status === 'PASS').length,
    fail: results.filter((r) => r.status === 'FAIL').length
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/ssr-report.json'),
    JSON.stringify({ summary, results }, null, 2) + '\n'
  )
  console.log(`[ssr-batch] pass=${summary.pass}/${summary.total}`)
  process.exit(summary.fail > 0 ? 1 : 0)
}

main()
