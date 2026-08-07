/**
 * Fail when example routes use hardcoded meta.title as the primary title source.
 * Contract: meta.titleKey required on navigable routes (see vue3-amg-webui-i18n / APP_WORKFLOW).
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const routesPath = resolve(root, 'example/router/routes.ts')
const src = readFileSync(routesPath, 'utf8')

/** Match route meta objects that set title: without titleKey nearby in the same meta block. */
const metaBlocks = [...src.matchAll(/meta:\s*\{([^}]*)\}/gs)]
const offenders = []

for (const match of metaBlocks) {
  const body = match[1]
  const hasTitle = /\btitle\s*:/.test(body)
  const hasTitleKey = /\btitleKey\s*:/.test(body)
  if (hasTitle && !hasTitleKey) {
    offenders.push(body.trim().slice(0, 120))
  }
}

if (offenders.length) {
  console.error('[check:route-title-keys] routes with meta.title but no titleKey:')
  for (const o of offenders) console.error(' -', o.replace(/\s+/g, ' '))
  process.exit(1)
}

console.log(`[check:route-title-keys] OK — ${metaBlocks.length} meta blocks checked`)
