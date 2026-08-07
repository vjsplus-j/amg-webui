#!/usr/bin/env node
/**
 * Run or refresh the official-theme visual regression matrix.
 *
 * Compare (default):
 *   node scripts/visual/run-matrix.mjs
 *
 * Update baselines after intentional visual changes:
 *   node scripts/visual/run-matrix.mjs --update
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { buildVisualMatrixCases } from './matrix.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const update = process.argv.includes('--update')
const cases = buildVisualMatrixCases()

console.log(`[visual-matrix] cases=${cases.length} mode=${update ? 'update' : 'compare'}`)

const args = [
  'playwright',
  'test',
  'tests/e2e/visual-theme-matrix.spec.ts',
  '--project=chromium'
]
if (update) args.push('--update-snapshots')

const result = spawnSync('npx', args, {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, CI: process.env.CI || '' }
})

process.exit(result.status ?? 1)
