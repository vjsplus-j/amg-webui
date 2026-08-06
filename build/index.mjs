/**
 * Library build entry — real modes (not name-only):
 *   full | on-demand | multi-theme | dts | skill | theme
 *
 * Usage:
 *   node build/index.mjs [mode]
 *   npm run build:lib | build:ondemand | build:themes | build:dts | build:skill | build:theme
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2] || 'full'
const viteCli = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')

const USAGE = `Usage: node build/index.mjs <mode>

Modes:
  full         Main library (ESM+UMD+css+dts) + skill + theme runtime   [default]
  on-demand    Multi-entry ESM → dist/es/** (per-component / biz domain)
  multi-theme  Per-brand CSS → dist/themes/<brand>.css
  dts          Types only → dist/**/*.d.ts (no JS/CSS rebundle)
  skill        Optional Skill Runtime → dist/skill/
  theme        Theme runtime package → dist/theme/
`

function runVite(configFile) {
  const result = spawnSync(
    process.execPath,
    [viteCli, 'build', '--config', resolve(root, configFile)],
    {
      cwd: root,
      stdio: 'inherit',
      shell: false
    }
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
    runVite('vite.skill.config.ts')
    runVite('vite.theme.config.ts')
    break
  case 'on-demand':
    runVite('vite.ondemand.config.ts')
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
  default:
    console.error(`[build] unknown mode: ${mode}\n`)
    console.error(USAGE)
    process.exit(1)
}
