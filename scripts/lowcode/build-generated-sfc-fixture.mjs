/**
 * Compile + Vite-build a generated lowcode SFC (golden path step 19).
 * Writes SFC into tests/fixtures/lowcode-generated/ and runs vite build.
 */
import { spawnSync } from 'node:child_process'
import { writeFileSync, rmSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const fixtureRoot = join(repoRoot, 'tests/fixtures/lowcode-generated')

/**
 * @param {string} sfc Full .vue source from generateVueSfc
 * @returns {{ ok: boolean; issues: string[]; outDir?: string }}
 */
export function buildGeneratedSfcFixture(sfc) {
  const issues = []
  writeFileSync(join(fixtureRoot, 'GeneratedPage.vue'), sfc, 'utf8')

  const viteBin = join(repoRoot, 'node_modules', 'vite', 'bin', 'vite.js')
  const build = spawnSync(
    process.execPath,
    [viteBin, 'build', '--config', join(fixtureRoot, 'vite.config.mjs')],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024
    }
  )

  const outDir = join(fixtureRoot, 'dist')
  if (build.status !== 0) {
    const detail = [build.stderr, build.stdout, build.error?.message].filter(Boolean).join('\n').trim()
    issues.push(detail || `vite build exited ${build.status ?? 'unknown'}`)
    return { ok: false, issues }
  }
  if (!existsSync(join(outDir, 'index.html'))) {
    issues.push('missing dist/index.html after vite build')
    return { ok: false, issues }
  }
  return { ok: true, issues: [], outDir }
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const sfcPath = process.argv[2]
  if (!sfcPath) {
    console.error('Usage: node scripts/lowcode/build-generated-sfc-fixture.mjs <GeneratedPage.vue>')
    process.exit(1)
  }
  const { readFileSync } = await import('node:fs')
  const sfc = readFileSync(resolve(process.cwd(), sfcPath), 'utf8')
  const result = buildGeneratedSfcFixture(sfc)
  if (!result.ok) {
    console.error('[lowcode-sfc-fixture] FAIL:', result.issues.join('\n'))
    process.exit(1)
  }
  console.log('[lowcode-sfc-fixture] PASS →', result.outDir)
  rmSync(join(fixtureRoot, 'dist'), { recursive: true, force: true })
}
