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

const r = spawnSync('npx', ['vite', 'build', '--config', resolve(root, 'vite.config.ts')], {
  cwd: root,
  stdio: 'inherit',
  shell: true
})

process.exit(r.status ?? 1)
