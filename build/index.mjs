/**
 * Library build entry — full / on-demand / multi-theme / dts hooks.
 * Usage: node build/index.mjs
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2] || 'full'

console.log(`[build] mode=${mode}`)

const configs =
  mode === 'skill'
    ? ['vite.skill.config.ts']
    : mode === 'theme'
      ? ['vite.theme.config.ts']
      : ['vite.config.ts', 'vite.skill.config.ts', 'vite.theme.config.ts']
const viteCli = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js')

for (const config of configs) {
  const result = spawnSync(
    process.execPath,
    [viteCli, 'build', '--config', resolve(root, config)],
    {
      cwd: root,
      stdio: 'inherit',
      shell: false
    }
  )
  if (result.status !== 0) process.exit(result.status ?? 1)
}
