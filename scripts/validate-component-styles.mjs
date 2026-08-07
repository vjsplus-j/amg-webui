/**
 * After build:styles / build:lib — assert every leaf has a stable style.css side-entry.
 * Usage: node scripts/validate-component-styles.mjs
 */
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  listLeafComponentNames,
  resolveComponentLayer,
  toKebab
} from '../build/shared.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const missing = []

for (const name of listLeafComponentNames()) {
  const layer = resolveComponentLayer(name)
  const css = resolve(
    root,
    'dist/es/components',
    layer,
    name,
    'style.css'
  )
  if (!existsSync(css)) missing.push(`${toKebab(name)} → ${layer}/${name}/style.css`)
}

if (missing.length) {
  console.error(
    `[validate-component-styles] missing ${missing.length} side-entries:`
  )
  console.error(missing.slice(0, 20).join('\n'))
  if (missing.length > 20) console.error(`… +${missing.length - 20} more`)
  process.exit(1)
}

console.log(
  `[validate-component-styles] OK: ${listLeafComponentNames().length} leaf style.css side-entries`
)
