/**
 * Library build entry — real modes:
 *   full | on-demand | multi-theme | dts | skill | theme | runtime
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2] || 'full'
const viteCli = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')

const USAGE = `Usage: node build/index.mjs <mode>

Modes:
  full         Main lib + runtime packages + on-demand + skill + theme + exports
  on-demand    Multi-entry ESM → dist/es/**
  multi-theme  Per-brand CSS → dist/themes/<brand>.css
  dts          Types only → dist/**/*.d.ts
  skill        Optional Skill Runtime → dist/skill/
  theme        Theme runtime package → dist/theme/
  runtime      telemetry/security/lowcode/icons/hooks/utils/locale/… → dist/
`

function runVite(configFile) {
  const result = spawnSync(
    process.execPath,
    [viteCli, 'build', '--config', resolve(root, configFile)],
    { cwd: root, stdio: 'inherit', shell: false }
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function runNode(scriptRel, args = []) {
  const result = spawnSync(process.execPath, [resolve(root, scriptRel), ...args], {
    cwd: root,
    stdio: 'inherit',
    shell: false
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log(`[build] mode=${mode}`)

switch (mode) {
  case 'full':
    runVite('vite.config.ts')
    runVite('vite.runtime.config.ts')
    runVite('vite.ondemand.config.ts')
    runNode('build/write-component-barrels.mjs')
    runVite('vite.skill.config.ts')
    runVite('vite.theme.config.ts')
    runNode('scripts/generate-package-exports.mjs')
    break
  case 'on-demand':
    runVite('vite.ondemand.config.ts')
    runNode('build/write-component-barrels.mjs')
    runNode('scripts/generate-package-exports.mjs')
    break
  case 'multi-theme':
    runVite('vite.themes.config.ts')
    break
  case 'dts':
    runNode('build/emit-dts.mjs')
    break
  case 'skill':
    runVite('vite.skill.config.ts')
    break
  case 'theme':
    runVite('vite.theme.config.ts')
    break
  case 'runtime':
    runVite('vite.runtime.config.ts')
    runNode('scripts/generate-package-exports.mjs')
    break
  default:
    console.error(`[build] unknown mode: ${mode}\n`)
    console.error(USAGE)
    process.exit(1)
}
