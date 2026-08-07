/**
 * Regenerate maturity into a temp file and assert it matches the committed
 * example/component-maturity.json (ignore generatedAt). Also enforce
 * thinFormGaps empty + contract version.
 *
 * Usage: node scripts/validate-component-maturity.mjs
 */
import { spawnSync } from 'node:child_process'
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdtempSync,
  rmSync
} from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = resolve(root, 'example/component-maturity.json')
const scorer = resolve(root, 'scripts/score-component-maturity.mjs')

if (!existsSync(outPath)) {
  console.error('[validate-maturity] missing example/component-maturity.json')
  process.exit(1)
}

const committed = JSON.parse(readFileSync(outPath, 'utf8'))
const tmp = mkdtempSync(join(tmpdir(), 'amg-maturity-'))
const tmpOut = join(tmp, 'component-maturity.json')

try {
  // Run scorer in a copied tree slice: patch by temporarily swapping path via cwd + sed is heavy.
  // Instead: run scorer, capture output, restore committed file, compare stripTime.
  const backup = readFileSync(outPath, 'utf8')
  const scored = spawnSync(process.execPath, [scorer], {
    cwd: root,
    encoding: 'utf8'
  })
  if (scored.status !== 0) {
    writeFileSync(outPath, backup, 'utf8')
    console.error(scored.stdout || '')
    console.error(scored.stderr || '')
    process.exit(scored.status ?? 1)
  }
  const fresh = readFileSync(outPath, 'utf8')
  writeFileSync(tmpOut, fresh, 'utf8')
  writeFileSync(outPath, backup, 'utf8')

  const after = JSON.parse(fresh)

  function stripTime(doc) {
    const { generatedAt: _t, ...rest } = doc
    return rest
  }

  if (JSON.stringify(stripTime(committed)) !== JSON.stringify(stripTime(after))) {
    console.error(
      '[validate-maturity] example/component-maturity.json is stale — run `npm run score:maturity` and commit.'
    )
    process.exit(1)
  }

  if (!Array.isArray(after.thinFormGaps) || after.thinFormGaps.length) {
    console.error(
      '[validate-maturity] thinFormGaps must be empty:',
      after.thinFormGaps
    )
    process.exit(1)
  }

  if (after.version < 3) {
    console.error('[validate-maturity] expected maturity contract version >= 3')
    process.exit(1)
  }

  console.log(
    `[validate-maturity] OK: v${after.version} inventory=${after.total}`,
    after.summary,
    after.byCapability
  )
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
