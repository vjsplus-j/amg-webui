/**
 * Scaffold a component under packages/components/base or business.
 * Usage: node scripts/create-component.mjs base MyWidget
 *        node scripts/create-component.mjs business payments
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [, , layer, name] = process.argv

if (!layer || !name || !['base', 'business'].includes(layer)) {
  console.error('Usage: node scripts/create-component.mjs <base|business> <Name>')
  process.exit(1)
}

const dir =
  layer === 'base'
    ? resolve(root, 'packages/components/base', name)
    : resolve(root, 'packages/components/business', name.toLowerCase())

if (existsSync(dir)) {
  console.error('Already exists:', dir)
  process.exit(1)
}

mkdirSync(resolve(dir, 'composables'), { recursive: true })

if (layer === 'base') {
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
  console.log('Hint: run npm run generate:entry after creating components')
  console.log('Hint: add LocaleKeys + all locale packs if the component has UI copy')
} else {
  const pascal = name.charAt(0).toUpperCase() + name.slice(1)
  writeFileSync(
    resolve(dir, 'index.ts'),
    `export { default as Biz${pascal} } from './Biz${pascal}.vue'\nexport * from './types'\n`
  )
  writeFileSync(resolve(dir, 'types.ts'), `export interface Biz${pascal}Props {}\n`)
  writeFileSync(
    resolve(dir, `Biz${pascal}.vue`),
    `<script setup lang="ts">\nimport { Card } from '@amg-webui/components/base'\nimport './style.scss'\n</script>\n<template>\n  <Card class="vp-biz-${name.toLowerCase()}"><slot /></Card>\n</template>\n`
  )
  writeFileSync(resolve(dir, 'style.scss'), `.vp-biz-${name.toLowerCase()} {}\n`)
  console.log('Hint: run npm run generate:entry && npm run extract:i18n')
}

console.log('Created', dir)
