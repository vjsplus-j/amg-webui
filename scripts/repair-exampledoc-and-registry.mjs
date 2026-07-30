/**
 * Deduplicate keys in exampleDoc.ts locale packs.
 * Rebuild DEMO_REGISTRY from demo folders.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = join(root, 'example/demos')
const registryPath = join(demosDir, 'registry.ts')

function toCamel(name) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function dedupeLocale(filePath) {
  const src = readFileSync(filePath, 'utf8')
  const map = new Map()
  // 'key': value,  OR  "key": value,
  const lineRe = /^\s*(['"])((?:\\\1|(?!\1).)+)\1:\s*(.+?),\s*$/
  for (const line of src.split(/\r?\n/)) {
    const m = line.match(lineRe)
    if (!m) continue
    map.set(m[2], m[3])
  }
  const lines = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `  '${k}': ${v},`)
  writeFileSync(filePath, `export default {\n${lines.join('\n')}\n}\n`, 'utf8')
  return map.size
}

const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']
const localeStats = {}
for (const loc of locales) {
  const p = join(root, `packages/locale/${loc}/exampleDoc.ts`)
  if (existsSync(p)) localeStats[loc] = dedupeLocale(p)
}

const folders = readdirSync(demosDir)
  .filter((d) => existsSync(join(demosDir, d, 'index.vue')))
  .sort()

const copyFns = {
  'zh-CN': (n) => ({
    when: `${n} 组件演示。`,
    basic: '基础用法',
    basicDesc: `挂载 ${n} 查看基础能力。`,
    propBase: '透传 class / style'
  }),
  'zh-TW': (n) => ({
    when: `${n} 元件演示。`,
    basic: '基礎用法',
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
  const p = join(root, `packages/locale/${loc}/exampleDoc.ts`)
  if (!existsSync(p)) continue
  let src = readFileSync(p, 'utf8')
  const adds = []
  for (const name of folders) {
    const camel = toCamel(name)
    const whenKey = `example.doc.${camel}.when`
    if (src.includes(`'${whenKey}'`)) continue
    const c = copyFns[loc](name)
    adds.push(
      `  '${whenKey}': ${JSON.stringify(c.when)},`,
      `  'example.doc.${camel}.demo.basic': ${JSON.stringify(c.basic)},`,
      `  'example.doc.${camel}.demo.basicDesc': ${JSON.stringify(c.basicDesc)},`,
      `  'example.doc.${camel}.prop.base': ${JSON.stringify(c.propBase)},`
    )
  }
  if (adds.length) {
    src = src.replace(/\n\}\s*$/, `\n${adds.join('\n')}\n}\n`)
    writeFileSync(p, src, 'utf8')
  }
}

const entries = folders
  .map((name) => {
    const camel = toCamel(name)
    return `  ${name}: { whenKey: 'example.doc.${camel}.when', Demo: loadDemo('${name}') },`
  })
  .join('\n')

writeFileSync(
  registryPath,
  `import type { Component } from 'vue'

export interface CuratedDemoDoc {
  whenKey: string
  Demo: Component
}

const modules = import.meta.glob('./*/index.vue', { eager: true }) as Record<
  string,
  { default: Component }
>

function loadDemo(folder: string): Component {
  const key = Object.keys(modules).find((p) => p.includes('/' + folder + '/'))
  if (!key) throw new Error('Missing curated demo: ' + folder)
  return modules[key].default
}

/** Curated docs — synced by scripts/repair-exampledoc-and-registry.mjs */
export const DEMO_REGISTRY: Record<string, CuratedDemoDoc> = {
${entries}
}

export function getCuratedDemo(name: string): CuratedDemoDoc | undefined {
  return DEMO_REGISTRY[name]
}
`,
  'utf8'
)

writeFileSync(
  join(demosDir, 'CanvasNode/index.vue'),
  `<script setup lang="ts">
import { computed } from 'vue'
import { CanvasNode } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import type { CanvasNodeData } from '@amg-webui/utils'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const sampleNode: CanvasNodeData = {
  id: 'n1',
  type: 'default',
  x: 24,
  y: 24,
  w: 120,
  h: 48,
  label: 'Node',
  props: {}
}

const codeBasic = demoSfc({
  imports: [\`import { CanvasNode } from '@amg-webui/components/base'\`],
  template: ['  <CanvasNode :node="sampleNode" />']
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'node',
    type: 'CanvasNodeData',
    description: t('example.doc.canvasNode.prop.base')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.canvasNode.when') }}</p>
    <DemoBlock
      :title="t('example.doc.canvasNode.demo.basic')"
      :description="t('example.doc.canvasNode.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-canvas-node-stage">
        <CanvasNode :node="sampleNode" />
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-canvas-node-stage {
  position: relative;
  width: 100%;
  min-height: calc(var(--spacing-2xl) * 4);
  box-sizing: border-box;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}
</style>
`,
  'utf8'
)

console.log(JSON.stringify({ localeStats, registryEntries: folders.length }, null, 2))
