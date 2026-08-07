/**
 * Install packed amg-webui into consumer fixtures and run production builds.
 * Requires `npm run build:lib` first.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, rmSync, copyFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixtures = ['consumer-vite', 'consumer-webpack', 'consumer-nuxt']

function run(cmd, args, cwd) {
  console.log(`\n[test:consumers] (${cwd})\n  ${cmd} ${args.join(' ')}`)
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function assertDist() {
  const required = [
    'dist/amg-webui.js',
    'dist/style.css',
    'dist/security/index.js',
    'dist/lowcode/index.js',
    'dist/telemetry/index.js',
    'dist/hooks/index.js',
    'dist/utils/env.js',
    'dist/es/components/base/Button/index.js',
    'dist/es/components/base/Button/style.css',
    'dist/theme/index.js'
  ]
  const missing = required.filter((p) => !existsSync(resolve(root, p)))
  if (missing.length) {
    console.error(
      '[test:consumers] missing dist artifacts — run `npm run build:lib` first:\n' +
        missing.map((m) => `  - ${m}`).join('\n')
    )
    process.exit(1)
  }
}

assertDist()

const packDir = mkdtempSync(join(tmpdir(), 'amg-webui-pack-'))
try {
  run('npm', ['pack', '--pack-destination', packDir], root)
  const tgz = readdirSync(packDir).find((f) => f.endsWith('.tgz'))
  if (!tgz) {
    console.error('[test:consumers] npm pack produced no .tgz')
    process.exit(1)
  }
  const tgzPath = join(packDir, tgz)

  for (const name of fixtures) {
    const dir = resolve(root, 'tests', name)
    if (!existsSync(dir)) {
      console.error(`[test:consumers] missing fixture ${dir}`)
      process.exit(1)
    }
    const localTgz = join(dir, 'amg-webui-packed.tgz')
    copyFileSync(tgzPath, localTgz)
    run('npm', ['install', '--no-fund', '--no-audit'], dir)
    run('npm', ['install', '--no-fund', '--no-audit', './amg-webui-packed.tgz'], dir)
    run('npm', ['run', 'build'], dir)
  }

  console.log('\n[test:consumers] all fixtures built OK')
} finally {
  rmSync(packDir, { recursive: true, force: true })
}
