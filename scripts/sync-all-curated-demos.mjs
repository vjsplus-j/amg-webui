/**
 * Generate missing curated demos + sync DEMO_REGISTRY + patch example.doc i18n.
 * Usage: node scripts/sync-all-curated-demos.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = join(root, 'example/demos')
const baseDir = join(root, 'packages/components/base')
const registryPath = join(demosDir, 'registry.ts')
const maturity = JSON.parse(readFileSync(join(root, 'example/component-maturity.json'), 'utf8'))

const INTENTIONAL_SKIP = new Set([
  'BreadcrumbItem',
  'StepItem',
  'DescriptionsItem',
  'TimelineItem',
  'TabPane',
  'TelemetryProvider'
])

function toCamel(name) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function demoTemplate(name) {
  const camel = toCamel(name)
  return `<script setup lang="ts">
import { computed } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const codeBasic = demoSfc({
  imports: [\`import { ${name} } from '@amg-webui/components/base'\`],
  template: ['  <${name} />']
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'class / style',
    type: 'BaseProps',
    description: t('example.doc.${camel}.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock
      :title="t('example.doc.${camel}.demo.basic')"
      :description="t('example.doc.${camel}.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <${name} />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

const names = Object.keys(maturity.components).filter((n) => existsSync(join(baseDir, n)))
const created = []
for (const name of names) {
  if (INTENTIONAL_SKIP.has(name)) continue
  const dir = join(demosDir, name)
  const file = join(dir, 'index.vue')
  if (!existsSync(file)) {
    mkdirSync(dir, { recursive: true })
    writeFileSync(file, demoTemplate(name), 'utf8')
    created.push(name)
  }
}

// Sync registry: every folder with index.vue gets an entry
const folders = readdirSync(demosDir).filter((d) =>
  existsSync(join(demosDir, d, 'index.vue'))
)
let registry = readFileSync(registryPath, 'utf8')
const existing = new Set([...registry.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]))
const additions = []
for (const name of folders.sort()) {
  if (existing.has(name)) continue
  const camel = toCamel(name)
  additions.push(
    `  ${name}: { whenKey: 'example.doc.${camel}.when', Demo: loadDemo('${name}') },`
  )
}
if (additions.length) {
  registry = registry.replace(
    /\n\}\n\nexport function getCuratedDemo/,
    `\n${additions.join('\n')}\n}\n\nexport function getCuratedDemo`
  )
  writeFileSync(registryPath, registry, 'utf8')
}

// Patch locale packs with missing example.doc keys
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']
const copy = {
  'zh-CN': (n) => ({
    when: `${n} 组件演示。`,
    basic: '基础用法',
    basicDesc: `挂载 ${n} 查看基础能力。`,
    propBase: '透传 class / style'
  }),
  'zh-TW': (n) => ({
    when: `${n} 元件演示。`,
    basic: '基礎礎用法',
    basicDesc: `掛載 ${n} 檢視基礎能力。`,
    propBase: '透傳 class / style'
  }),
  'en-US': (n) => ({
    when: `Demo for ${n}.`,
    basic: 'Basic usage',
    basicDesc: `Mount ${n} to preview core behavior.`,
    propBase: 'Forward class / style'
  }),
  'ja-JP': (n) => ({
    when: `${n} のデモ。`,
    basic: '基本用法',
    basicDesc: `${n} をマウントして基本動作を確認します。`,
    propBase: 'class / style を転送'
  }),
  'ko-KR': (n) => ({
    when: `${n} 데모.`,
    basic: '기본 사용',
    basicDesc: `${n}를 마운트해 기본 동작을 확인합니다.`,
    propBase: 'class / style 전달'
  }),
  'ko-KP': (n) => ({
    when: `${n} 데모.`,
    basic: '기본 사용',
    basicDesc: `${n}를 마운트해 기본 동작을 확인합니다.`,
    propBase: 'class / style 전달'
  }),
  'ru-RU': (n) => ({
    when: `Демо ${n}.`,
    basic: 'Базовое использование',
    basicDesc: `Смонтируйте ${n} для проверки базового поведения.`,
    propBase: 'Проброс class / style'
  })
}

for (const loc of locales) {
  const path = join(root, `packages/locale/${loc}/exampleDoc.ts`)
  if (!existsSync(path)) continue
  let src = readFileSync(path, 'utf8')
  const blocks = []
  for (const name of folders) {
    const camel = toCamel(name)
    const key = `'example.doc.${camel}.when'`
    if (src.includes(key)) continue
    const c = copy[loc](name)
    blocks.push(
      `  'example.doc.${camel}.when': ${JSON.stringify(c.when)},`,
      `  'example.doc.${camel}.demo.basic': ${JSON.stringify(c.basic)},`,
      `  'example.doc.${camel}.demo.basicDesc': ${JSON.stringify(c.basicDesc)},`,
      `  'example.doc.${camel}.prop.base': ${JSON.stringify(c.propBase)},`
    )
  }
  if (!blocks.length) continue
  // insert before closing `}`
  src = src.replace(/\n\}\s*$/, `\n${blocks.join('\n')}\n}\n`)
  writeFileSync(path, src, 'utf8')
}

console.log(
  JSON.stringify(
    {
      createdDemos: created.length,
      createdSample: created.slice(0, 20),
      registryAdded: additions.length,
      demoFolders: folders.length
    },
    null,
    2
  )
)
