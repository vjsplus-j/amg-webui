/**
 * Upgrade thin curated demos to use getSampleMountProps instead of bare <Name />.
 * Usage: node scripts/upgrade-thin-demos.mjs [--dry-run]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = join(root, 'example/demos')
const dryRun = process.argv.includes('--dry-run')

/** Known rich demos — never overwrite */
const SKIP_RICH = new Set([
  'AdvancedSearch',
  'Alert',
  'Anchor',
  'Avatar',
  'AvatarGroup',
  'BackTop',
  'Badge',
  'BarChart',
  'Block',
  'Button',
  'ButtonGroup',
  'Card',
  'CardGrid',
  'CardWidgets',
  'Checkbox',
  'Collapse',
  'CopyText',
  'Dashboard',
  'DataTable',
  'Dialog',
  'Drawer',
  'Dropdown',
  'Ellipsis',
  'Empty',
  'Exception',
  'FixedLayout',
  'FloatButton',
  'FloatNav',
  'Footer',
  'Form',
  'Header',
  'Highlight',
  'Icon',
  'InputText',
  'Layout',
  'Link',
  'Main',
  'Mask',
  'Menu',
  'Progress',
  'Radio',
  'Row',
  'Select',
  'Skeleton',
  'Space',
  'Spin',
  'Split',
  'Statistic',
  'StepNav',
  'Switch',
  'Tabs',
  'TabsNav',
  'Tag',
  'TopNav',
  'Tree',
  'Typography',
  'Upload'
])

/** Re-export / alias demos */
const SKIP_ALIAS = new Set(['Col'])

function toCamel(name) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function isRichDemo(content, name) {
  const lines = content.split('\n').length
  const hasState = /\bref\(|\breactive\(|\bcomputed\(/.test(content)
  const hasBind =
    /v-bind="mountProps"|:options=|:items=|:data=|:columns=|:node=|:rows=|v-model|:visible=|:src=/.test(
      content
    )
  const hasMultiBlock = (content.match(/<DemoBlock/g) ?? []).length > 1
  return lines > 80 && (hasState || hasBind || hasMultiBlock)
}

function isThinDemo(content, name) {
  if (SKIP_RICH.has(name) || SKIP_ALIAS.has(name)) return false
  if (isRichDemo(content, name)) return false

  const lines = content.split('\n').length
  const bareMount = new RegExp(`<${name}\\s*/>`).test(content)
  const alreadyUpgraded = /getSampleMountProps|DemoSafeHost|v-bind="mountProps"/.test(content)
  if (alreadyUpgraded) return false

  const scaffoldOnly =
    bareMount &&
    /template:\s*\[\s*'  <' \+ name/.test(content.replace(/\s/g, '')) === false &&
    /template:\s*\[\s*`  <${name} \/>`/.test(content)

  // Detect sync-all-curated-demos scaffold pattern
  const isScaffold =
    content.includes("template: ['  <" + name + " />']") ||
    content.includes('template: [`  <' + name + ' />`]')

  return lines < 55 || bareMount || isScaffold || scaffoldOnly
}

function upgradeTemplate(name) {
  const camel = toCamel(name)
  return `<script setup lang="ts">
import { computed } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import { getSampleMountProps } from '../_shared/sampleMountProps'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const mountProps = computed(() => getSampleMountProps('${name}'))

const codeBasic = demoSfc({
  imports: [
    \`import { ${name} } from '@amg-webui/components/base'\`,
    \`import { getSampleMountProps } from '../_shared/sampleMountProps'\`
  ],
  script: [\`const mountProps = getSampleMountProps('${name}')\`],
  template: [\`  <${name} v-bind="mountProps" />\`]
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
      <${name} v-bind="mountProps" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

const folders = readdirSync(demosDir).filter((d) => {
  if (d.startsWith('_')) return false
  return existsSync(join(demosDir, d, 'index.vue'))
})

const upgraded = []
const skipped = []

for (const name of folders.sort()) {
  const file = join(demosDir, name, 'index.vue')
  const content = readFileSync(file, 'utf8')

  if (!isThinDemo(content, name)) {
    skipped.push(name)
    continue
  }

  const next = upgradeTemplate(name)
  if (!dryRun) {
    writeFileSync(file, next, 'utf8')
  }
  upgraded.push(name)
}

console.log(`Thin demos upgraded: ${upgraded.length}${dryRun ? ' (dry-run)' : ''}`)
console.log(`Skipped (rich / alias): ${skipped.length}`)
if (upgraded.length) {
  console.log('Upgraded:', upgraded.join(', '))
}
