/**
 * HAR-003: changed-component detection from git diff.
 * Usage: node scripts/hardening/changed-components.mjs [baseRef]
 */
import { execSync } from 'node:child_process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentToPackage, allMappedComponentNames } from '../component-package-map.mjs'
import { resolveFamily } from './families.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

function main() {
  const base = process.argv[2] || 'origin/main'
  let diff = ''
  try {
    diff = execSync(`git diff --name-only ${base}...HEAD`, {
      cwd: root,
      encoding: 'utf8'
    })
  } catch {
    try {
      diff = execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' })
    } catch {
      diff = execSync('git status --porcelain', { cwd: root, encoding: 'utf8' })
        .split(/\r?\n/)
        .map((l) => l.slice(3).trim())
        .join('\n')
    }
  }

  const files = diff
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  const names = new Set()
  const families = new Set()

  for (const file of files) {
    const m =
      file.match(/packages\/components\/[^/]+\/([^/]+)\//) ||
      file.match(/packages\/lowcode\/ui\/([^/]+)\//)
    if (m) {
      const name = m[1]
      if (componentToPackage.has(name)) {
        names.add(name)
        families.add(resolveFamily(name, componentToPackage.get(name)))
      }
    }
    if (
      file.includes('packages/utils/engines/') ||
      file.includes('packages/runtime/') ||
      file.includes('scripts/hardening/')
    ) {
      // engine change → all families using it; conservative: mark all public
      for (const n of allMappedComponentNames()) {
        families.add(resolveFamily(n, componentToPackage.get(n)))
      }
    }
  }

  const out = {
    base,
    generatedAt: new Date().toISOString(),
    files,
    components: [...names].sort(),
    families: [...families].sort()
  }

  mkdirSync(join(hardening, 'reports'), { recursive: true })
  writeFileSync(
    join(hardening, 'reports/changed-components.json'),
    JSON.stringify(out, null, 2) + '\n'
  )
  console.log(
    `[changed-components] components=${out.components.length} families=${out.families.length}`
  )
  if (out.components.length) console.log(out.components.join(','))
}

main()
