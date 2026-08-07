/**
 * Rebuild program backlog + honest program-status after Repository Completion Audit.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const hardening = 'component-hardening'
const inv = JSON.parse(
  readFileSync(join(hardening, 'inventory/component-inventory.json'), 'utf8')
)
const now = new Date().toISOString()

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const stable = []
const beta = []
for (const c of inv.components) {
  const contract = JSON.parse(
    readFileSync(join(hardening, 'contracts', `${c.name}.json`), 'utf8')
  )
  if (contract.maturity === 'stable' && contract.apiFreeze?.frozen) {
    stable.push(c.name)
  } else {
    beta.push(c.name)
  }
}

const docsDir = 'docs/components'
const missingDocs = stable.filter((n) => !existsSync(join(docsDir, `${toKebab(n)}.md`)))

const stubApis = readdirSync('generated/component-api')
  .filter((f) => f.endsWith('.json'))
  .filter((f) => /bulk stub/.test(readFileSync(join('generated/component-api', f), 'utf8')))
  .map((f) => f.replace(/\.json$/, ''))

const backlog = [
  {
    id: 'AUDIT-P0-MESSAGEBOX',
    priority: 'P0',
    area: 'packages',
    title: 'MessageBox inventory code detection (service+host, no index.vue)',
    status: 'open'
  },
  {
    id: 'AUDIT-P0-HARDENING-PATHS',
    priority: 'P0',
    area: 'docs',
    title: 'Create docs/engineering/component-hardening and .component-hardening pointers',
    status: 'open'
  },
  {
    id: 'AUDIT-P0-STUB-KEYDOWN',
    priority: 'P0',
    area: 'packages',
    title: 'Remove/fix 9 __hardeningKeydown stubs',
    status: 'open'
  },
  {
    id: 'AUDIT-P0-FAKE-STABLE-DEMOTED',
    priority: 'P0',
    area: 'packages',
    title: '259 weak Stable demoted to beta — rebuild real evidence',
    status: 'open',
    count: beta.length
  },
  {
    id: 'AUDIT-P0-STABLE-DOCS',
    priority: 'P0',
    area: 'docs',
    title: 'Stable components missing full VitePress docs',
    status: 'open',
    missing: missingDocs
  },
  {
    id: 'AUDIT-P0-API-STUBS',
    priority: 'P0',
    area: 'packages',
    title: 'Replace bulk stub generated/component-api for public components',
    status: 'open',
    count: stubApis.length
  },
  {
    id: 'AUDIT-P0-PROGRAM-STATUS',
    priority: 'P0',
    area: 'cross',
    title: 'Rewrite program-status to honest demoted baseline',
    status: 'open'
  },
  {
    id: 'AUDIT-P1-EXAMPLE-DRIFT',
    priority: 'P1',
    area: 'example',
    title: 'Audit example routes/demos for broken/fake/docs-conflict',
    status: 'open'
  },
  {
    id: 'AUDIT-P1-SSR-CLEANUP',
    priority: 'P1',
    area: 'packages',
    title: 'Deep SSR top-level DOM + listener cleanup scan remaining gaps',
    status: 'open'
  },
  {
    id: 'AUDIT-P2-BETA-HARDEN',
    priority: 'P2',
    area: 'packages',
    title: 'Harden remaining beta public components to Stable with real evidence',
    status: 'open',
    count: beta.length
  }
]

mkdirSync(join(hardening, 'reports'), { recursive: true })
writeFileSync(
  join(hardening, 'reports/program-backlog.json'),
  JSON.stringify(
    {
      generatedAt: now,
      items: backlog,
      counts: {
        P0: backlog.filter((i) => i.priority === 'P0').length,
        P1: backlog.filter((i) => i.priority === 'P1').length,
        P2: backlog.filter((i) => i.priority === 'P2').length,
        open: backlog.length
      }
    },
    null,
    2
  ) + '\n'
)

console.log(
  JSON.stringify(
    {
      stable: stable.length,
      beta: beta.length,
      missingDocs,
      stubApis: stubApis.length,
      backlog: backlog.length
    },
    null,
    2
  )
)

const ps = spawnSync(process.execPath, ['scripts/hardening/build-program-status.mjs'], {
  stdio: 'inherit'
})
if (ps.status !== 0) process.exit(ps.status ?? 1)
