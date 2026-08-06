/**
 * Emit declaration files only (no JS/CSS bundle).
 * Used by: node build/index.mjs dts
 */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist')

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const vueTsc = resolve(root, 'node_modules', 'vue-tsc', 'bin', 'vue-tsc.js')
const result = spawnSync(
  process.execPath,
  [
    vueTsc,
    '--declaration',
    '--emitDeclarationOnly',
    '--project',
    resolve(root, 'tsconfig.dts.json')
  ],
  {
    cwd: root,
    stdio: 'inherit',
    shell: false
  }
)

if (result.status !== 0) {
  console.error('[build:dts] vue-tsc declaration emit failed')
  process.exit(result.status ?? 1)
}

console.log('[build:dts] declarations written under dist/')
