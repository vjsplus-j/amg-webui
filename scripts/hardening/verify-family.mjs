/**
 * verify:family — family engine + component aggregate (HAR-002).
 * Usage: node scripts/hardening/verify-family.mjs selection
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function loadJson(rel) {
  return JSON.parse(readFileSync(join(hardening, rel), 'utf8'))
}

const ENGINE_PATHS = {
  'form-control': 'packages/utils/engines/formControl.ts',
  selection: 'packages/utils/engines/selection.ts',
  keyboard: 'packages/utils/engines/keyboardNav.ts',
  floating: 'packages/utils/engines/floating.ts',
  datetime: 'packages/utils/engines/datetime.ts',
  tree: 'packages/utils/engines/tree.ts',
  virtualizer: 'packages/utils/engines/virtualizer.ts',
  'table-column': 'packages/utils/engines/tableColumn.ts',
  upload: 'packages/utils/engines/upload.ts',
  'feedback-queue': 'packages/utils/engines/feedbackQueue.ts',
  navigation: 'packages/utils/engines/navigation.ts',
  'media-adapter': 'packages/utils/engines/mediaAdapter.ts'
}

function main() {
  const familyId = process.argv[2]
  if (!familyId) {
    console.error('Usage: verify-family <familyId>')
    process.exit(1)
  }
  const familyMap = loadJson('inventory/component-family-map.json')
  const family = familyMap.families.find((f) => f.id === familyId)
  if (!family) {
    console.error(`Unknown family ${familyId}`)
    process.exit(1)
  }
  const names = familyMap.byFamily[familyId] || []

  const engineResults = []
  for (const eng of family.engines || []) {
    const rel = ENGINE_PATHS[eng]
    const ok = rel && existsSync(join(root, rel))
    engineResults.push({ engine: eng, path: rel, status: ok ? 'PASS' : 'FAIL' })
  }

  const verify = spawnSync(
    process.execPath,
    [
      join(root, 'scripts/hardening/verify-component.mjs'),
      ...names.flatMap((n) => {
        /* run via temp: write list */
        return []
      })
    ],
    { encoding: 'utf8' }
  )
  // Run all then filter
  spawnSync(
    process.execPath,
    [join(root, 'scripts/hardening/verify-component.mjs'), '--all'],
    { encoding: 'utf8', cwd: root }
  )

  const allPath = join(hardening, 'gates/results/all.json')
  const all = existsSync(allPath) ? JSON.parse(readFileSync(allPath, 'utf8')) : { results: [] }
  const componentResults = (all.results || []).filter((r) => names.includes(r.name))

  const engineOk = engineResults.every((e) => e.status === 'PASS')
  const compsOk = componentResults.every((r) => r.status === 'PASS')
  const out = {
    family: familyId,
    engines: engineResults,
    components: componentResults.map((r) => ({
      name: r.name,
      status: r.status,
      stable: r.stable
    })),
    status: engineOk && compsOk ? 'PASS' : 'FAIL',
    verifiedAt: new Date().toISOString()
  }

  mkdirSync(join(hardening, 'gates/results'), { recursive: true })
  writeFileSync(
    join(hardening, 'gates/results', `family-${familyId}.json`),
    JSON.stringify(out, null, 2) + '\n'
  )
  console.log(
    `[verify:family] ${familyId} ${out.status} engines=${engineResults.length} components=${componentResults.length}`
  )
  process.exit(out.status === 'PASS' ? 0 : 1)
}

main()
