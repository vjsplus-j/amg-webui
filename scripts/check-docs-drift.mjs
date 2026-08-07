/**
 * H04 — Docs maturity / sidebar drift gate.
 *
 * Regenerates VitePress component docs + sidebar from Contract SSOT,
 * then fails if tracked outputs differ (git diff --exit-code).
 *
 * Usage: node scripts/check-docs-drift.mjs
 */
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function run(cmd) {
  console.log(`[check:docs-drift] ${cmd}`)
  execSync(cmd, { cwd: root, stdio: 'inherit' })
}

function main() {
  run('node scripts/generate-vitepress-api.mjs --force')
  run('node scripts/generate-docs-sidebar.mjs')

  const paths = [
    'docs/components',
    'docs/.vitepress/sidebar.components.ts'
  ]
  try {
    execSync(`git diff --exit-code -- ${paths.join(' ')}`, {
      cwd: root,
      stdio: 'inherit'
    })
  } catch {
    console.error(
      '[check:docs-drift] FAIL — docs maturity/sidebar drifted from Contract SSOT. Commit regenerated docs.'
    )
    process.exit(1)
  }
  console.log('[check:docs-drift] PASS — docs + sidebar match Contract SSOT')
}

main()
