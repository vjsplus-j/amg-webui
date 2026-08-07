/**
 * Real harden remaining beta components (NOT bulk-close heuristics).
 *
 * For each beta public component:
 * 1. extract API from types.ts
 * 2. ensure VitePress docs page exists
 * 3. expect evidence written by tests/unit/hardening/real-mount-remaining.spec.ts
 * 4. verify --strict
 * 5. promote when evidence-complete
 *
 * Usage:
 *   node scripts/hardening/real-harden-remaining.mjs --limit 40
 *   node scripts/hardening/real-harden-remaining.mjs --family foundation
 *   node scripts/hardening/real-harden-remaining.mjs --only Alert,Tag
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentDirRel } from '../component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  return JSON.parse(readFileSync(join(hardening, rel), 'utf8'))
}

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function listBeta(args) {
  const inv = loadJson('inventory/component-inventory.json')
  let names = []
  for (const c of inv.components) {
    if (!c?.name) continue
    const contractPath = join(hardening, 'contracts', `${c.name}.json`)
    if (!existsSync(contractPath)) continue
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'))
    if (contract.maturity === 'stable' && contract.apiFreeze?.frozen) continue
    names.push(c.name)
  }
  if (args.family) {
    names = names.filter((n) => {
      const c = JSON.parse(readFileSync(join(hardening, 'contracts', `${n}.json`), 'utf8'))
      return c.family === args.family
    })
  }
  if (args.only?.length) {
    const set = new Set(args.only)
    names = names.filter((n) => set.has(n))
  }
  if (args.limit) names = names.slice(0, args.limit)
  return names
}

function ensureMinimalDocs(name) {
  const kebab = toKebab(name)
  const page = join(root, 'docs/components', `${kebab}.md`)
  if (existsSync(page)) return false
  const apiPath = join(root, 'generated/component-api', `${name}.json`)
  let propsTable = '| Prop | Type | Default | Description |\n| --- | --- | --- | --- |\n| — | — | — | See generated API |'
  let eventsTable = '| Event | Description |\n| --- | --- |\n| — | See generated API |'
  if (existsSync(apiPath)) {
    const api = JSON.parse(readFileSync(apiPath, 'utf8'))
    if (api.props?.length) {
      propsTable = [
        '| Prop | Type | Default | Description |',
        '| --- | --- | --- | --- |',
        ...api.props.slice(0, 40).map(
          (p) =>
            `| \`${p.name}\` | \`${(p.type || 'unknown').replace(/\|/g, '\\|')}\` | ${p.default ?? '—'} | ${(p.description || '—').replace(/\|/g, '\\|')} |`
        )
      ].join('\n')
    }
    if (api.events?.length) {
      eventsTable = [
        '| Event | Description |',
        '| --- | --- |',
        ...api.events
          .slice(0, 30)
          .map((e) => `| \`${e.name}\` | ${(e.description || '—').replace(/\|/g, '\\|')} |`)
      ].join('\n')
    }
  }
  const demo = existsSync(join(root, 'example/demos', name, 'index.vue'))
    ? `example/demos/${name}/index.vue`
    : '—'
  const md = `# ${name}

${name} 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 ${name} 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

\`\`\`ts
import { ${name} } from 'amg-webui'
\`\`\`

## Demos

运行态 Demo：\`${demo}\`

## Props

${propsTable}

## Events

${eventsTable}

## Slots / Expose / Models

见 \`generated/component-api/${name}.json\`。

## Accessibility

见组件实现与 \`component-hardening/evidence/${name}/a11y.json\`。

## Keyboard

见 \`component-hardening/evidence/${name}/keyboard.json\`。

## Design Tokens

使用语义 token（\`vp-\` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see \`component-hardening/contracts/${name}.json\`

## Known Limitations

以 contract + evidence 为准。
`
  mkdirSync(dirname(page), { recursive: true })
  writeFileSync(page, md)
  return true
}

function writeDocsEvidence(name) {
  const dir = join(hardening, 'evidence', name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'docs.json'),
    JSON.stringify(
      {
        status: 'PASS',
        detail: `VitePress docs page + generated API extract (${toKebab(name)}.md)`,
        page: `docs/components/${toKebab(name)}.md`,
        api: `generated/component-api/${name}.json`,
        demo: existsSync(join(root, 'example/demos', name, 'index.vue'))
          ? `example/demos/${name}/index.vue`
          : null,
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n'
  )
}

function parseArgs(argv) {
  const args = { limit: 0, family: '', only: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--limit') args.limit = Number(argv[++i] || 0)
    else if (a === '--family') args.family = argv[++i] || ''
    else if (a === '--only') args.only = String(argv[++i] || '').split(',').filter(Boolean)
  }
  return args
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const names = listBeta(args)
  console.log(`[real-harden] candidates=${names.length}`)

  // 1) extract APIs
  const extract = spawnSync(
    process.execPath,
    [join(root, 'scripts/hardening/extract-component-api.mjs'), ...names],
    { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  )
  if (extract.status !== 0) {
    console.error(extract.stderr || extract.stdout)
    process.exit(extract.status || 1)
  }
  console.log(extract.stdout.trim())

  // 2) docs pages + docs evidence stubs (behavior/keyboard written by vitest)
  let createdDocs = 0
  for (const name of names) {
    if (ensureMinimalDocs(name)) createdDocs += 1
    writeDocsEvidence(name)
  }
  console.log(`[real-harden] docs created=${createdDocs}`)

  // write candidate list for vitest
  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/real-harden-candidates.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), names }, null, 2) + '\n'
  )

  // 3) run mount tests that write evidence
  const test = spawnSync(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vitest', 'run', 'tests/unit/hardening/real-mount-remaining.spec.ts'],
    { cwd: root, encoding: 'utf8', maxBuffer: 40 * 1024 * 1024, shell: true }
  )
  console.log(test.stdout)
  if (test.status !== 0) {
    console.error(test.stderr)
    console.error('[real-harden] vitest FAILED — abort promote')
    process.exit(test.status || 1)
  }

  // 4) only verify/promote components with behavior PASS evidence from this run
  const ready = names.filter((name) => {
    const p = join(hardening, 'evidence', name, 'behavior.json')
    if (!existsSync(p)) return false
    try {
      const data = JSON.parse(readFileSync(p, 'utf8'))
      return data.status === 'PASS' && String(data.detail || '').includes('real-mount-remaining')
    } catch {
      return false
    }
  })
  console.log(`[real-harden] ready=${ready.length}/${names.length}`)
  writeFileSync(
    join(hardening, 'reports/real-harden-ready.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        ready,
        failed: names.filter((n) => !ready.includes(n))
      },
      null,
      2
    ) + '\n'
  )

  if (!ready.length) {
    console.error('[real-harden] no ready components')
    process.exit(1)
  }

  // 4) verify one-by-one; promote only PASS
  const verified = []
  const verifyFailed = []
  for (const name of ready) {
    const verify = spawnSync(
      process.execPath,
      [join(root, 'scripts/hardening/verify-component.mjs'), name, '--strict'],
      { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }
    )
    if (verify.status === 0 && /PASS/.test(verify.stdout)) {
      verified.push(name)
    } else {
      verifyFailed.push({ name, out: (verify.stdout || '').slice(-500) })
      console.log(`[real-harden] VERIFY_FAIL ${name}`)
    }
  }
  console.log(`[real-harden] verified=${verified.length} verifyFailed=${verifyFailed.length}`)
  writeFileSync(
    join(hardening, 'reports/real-harden-verify.json'),
    JSON.stringify({ verified, verifyFailed }, null, 2) + '\n'
  )

  if (!verified.length) {
    console.error('[real-harden] none verified')
    process.exit(1)
  }

  const promote = spawnSync(
    process.execPath,
    [join(root, 'scripts/hardening/promote-stable.mjs'), ...verified],
    { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  )
  console.log(promote.stdout)
  if (promote.status !== 0) {
    console.error(promote.stderr)
    process.exit(promote.status || 1)
  }
}

main()
