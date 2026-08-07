/**
 * Scaffold a component under a package.
 * Usage:
 *   node scripts/create-component.mjs core MyWidget
 *   node scripts/create-component.mjs form MyField
 *   node scripts/create-component.mjs business payments
 *   node scripts/create-component.mjs gb28181 GbsFoo
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPONENT_PACKAGES } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [, , layer, name] = process.argv

const allowed = [...COMPONENT_PACKAGES, 'business']

if (!layer || !name || !allowed.includes(layer)) {
  console.error(
    `Usage: node scripts/create-component.mjs <${allowed.join('|')}> <Name>`
  )
  process.exit(1)
}

if (layer === 'business') {
  const dir = resolve(root, 'packages/components/business', name.toLowerCase())
  if (existsSync(dir)) {
    console.error('Already exists:', dir)
    process.exit(1)
  }
  mkdirSync(resolve(dir, 'composables'), { recursive: true })
  const pascal = name.charAt(0).toUpperCase() + name.slice(1)
  writeFileSync(
    resolve(dir, 'index.ts'),
    `export { default as Biz${pascal} } from './Biz${pascal}.vue'\nexport * from './types'\n`
  )
  writeFileSync(resolve(dir, 'types.ts'), `export interface Biz${pascal}Props {}\n`)
  writeFileSync(
    resolve(dir, `Biz${pascal}.vue`),
    `<script setup lang="ts">\nimport { Card } from '@amg-webui/core'\nimport './style.scss'\n</script>\n<template>\n  <Card class="vp-biz-${name.toLowerCase()}"><slot /></Card>\n</template>\n`
  )
  writeFileSync(resolve(dir, 'style.scss'), `.vp-biz-${name.toLowerCase()} {}\n`)
  console.log('Created', dir)
  console.log('Hint: run npm run generate:entry && npm run extract:i18n')
  process.exit(0)
}

// Add to SSOT map file (append into PACKAGE_COMPONENTS[layer])
const mapPath = resolve(root, 'scripts/component-package-map.mjs')
let mapSrc = readFileSync(mapPath, 'utf8')
const marker = `  ${layer}: [`
const idx = mapSrc.indexOf(marker)
if (idx < 0) {
  console.error('Cannot find package list for', layer)
  process.exit(1)
}
const insertAt = mapSrc.indexOf('[', idx) + 1
const insertion = `\n    '${name}',`
if (mapSrc.includes(`'${name}'`)) {
  console.error('Already mapped:', name)
  process.exit(1)
}
mapSrc = mapSrc.slice(0, insertAt) + insertion + mapSrc.slice(insertAt)
writeFileSync(mapPath, mapSrc, 'utf8')

const dir =
  layer === 'lowcode'
    ? resolve(root, 'packages/lowcode/ui', name)
    : resolve(root, 'packages/components', layer, name)
if (existsSync(dir)) {
  console.error('Already exists:', dir)
  process.exit(1)
}
mkdirSync(resolve(dir, 'composables'), { recursive: true })
writeFileSync(
  resolve(dir, 'index.ts'),
  `import Comp from './index.vue'\nexport { Comp as ${name} }\nexport default Comp\n`
)
writeFileSync(
  resolve(dir, 'index.vue'),
  `<script setup lang="ts">\nimport './style.scss'\n</script>\n<template>\n  <div class="vp-${name.toLowerCase()}"><slot /></div>\n</template>\n`
)
writeFileSync(resolve(dir, 'style.scss'), `.vp-${name.toLowerCase()} {}\n`)
writeFileSync(resolve(dir, 'types.ts'), `export interface ${name}Props {}\n`)
console.log('Created', dir)
console.log('Hint: run npm run generate:entry after creating components')
console.log('Hint: add LocaleKeys + all locale packs if the component has UI copy')
