/**
 * Generate curated demos + i18n for W2 data-display / chart / table / lowcode components.
 * Run: node scripts/gen-data-display-demos.mjs
 */
import { writeFileSync, mkdirSync, readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = join(root, 'example/demos')
const localeRoot = join(root, 'packages/locale')

const MOCK_SVG = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="140" viewBox="0 0 240 140"><rect fill="var(--surface-2,#e8eaed)" width="240" height="140" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="var(--text-secondary,#666)" font-size="14">Preview</text></svg>'
)
const MOCK_IMG = `data:image/svg+xml,${MOCK_SVG}`

function writeDemo(folder, content) {
  const dir = join(demosDir, folder)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.vue'), content, 'utf8')
  console.log('demo', folder)
}

const treeOptionsCode = `const treeOptions = computed(() => [
  {
    label: t('example.doc.tree.sample.a'),
    value: 'a',
    children: [
      { label: t('example.doc.tree.sample.a1'), value: 'a1' },
      { label: t('example.doc.tree.sample.a2'), value: 'a2' }
    ]
  },
  {
    label: t('example.doc.tree.sample.b'),
    value: 'b',
    children: [{ label: t('example.doc.tree.sample.b1'), value: 'b1' }]
  }
])`

const tableColumnsCode = `const columns = computed(() => [
  { field: 'id', header: 'ID', width: '4rem', sortable: true },
  { field: 'name', header: t('example.doc.proTable.sample.name'), sortable: true },
  { field: 'status', header: t('example.doc.proTable.sample.status'), sortable: true },
  { field: 'value', header: t('example.doc.proTable.sample.value'), sortable: true, align: 'right' as const }
])`

const makeRowsCode = `function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: \`Row-\${String(i + 1).padStart(3, '0')}\`,
    status: i % 2 === 0 ? 'online' : 'offline',
    value: (i + 1) * 7
  }))
}`

const demoShell = (imports, body, templateExtra = '') => `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${imports} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
${body}
</script>

<template>
  <div class="vp-curated">
    ${templateExtra}
  </div>
</template>
`

// ── Tree family ──────────────────────────────────────────────
writeDemo(
  'Tree',
  demoShell(
    'Tree, Button, Space',
    `${treeOptionsCode}
const checked = ref<string[]>([])
const codeBasic = demoSfc({
  imports: [\`import { Tree } from '@amg-webui/components/base'\`],
  template: ['  <Tree v-model="checked" :options="treeOptions" checkable />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'options / data', type: 'TreeNode[]', defaultValue: '[]', description: t('example.doc.tree.prop.data') },
  { name: 'checkable', type: 'boolean', defaultValue: 'true', description: t('example.doc.tree.prop.checkable') },
  { name: 'v-model', type: 'string[]', defaultValue: '[]', description: t('example.doc.tree.prop.model') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.tree.when') }}</p>
    <DemoBlock :title="t('example.doc.tree.demo.basic')" :description="t('example.doc.tree.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Tree v-model="checked" :options="treeOptions" checkable />
        <p class="vp-curated__hint">{{ t('example.doc.tree.sample.checked') }}: {{ checked.join(', ') || '—' }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'VirtualTree',
  demoShell(
    'VirtualTree, Space',
    `${treeOptionsCode}
const bigTree = computed(() =>
  Array.from({ length: 40 }, (_, i) => ({
    label: t('example.doc.virtualTree.sample.node', { n: i + 1 }),
    value: \`n\${i + 1}\`,
    children: i % 5 === 0 ? [{ label: t('example.doc.virtualTree.sample.child'), value: \`c\${i}\` }] : undefined
  }))
)
const checked = ref<string[]>([])
const codeBasic = demoSfc({
  imports: [\`import { VirtualTree } from '@amg-webui/components/base'\`],
  template: ['  <VirtualTree v-model="checked" :options="bigTree" checkable />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'virtual', type: 'boolean', defaultValue: 'true', description: t('example.doc.virtualTree.prop.virtual') },
  { name: 'options', type: 'TreeNode[]', defaultValue: '[]', description: t('example.doc.tree.prop.data') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.virtualTree.when') }}</p>
    <DemoBlock :title="t('example.doc.virtualTree.demo.basic')" :description="t('example.doc.virtualTree.demo.basicDesc')" :code="codeBasic" default-open>
      <VirtualTree v-model="checked" :options="bigTree" checkable />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'LazyTree',
  `<script setup lang="ts">
import { computed, ref } from 'vue'
import { LazyTree, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const nodes = ref<TreeNode[]>([
  { label: t('example.doc.lazyTree.sample.root'), value: 'root', children: [] },
  { label: t('example.doc.lazyTree.sample.branch'), value: 'branch' }
])
const checked = ref<string[]>([])

function onLoad(node: TreeNode) {
  if (node.value === 'branch') {
    node.children = [
      { label: t('example.doc.lazyTree.sample.leaf1'), value: 'l1', isLeaf: true },
      { label: t('example.doc.lazyTree.sample.leaf2'), value: 'l2', isLeaf: true }
    ]
  }
}

const codeBasic = demoSfc({
  imports: [\`import { LazyTree } from '@amg-webui/components/base'\`],
  template: ['  <LazyTree :options="nodes" @load="onLoad" checkable />']
})

const propRows = computed<PropRow[]>(() => [
  { name: '@load', type: '(node) => void', defaultValue: '-', description: t('example.doc.lazyTree.prop.load') },
  { name: 'checkable', type: 'boolean', defaultValue: 'true', description: t('example.doc.tree.prop.checkable') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.lazyTree.when') }}</p>
    <DemoBlock :title="t('example.doc.lazyTree.demo.basic')" :description="t('example.doc.lazyTree.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <LazyTree v-model="checked" :options="nodes" checkable @load="onLoad" />
        <p class="vp-curated__hint">{{ t('example.doc.lazyTree.sample.hint') }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>`
)

// ── Table family ─────────────────────────────────────────────
writeDemo(
  'ProTable',
  demoShell(
    'ProTable, Space',
    `${tableColumnsCode}
${makeRowsCode}
const rows = ref(makeRows(48))
const codeBasic = demoSfc({
  imports: [\`import { ProTable } from '@amg-webui/components/base'\`],
  template: ['  <ProTable :columns="columns" :rows="rows" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'columns', type: 'TableColumn[]', defaultValue: 'auto', description: t('example.doc.proTable.prop.columns') },
  { name: 'rows', type: 'Record[]', defaultValue: '[]', description: t('example.doc.proTable.prop.rows') },
  { name: 'toolbar', type: 'slot', defaultValue: '-', description: t('example.doc.proTable.prop.toolbar') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.proTable.when') }}</p>
    <DemoBlock :title="t('example.doc.proTable.demo.basic')" :description="t('example.doc.proTable.demo.basicDesc')" :code="codeBasic" default-open>
      <ProTable :columns="columns" :rows="rows" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'VirtualTable',
  demoShell(
    'VirtualTable',
    `${tableColumnsCode}
${makeRowsCode}
const rows = ref(makeRows(500))
const codeBasic = demoSfc({
  imports: [\`import { VirtualTable } from '@amg-webui/components/base'\`],
  template: ['  <VirtualTable :columns="columns" :rows="rows" virtual />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'virtual', type: 'boolean', defaultValue: 'true', description: t('example.doc.virtualTable.prop.virtual') },
  { name: 'rows', type: 'Record[]', defaultValue: '[]', description: t('example.doc.proTable.prop.rows') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.virtualTable.when') }}</p>
    <DemoBlock :title="t('example.doc.virtualTable.demo.basic')" :description="t('example.doc.virtualTable.demo.basicDesc')" :code="codeBasic" default-open>
      <VirtualTable :columns="columns" :rows="rows" virtual />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'TreeTable',
  demoShell(
    'TreeTable',
    `const rows = computed(() => [
  {
    id: 1,
    label: t('example.doc.treeTable.sample.parent'),
    status: 'online',
    children: [
      { id: 11, label: t('example.doc.treeTable.sample.child1'), status: 'online' },
      { id: 12, label: t('example.doc.treeTable.sample.child2'), status: 'offline' }
    ]
  },
  { id: 2, label: t('example.doc.treeTable.sample.solo'), status: 'offline' }
])
const codeBasic = demoSfc({
  imports: [\`import { TreeTable } from '@amg-webui/components/base'\`],
  template: ['  <TreeTable :rows="rows" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'rows', type: 'TreeRow[]', defaultValue: '[]', description: t('example.doc.treeTable.prop.rows') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.treeTable.when') }}</p>
    <DemoBlock :title="t('example.doc.treeTable.demo.basic')" :description="t('example.doc.treeTable.demo.basicDesc')" :code="codeBasic" default-open>
      <TreeTable :rows="rows" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'EditTable',
  demoShell(
    'EditTable',
    `${tableColumnsCode}
const rows = ref([
  { id: 1, name: 'Alpha', status: 'online', value: 12 },
  { id: 2, name: 'Beta', status: 'offline', value: 28 },
  { id: 3, name: 'Gamma', status: 'online', value: 18 }
])
const codeBasic = demoSfc({
  imports: [\`import { EditTable } from '@amg-webui/components/base'\`],
  template: ['  <EditTable :columns="columns" :rows="rows" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'rows', type: 'Record[]', defaultValue: '[]', description: t('example.doc.editTable.prop.rows') },
  { name: '@change', type: '(rows) => void', defaultValue: '-', description: t('example.doc.editTable.prop.change') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.editTable.when') }}</p>
    <DemoBlock :title="t('example.doc.editTable.demo.basic')" :description="t('example.doc.editTable.demo.basicDesc')" :code="codeBasic" default-open>
      <EditTable :columns="columns" :rows="rows" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

// ── Display ──────────────────────────────────────────────────
writeDemo(
  'Carousel',
  demoShell(
    'Carousel, Button, Space',
    `const mockImg = '${MOCK_IMG}'
const slides = computed(() => [
  { title: t('example.doc.carousel.sample.s1'), content: t('example.doc.carousel.sample.c1'), image: mockImg },
  { title: t('example.doc.carousel.sample.s2'), content: t('example.doc.carousel.sample.c2'), image: mockImg },
  { title: t('example.doc.carousel.sample.s3'), content: t('example.doc.carousel.sample.c3'), image: mockImg }
])
const index = ref(0)
const autoplay = ref(true)
const codeBasic = demoSfc({
  imports: [\`import { Carousel } from '@amg-webui/components/base'\`],
  template: ['  <Carousel v-model="index" :slides="slides" autoplay />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'slides', type: 'Slide[]', defaultValue: '[]', description: t('example.doc.carousel.prop.slides') },
  { name: 'autoplay', type: 'boolean', defaultValue: 'true', description: t('example.doc.carousel.prop.autoplay') },
  { name: 'interval', type: 'number', defaultValue: '4000', description: t('example.doc.carousel.prop.interval') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.carousel.when') }}</p>
    <DemoBlock :title="t('example.doc.carousel.demo.basic')" :description="t('example.doc.carousel.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Carousel v-model="index" :slides="slides" :autoplay="autoplay" />
        <Button size="sm" :variant="autoplay ? 'solid' : 'outlined'" @click="autoplay = !autoplay">
          {{ t('example.doc.carousel.demo.autoplayToggle') }}
        </Button>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'CardList',
  demoShell(
    'CardList',
    `const mockImg = '${MOCK_IMG}'
const items = computed(() =>
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: t('example.doc.cardList.sample.title', { n: i + 1 }),
    description: t('example.doc.cardList.sample.desc'),
    image: mockImg
  }))
)
const selected = ref<(string | number)[]>([])
const codeBasic = demoSfc({
  imports: [\`import { CardList } from '@amg-webui/components/base'\`],
  template: ['  <CardList v-model="selected" :items="items" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'items', type: 'CardItem[]', defaultValue: '[]', description: t('example.doc.cardList.prop.items') },
  { name: 'v-model', type: 'id[]', defaultValue: '[]', description: t('example.doc.cardList.prop.model') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.cardList.when') }}</p>
    <DemoBlock :title="t('example.doc.cardList.demo.basic')" :description="t('example.doc.cardList.demo.basicDesc')" :code="codeBasic" default-open>
      <CardList v-model="selected" :items="items" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Waterfall',
  demoShell(
    'Waterfall',
    `const items = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    height: 80 + (i % 4) * 24,
    title: t('example.doc.waterfall.sample.item', { n: i + 1 })
  }))
)
const codeBasic = demoSfc({
  imports: [\`import { Waterfall } from '@amg-webui/components/base'\`],
  template: ['  <Waterfall :items="items" :columns="3" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'items', type: 'Card[]', defaultValue: '[]', description: t('example.doc.waterfall.prop.data') },
  { name: 'columns', type: 'number', defaultValue: '3', description: t('example.doc.waterfall.prop.columns') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.waterfall.when') }}</p>
    <DemoBlock :title="t('example.doc.waterfall.demo.basic')" :description="t('example.doc.waterfall.demo.basicDesc')" :code="codeBasic" default-open>
      <Waterfall :items="items" :columns="3" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

// Chart helper
function chartDemo(name, comp, dataExpr, propName = 'data') {
  writeDemo(
    name,
    demoShell(
      comp,
      `const chartData = ${dataExpr}
const codeBasic = demoSfc({
  imports: [\`import { ${comp} } from '@amg-webui/components/base'\`],
  template: [\`  <${comp} :${propName}="chartData" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: '${propName}', type: 'number[] | object', defaultValue: 'built-in', description: t('example.doc.${name.charAt(0).toLowerCase() + name.slice(1)}.prop.data') }
])`,
      `<p class="vp-curated__lead">{{ t('example.doc.${name.charAt(0).toLowerCase() + name.slice(1)}.when') }}</p>
    <DemoBlock :title="t('example.doc.${name.charAt(0).toLowerCase() + name.slice(1)}.demo.basic')" :description="t('example.doc.${name.charAt(0).toLowerCase() + name.slice(1)}.demo.basicDesc')" :code="codeBasic" default-open>
      <${comp} :${propName}="chartData" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
    )
  )
}

chartDemo('BarChart', 'BarChart', 'ref([40, 65, 30, 80, 55, 70])')
chartDemo('PieChart', 'PieChart', 'ref([30, 25, 20, 15, 10])')
chartDemo('LineChart', 'LineChart', 'ref([20, 45, 30, 60, 40, 75, 55])')
chartDemo('GaugeChart', 'GaugeChart', 'ref(72)')
chartDemo('HeatMap', 'HeatMap', 'ref(Array.from({ length: 28 }, (_, i) => Math.round(Math.random() * 100)))')
chartDemo('RadarChart', 'RadarChart', 'ref([80, 60, 90, 70, 85])')
chartDemo('WordCloud', 'WordCloud', `computed(() => [
  { label: t('example.doc.wordCloud.sample.a'), value: 90 },
  { label: t('example.doc.wordCloud.sample.b'), value: 72 },
  { label: t('example.doc.wordCloud.sample.c'), value: 58 },
  { label: t('example.doc.wordCloud.sample.d'), value: 44 }
])`, 'data')

writeDemo(
  'Ranking',
  demoShell(
    'Ranking, Button',
    `const items = computed(() => [
  { label: t('example.doc.ranking.sample.a'), value: 92 },
  { label: t('example.doc.ranking.sample.b'), value: 78 },
  { label: t('example.doc.ranking.sample.c'), value: 65 },
  { label: t('example.doc.ranking.sample.d'), value: 50 },
  { label: t('example.doc.ranking.sample.e'), value: 38 }
])
const codeBasic = demoSfc({
  imports: [\`import { Ranking } from '@amg-webui/components/base'\`],
  template: ['  <Ranking :items="items" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'items', type: '{ label; value }[]', defaultValue: '[]', description: t('example.doc.ranking.prop.items') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.ranking.when') }}</p>
    <DemoBlock :title="t('example.doc.ranking.demo.basic')" :description="t('example.doc.ranking.demo.basicDesc')" :code="codeBasic" default-open>
      <Ranking :items="items" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

// ── Utility display ──────────────────────────────────────────
writeDemo(
  'Calendar',
  demoShell(
    'Calendar, Space',
    `const picked = ref<string | null>(null)
const codeBasic = demoSfc({
  imports: [\`import { Calendar } from '@amg-webui/components/base'\`],
  template: ['  <Calendar v-model="picked" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'v-model', type: 'Date | string | null', defaultValue: 'null', description: t('example.doc.calendar.prop.model') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.calendar.when') }}</p>
    <DemoBlock :title="t('example.doc.calendar.demo.basic')" :description="t('example.doc.calendar.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <Calendar v-model="picked" />
        <p class="vp-curated__hint">{{ t('example.doc.calendar.sample.picked') }}: {{ picked ?? '—' }}</p>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Qrcode',
  demoShell(
    'Qrcode, InputText, Space',
    `const text = ref('https://amg-webui.example')
const codeBasic = demoSfc({
  imports: [\`import { Qrcode } from '@amg-webui/components/base'\`],
  template: ['  <Qrcode v-model="text" :size="160" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'value / v-model', type: 'string', defaultValue: "''", description: t('example.doc.qrcode.prop.value') },
  { name: 'size', type: 'number', defaultValue: '128', description: t('example.doc.qrcode.prop.size') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.qrcode.when') }}</p>
    <DemoBlock :title="t('example.doc.qrcode.demo.basic')" :description="t('example.doc.qrcode.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <InputText v-model="text" :placeholder="t('example.doc.qrcode.sample.placeholder')" />
        <Qrcode v-model="text" :size="160" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Barcode',
  demoShell(
    'Barcode, InputText, Space',
    `const code = ref('AMG-20260730')
const codeBasic = demoSfc({
  imports: [\`import { Barcode } from '@amg-webui/components/base'\`],
  template: ['  <Barcode v-model="code" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'value / v-model', type: 'string', defaultValue: "''", description: t('example.doc.barcode.prop.value') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.barcode.when') }}</p>
    <DemoBlock :title="t('example.doc.barcode.demo.basic')" :description="t('example.doc.barcode.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <InputText v-model="code" />
        <Barcode v-model="code" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Watermark',
  demoShell(
    'Watermark',
    `const content = computed(() => t('example.doc.watermark.sample.text'))
const codeBasic = demoSfc({
  imports: [\`import { Watermark } from '@amg-webui/components/base'\`],
  template: [
    '  <Watermark :content="content">',
    '    <div class="wm-body">{{ t(\\'example.doc.watermark.sample.body\\') }}</div>',
    '  </Watermark>'
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'content', type: 'string', defaultValue: "''", description: t('example.doc.watermark.prop.content') },
  { name: 'opacity', type: 'number', defaultValue: '0.15', description: t('example.doc.watermark.prop.opacity') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.watermark.when') }}</p>
    <DemoBlock :title="t('example.doc.watermark.demo.basic')" :description="t('example.doc.watermark.demo.basicDesc')" :code="codeBasic" default-open>
      <Watermark :content="content">
        <div class="wm-body">{{ t('example.doc.watermark.sample.body') }}</div>
      </Watermark>
    </DemoBlock>
    <PropsTable :rows="propRows" />`,
    `<style scoped>
.wm-body {
  min-height: 8rem;
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
}
</style>`
  )
)

writeDemo(
  'Countdown',
  demoShell(
    'Countdown, Button, Space',
    `const target = ref(Date.now() + 90_000)
function reset() {
  target.value = Date.now() + 90_000
}
const codeBasic = demoSfc({
  imports: [\`import { Countdown } from '@amg-webui/components/base'\`],
  template: ['  <Countdown :value="target" format="mm:ss" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'value', type: 'number | Date', defaultValue: '-', description: t('example.doc.countdown.prop.value') },
  { name: 'format', type: 'string', defaultValue: "'HH:mm:ss'", description: t('example.doc.countdown.prop.format') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.countdown.when') }}</p>
    <DemoBlock :title="t('example.doc.countdown.demo.basic')" :description="t('example.doc.countdown.demo.basicDesc')" :code="codeBasic" default-open>
      <Space wrap>
        <Countdown :value="target" format="mm:ss" />
        <Button size="sm" variant="outlined" @click="reset">{{ t('example.doc.countdown.demo.reset') }}</Button>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'ScrollNotice',
  demoShell(
    'ScrollNotice',
    `const text = computed(() => t('example.doc.scrollNotice.sample.message'))
const codeBasic = demoSfc({
  imports: [\`import { ScrollNotice } from '@amg-webui/components/base'\`],
  template: ['  <ScrollNotice :text="text" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'text', type: 'string', defaultValue: "''", description: t('example.doc.scrollNotice.prop.text') },
  { name: 'speed', type: 'number', defaultValue: '40', description: t('example.doc.scrollNotice.prop.speed') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.scrollNotice.when') }}</p>
    <DemoBlock :title="t('example.doc.scrollNotice.demo.basic')" :description="t('example.doc.scrollNotice.demo.basicDesc')" :code="codeBasic" default-open>
      <ScrollNotice :text="text" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Thumbnail',
  demoShell(
    'Thumbnail',
    `const mockImg = '${MOCK_IMG}'
const codeBasic = demoSfc({
  imports: [\`import { Thumbnail } from '@amg-webui/components/base'\`],
  template: [\`  <Thumbnail :src="mockImg" :alt="t('example.doc.thumbnail.sample.alt')" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'src', type: 'string', defaultValue: "''", description: t('example.doc.thumbnail.prop.src') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.thumbnail.when') }}</p>
    <DemoBlock :title="t('example.doc.thumbnail.demo.basic')" :description="t('example.doc.thumbnail.demo.basicDesc')" :code="codeBasic" default-open>
      <Thumbnail :src="mockImg" :alt="t('example.doc.thumbnail.sample.alt')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'ImageGroup',
  demoShell(
    'ImageGroup',
    `const mockImg = '${MOCK_IMG}'
const images = [mockImg, mockImg, mockImg]
const codeBasic = demoSfc({
  imports: [\`import { ImageGroup } from '@amg-webui/components/base'\`],
  template: ['  <ImageGroup :images="images" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'images', type: 'string[]', defaultValue: '[]', description: t('example.doc.imageGroup.prop.images') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.imageGroup.when') }}</p>
    <DemoBlock :title="t('example.doc.imageGroup.demo.basic')" :description="t('example.doc.imageGroup.demo.basicDesc')" :code="codeBasic" default-open>
      <ImageGroup :images="images" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'Clipboard',
  demoShell(
    'Clipboard, InputText, Space',
    `const text = ref('AMG-WebUI copy demo')
const codeBasic = demoSfc({
  imports: [\`import { Clipboard } from '@amg-webui/components/base'\`],
  template: ['  <Clipboard v-model="text" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'text / v-model', type: 'string', defaultValue: "''", description: t('example.doc.clipboard.prop.text') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.clipboard.when') }}</p>
    <DemoBlock :title="t('example.doc.clipboard.demo.basic')" :description="t('example.doc.clipboard.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <InputText v-model="text" />
        <Clipboard v-model="text" />
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

// ── Lowcode / drag ───────────────────────────────────────────
writeDemo(
  'DragCanvas',
  `<script setup lang="ts">
import { ref } from 'vue'
import { DragCanvas, DragMaterial, Space } from '@amg-webui/components/base'
import type { CanvasNodeData } from '@amg-webui/utils'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const nodes = ref<CanvasNodeData[]>([])
const materials = [
  { type: 'button', label: 'Button', group: 'base' },
  { type: 'input', label: 'Input', group: 'base' },
  { type: 'card', label: 'Card', group: 'layout' }
]

const codeBasic = demoSfc({
  imports: [\`import { DragCanvas, DragMaterial } from '@amg-webui/components/base'\`],
  template: [
    '  <Space>',
    '    <DragMaterial :materials="materials" />',
    '    <DragCanvas v-model="nodes" />',
    '  </Space>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'v-model', type: 'CanvasNodeData[]', defaultValue: '[]', description: t('example.doc.dragCanvas.prop.model') },
  { name: 'mode', type: "'free' | 'grid'", defaultValue: "'free'", description: t('example.doc.dragCanvas.prop.mode') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dragCanvas.when') }}</p>
    <DemoBlock :title="t('example.doc.dragCanvas.demo.basic')" :description="t('example.doc.dragCanvas.demo.basicDesc')" :code="codeBasic" default-open>
      <div class="lc-row">
        <DragMaterial :materials="materials" />
        <DragCanvas v-model="nodes" class="lc-canvas" />
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.lc-row {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  min-height: 16rem;
}
.lc-canvas {
  flex: 1;
  min-width: 0;
}
</style>`
)

writeDemo(
  'DragMaterial',
  demoShell(
    'DragMaterial',
    `const materials = computed(() => [
  { type: 'button', label: t('example.doc.dragMaterial.sample.button'), group: 'base' },
  { type: 'input', label: t('example.doc.dragMaterial.sample.input'), group: 'base' },
  { type: 'card', label: t('example.doc.dragMaterial.sample.card'), group: 'layout' }
])
const codeBasic = demoSfc({
  imports: [\`import { DragMaterial } from '@amg-webui/components/base'\`],
  template: ['  <DragMaterial :materials="materials" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'materials', type: 'CanvasMaterialItem[]', defaultValue: '[]', description: t('example.doc.dragMaterial.prop.materials') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.dragMaterial.when') }}</p>
    <DemoBlock :title="t('example.doc.dragMaterial.demo.basic')" :description="t('example.doc.dragMaterial.demo.basicDesc')" :code="codeBasic" default-open>
      <DragMaterial :materials="materials" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'DragVerify',
  demoShell(
    'DragVerify, Button, Space',
    `const passed = ref(false)
function reset() {
  passed.value = false
}
const codeBasic = demoSfc({
  imports: [\`import { DragVerify } from '@amg-webui/components/base'\`],
  template: ['  <DragVerify v-model="passed" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'v-model', type: 'boolean', defaultValue: 'false', description: t('example.doc.dragVerify.prop.model') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.dragVerify.when') }}</p>
    <DemoBlock :title="t('example.doc.dragVerify.demo.basic')" :description="t('example.doc.dragVerify.demo.basicDesc')" :code="codeBasic" default-open>
      <Space direction="vertical" block size="md">
        <DragVerify v-model="passed" />
        <Space wrap>
          <span class="vp-curated__hint">{{ passed ? t('example.doc.dragVerify.sample.pass') : t('example.doc.dragVerify.sample.wait') }}</span>
          <Button size="sm" variant="outlined" @click="reset">{{ t('example.doc.dragVerify.demo.reset') }}</Button>
        </Space>
      </Space>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'PropPanel',
  `<script setup lang="ts">
import { ref } from 'vue'
import { PropPanel, DragCanvas } from '@amg-webui/components/base'
import type { CanvasNodeData } from '@amg-webui/utils'
import { createCanvasNode } from '@amg-webui/utils'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const nodes = ref<CanvasNodeData[]>([createCanvasNode('button', t('example.doc.propPanel.sample.node'), { x: 24, y: 24 })])

const codeBasic = demoSfc({
  imports: [\`import { PropPanel, DragCanvas } from '@amg-webui/components/base'\`],
  template: [
    '  <div class="lc-row">',
    '    <DragCanvas v-model="nodes" />',
    '    <PropPanel />',
    '  </div>'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'fields', type: 'PropField[]', defaultValue: 'label/w/h', description: t('example.doc.propPanel.prop.fields') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.propPanel.when') }}</p>
    <DemoBlock :title="t('example.doc.propPanel.demo.basic')" :description="t('example.doc.propPanel.demo.basicDesc')" :code="codeBasic" default-open>
      <div class="lc-row">
        <DragCanvas v-model="nodes" class="lc-canvas" />
        <PropPanel />
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.lc-row {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  min-height: 14rem;
}
.lc-canvas {
  flex: 1;
  min-width: 0;
}
</style>`
)

writeDemo(
  'Preview',
  demoShell(
    'Preview',
    `const codeBasic = demoSfc({
  imports: [\`import { Preview } from '@amg-webui/components/base'\`],
  template: [
    '  <Preview>',
    '    <div class="preview-body">{{ t(\\'example.doc.preview.sample.body\\') }}</div>',
    '  </Preview>'
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'zoom', type: 'number', defaultValue: '1', description: t('example.doc.preview.prop.zoom') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.preview.when') }}</p>
    <DemoBlock :title="t('example.doc.preview.demo.basic')" :description="t('example.doc.preview.demo.basicDesc')" :code="codeBasic" default-open>
      <Preview>
        <div class="preview-body">{{ t('example.doc.preview.sample.body') }}</div>
      </Preview>
    </DemoBlock>
    <PropsTable :rows="propRows" />`,
    `<style scoped>
.preview-body {
  padding: var(--theme-section-gap);
  background: var(--surface-1);
  border: 1px dashed var(--ds-border);
  border-radius: var(--theme-card-radius);
  min-height: 6rem;
}
</style>`
  )
)

writeDemo(
  'Print',
  demoShell(
    'Print',
    `const codeBasic = demoSfc({
  imports: [\`import { Print } from '@amg-webui/components/base'\`],
  template: [
    '  <Print>',
    '    <p>{{ t(\\'example.doc.print.sample.line1\\') }}</p>',
    '    <p>{{ t(\\'example.doc.print.sample.line2\\') }}</p>',
    '  </Print>'
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: '@print', type: '() => void', defaultValue: '-', description: t('example.doc.print.prop.event') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.print.when') }}</p>
    <DemoBlock :title="t('example.doc.print.demo.basic')" :description="t('example.doc.print.demo.basicDesc')" :code="codeBasic" default-open>
      <Print>
        <p>{{ t('example.doc.print.sample.line1') }}</p>
        <p>{{ t('example.doc.print.sample.line2') }}</p>
      </Print>
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'ExcelIo',
  demoShell(
    'ExcelIo',
    `${tableColumnsCode}
const data = ref([
  { id: 1, name: 'Alpha', status: 'online', value: 12 },
  { id: 2, name: 'Beta', status: 'offline', value: 28 }
])
const codeBasic = demoSfc({
  imports: [\`import { ExcelIo } from '@amg-webui/components/base'\`],
  template: ['  <ExcelIo :columns="columns" :data="data" filename="demo.csv" />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'data', type: 'Record[]', defaultValue: '[]', description: t('example.doc.excelIo.prop.data') },
  { name: '@import', type: '(rows) => void', defaultValue: '-', description: t('example.doc.excelIo.prop.import') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.excelIo.when') }}</p>
    <DemoBlock :title="t('example.doc.excelIo.demo.basic')" :description="t('example.doc.excelIo.demo.basicDesc')" :code="codeBasic" default-open>
      <ExcelIo :columns="columns" :data="data" filename="demo.csv" />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

writeDemo(
  'OcrScan',
  demoShell(
    'OcrScan, Space',
    `const codeBasic = demoSfc({
  imports: [\`import { OcrScan } from '@amg-webui/components/base'\`],
  template: ['  <OcrScan />']
})
const propRows = computed<PropRow[]>(() => [
  { name: '@scan', type: '(text) => void', defaultValue: '-', description: t('example.doc.ocrScan.prop.scan') }
])`,
    `<p class="vp-curated__lead">{{ t('example.doc.ocrScan.when') }}</p>
    <DemoBlock :title="t('example.doc.ocrScan.demo.basic')" :description="t('example.doc.ocrScan.demo.basicDesc')" :code="codeBasic" default-open>
      <OcrScan />
    </DemoBlock>
    <PropsTable :rows="propRows" />`
  )
)

// ── Registry patch ───────────────────────────────────────────
const registryEntries = [
  'Tree', 'VirtualTree', 'LazyTree', 'ProTable', 'VirtualTable', 'TreeTable', 'EditTable',
  'Carousel', 'CardList', 'Waterfall', 'BarChart', 'PieChart', 'LineChart', 'GaugeChart',
  'HeatMap', 'RadarChart', 'WordCloud', 'Ranking', 'Calendar', 'Qrcode', 'Barcode',
  'Watermark', 'Countdown', 'ScrollNotice', 'Thumbnail', 'ImageGroup', 'Clipboard',
  'DragCanvas', 'DragMaterial', 'DragVerify', 'PropPanel', 'Preview', 'Print', 'ExcelIo', 'OcrScan'
]

const slug = (name) => name.charAt(0).toLowerCase() + name.slice(1)

const registryPath = join(root, 'example/demos/registry.ts')
let regText = readFileSync(registryPath, 'utf8')
for (const name of registryEntries) {
  const key = slug(name)
  const line = `  ${name}: { whenKey: 'example.doc.${key}.when', Demo: loadDemo('${name}') },`
  if (!regText.includes(`loadDemo('${name}')`)) {
    regText = regText.replace(/\n}\n\nexport function getCuratedDemo/, `\n${line}\n}\n\nexport function getCuratedDemo`)
    console.log('registry', name)
  }
}
writeFileSync(registryPath, regText, 'utf8')

// ── i18n patch ───────────────────────────────────────────────
const zhCN = {
  'example.doc.tree.when': '层级树：搜索、展开/折叠、勾选与选中。',
  'example.doc.tree.demo.basic': '可勾选树',
  'example.doc.tree.demo.basicDesc': '内置工具栏搜索与全展/全折；v-model 绑定勾选值。',
  'example.doc.tree.prop.data': '树节点 options 或 data',
  'example.doc.tree.prop.checkable': '是否显示复选框',
  'example.doc.tree.prop.model': '勾选值数组',
  'example.doc.tree.sample.a': '目录 A',
  'example.doc.tree.sample.a1': '子项 A1',
  'example.doc.tree.sample.a2': '子项 A2',
  'example.doc.tree.sample.b': '目录 B',
  'example.doc.tree.sample.b1': '子项 B1',
  'example.doc.tree.sample.checked': '已选',

  'example.doc.virtualTree.when': '虚拟滚动树：万级节点仍流畅，默认开启虚拟列表。',
  'example.doc.virtualTree.demo.basic': '大列表',
  'example.doc.virtualTree.demo.basicDesc': '40 个根节点示例；滚动仅渲染可视区。',
  'example.doc.virtualTree.prop.virtual': '虚拟滚动（默认 true）',
  'example.doc.virtualTree.sample.node': '节点 {n}',
  'example.doc.virtualTree.sample.child': '子节点',

  'example.doc.lazyTree.when': '懒加载树：展开时触发 @load 异步拉取子节点。',
  'example.doc.lazyTree.demo.basic': '按需加载',
  'example.doc.lazyTree.demo.basicDesc': '展开「分支」节点后注入 mock 子叶。',
  'example.doc.lazyTree.prop.load': '展开未加载节点时触发',
  'example.doc.lazyTree.sample.root': '根目录',
  'example.doc.lazyTree.sample.branch': '可展开分支',
  'example.doc.lazyTree.sample.leaf1': '懒加载叶 1',
  'example.doc.lazyTree.sample.leaf2': '懒加载叶 2',
  'example.doc.lazyTree.sample.hint': '展开「可展开分支」以模拟异步 load。',

  'example.doc.proTable.when': '增强表格：排序、列显隐、关键字过滤、导出与打印。',
  'example.doc.proTable.demo.basic': '工具栏表格',
  'example.doc.proTable.demo.basicDesc': '内置搜索与列控制；下方为 mock 数据。',
  'example.doc.proTable.prop.columns': '列定义',
  'example.doc.proTable.prop.rows': '行数据',
  'example.doc.proTable.prop.toolbar': '工具栏插槽',
  'example.doc.proTable.sample.name': '名称',
  'example.doc.proTable.sample.status': '状态',
  'example.doc.proTable.sample.value': '数值',

  'example.doc.virtualTable.when': '虚拟表格：默认虚拟滚动，适合千行以上列表。',
  'example.doc.virtualTable.demo.basic': '500 行',
  'example.doc.virtualTable.demo.basicDesc': '仅渲染可视行；支持排序与导出。',
  'example.doc.virtualTable.prop.virtual': '虚拟滚动开关',

  'example.doc.treeTable.when': '树形表格：可展开层级行，适合组织/菜单结构。',
  'example.doc.treeTable.demo.basic': '层级行',
  'example.doc.treeTable.demo.basicDesc': '点击展开父行查看子行。',
  'example.doc.treeTable.prop.rows': '树形行数据',
  'example.doc.treeTable.sample.parent': '父级部门',
  'example.doc.treeTable.sample.child1': '子部门 1',
  'example.doc.treeTable.sample.child2': '子部门 2',
  'example.doc.treeTable.sample.solo': '独立节点',

  'example.doc.editTable.when': '可编辑表格：单元格点击进入编辑并提交。',
  'example.doc.editTable.demo.basic': '行内编辑',
  'example.doc.editTable.demo.basicDesc': '双击或点击单元格编辑；Enter 提交。',
  'example.doc.editTable.prop.rows': '可编辑行',
  'example.doc.editTable.prop.change': '编辑完成后触发',

  'example.doc.carousel.when': '轮播：自动播放、指示器与前后切换。',
  'example.doc.carousel.demo.basic': '幻灯片',
  'example.doc.carousel.demo.basicDesc': '本地 SVG 占位图，无需外网 CDN。',
  'example.doc.carousel.demo.autoplayToggle': '自动播放',
  'example.doc.carousel.prop.slides': '幻灯片数组',
  'example.doc.carousel.prop.autoplay': '是否自动轮播',
  'example.doc.carousel.prop.interval': '间隔毫秒',
  'example.doc.carousel.sample.s1': '幻灯 1',
  'example.doc.carousel.sample.s2': '幻灯 2',
  'example.doc.carousel.sample.s3': '幻灯 3',
  'example.doc.carousel.sample.c1': '第一条说明文案。',
  'example.doc.carousel.sample.c2': '第二条说明文案。',
  'example.doc.carousel.sample.c3': '第三条说明文案。',

  'example.doc.cardList.when': '卡片列表：网格卡片与多选。',
  'example.doc.cardList.demo.basic': '可选卡片',
  'example.doc.cardList.demo.basicDesc': '点击卡片切换选中；v-model 为 id 数组。',
  'example.doc.cardList.prop.items': '卡片项',
  'example.doc.cardList.prop.model': '选中 id 列表',
  'example.doc.cardList.sample.title': '卡片 {n}',
  'example.doc.cardList.sample.desc': '示例描述文案。',

  'example.doc.waterfall.when': '瀑布流：多列不等高卡片布局。',
  'example.doc.waterfall.demo.basic': '三列瀑布',
  'example.doc.waterfall.demo.basicDesc': '列数与 gap 可配；slot 渲染卡片。',
  'example.doc.waterfall.prop.data': '数据源',
  'example.doc.waterfall.prop.columns': '列数',
  'example.doc.waterfall.sample.item': '卡片 {n}',

  'example.doc.barChart.when': '柱状图：SVG 数据驱动，Token 配色。',
  'example.doc.barChart.demo.basic': '基础柱图',
  'example.doc.barChart.demo.basicDesc': '传入 number[] 即可渲染。',
  'example.doc.barChart.prop.data': '数值序列',

  'example.doc.pieChart.when': '饼图：扇区占比可视化。',
  'example.doc.pieChart.demo.basic': '基础饼图',
  'example.doc.pieChart.demo.basicDesc': '五段 mock 数据。',
  'example.doc.pieChart.prop.data': '数值序列',

  'example.doc.lineChart.when': '折线图：趋势序列。',
  'example.doc.lineChart.demo.basic': '基础折线',
  'example.doc.lineChart.demo.basicDesc': '七点 mock 趋势。',
  'example.doc.lineChart.prop.data': '数值序列',

  'example.doc.gaugeChart.when': '仪表盘：单值进度环。',
  'example.doc.gaugeChart.demo.basic': '单值仪表',
  'example.doc.gaugeChart.demo.basicDesc': '0–100 百分比展示。',
  'example.doc.gaugeChart.prop.data': '当前值',

  'example.doc.heatMap.when': '热力图：矩阵强度着色。',
  'example.doc.heatMap.demo.basic': '强度矩阵',
  'example.doc.heatMap.demo.basicDesc': '随机 mock 单元格值。',
  'example.doc.heatMap.prop.data': '扁平数值数组',

  'example.doc.radarChart.when': '雷达图：多维对比。',
  'example.doc.radarChart.demo.basic': '五维雷达',
  'example.doc.radarChart.demo.basicDesc': '五轴 mock 分数。',
  'example.doc.radarChart.prop.data': '各轴分值',

  'example.doc.wordCloud.when': '词云：权重决定字号。',
  'example.doc.wordCloud.demo.basic': '关键词云',
  'example.doc.wordCloud.demo.basicDesc': '{ text, value } 数组驱动。',
  'example.doc.wordCloud.prop.data': '词条与权重',
  'example.doc.wordCloud.sample.a': '性能',
  'example.doc.wordCloud.sample.b': '主题',
  'example.doc.wordCloud.sample.c': '虚拟滚动',
  'example.doc.wordCloud.sample.d': '遥测',

  'example.doc.ranking.when': '排行榜：可切换升降序的条形排名。',
  'example.doc.ranking.demo.basic': 'Top 5',
  'example.doc.ranking.demo.basicDesc': '点击工具栏切换排序方向。',
  'example.doc.ranking.prop.items': '排名项 label + value',
  'example.doc.ranking.sample.a': '产品 A',
  'example.doc.ranking.sample.b': '产品 B',
  'example.doc.ranking.sample.c': '产品 C',
  'example.doc.ranking.sample.d': '产品 D',
  'example.doc.ranking.sample.e': '产品 E',

  'example.doc.calendar.when': '日历面板：点选日期，v-model 绑定。',
  'example.doc.calendar.demo.basic': '月视图',
  'example.doc.calendar.demo.basicDesc': '切换月份并选择日期。',
  'example.doc.calendar.prop.model': '选中日期',
  'example.doc.calendar.sample.picked': '已选',

  'example.doc.qrcode.when': '二维码：Canvas 本地绘制，可 v-model 文本。',
  'example.doc.qrcode.demo.basic': '动态内容',
  'example.doc.qrcode.demo.basicDesc': '修改输入框实时更新码图。',
  'example.doc.qrcode.prop.value': '编码文本',
  'example.doc.qrcode.prop.size': '边长像素',
  'example.doc.qrcode.sample.placeholder': '输入要编码的文本',

  'example.doc.barcode.when': '条形码：本地 SVG/Canvas 条码渲染。',
  'example.doc.barcode.demo.basic': '动态条码',
  'example.doc.barcode.demo.basicDesc': '修改文本更新条码。',
  'example.doc.barcode.prop.value': '条码内容',

  'example.doc.watermark.when': '水印：防截图泄露的半透明叠层。',
  'example.doc.watermark.demo.basic': '区域水印',
  'example.doc.watermark.demo.basicDesc': '包裹子内容并重复铺水印文案。',
  'example.doc.watermark.prop.content': '水印文字',
  'example.doc.watermark.prop.opacity': '不透明度',
  'example.doc.watermark.sample.text': 'AMG 内部',
  'example.doc.watermark.sample.body': '被水印覆盖的业务内容区域。',

  'example.doc.countdown.when': '倒计时：距目标时间的剩余展示。',
  'example.doc.countdown.demo.basic': '90 秒',
  'example.doc.countdown.demo.basicDesc': 'mm:ss 格式；可重置。',
  'example.doc.countdown.demo.reset': '重置',
  'example.doc.countdown.prop.value': '目标时间戳或 Date',
  'example.doc.countdown.prop.format': '格式模板',

  'example.doc.scrollNotice.when': '滚动公告：跑马灯式通知条。',
  'example.doc.scrollNotice.demo.basic': '横向滚动',
  'example.doc.scrollNotice.demo.basicDesc': '悬停暂停动画。',
  'example.doc.scrollNotice.prop.text': '公告正文',
  'example.doc.scrollNotice.prop.speed': '滚动速度',
  'example.doc.scrollNotice.sample.message': '系统将于今晚 22:00 进行例行维护，请提前保存工作。',

  'example.doc.thumbnail.when': '缩略图：点击放大预览。',
  'example.doc.thumbnail.demo.basic': '本地占位图',
  'example.doc.thumbnail.demo.basicDesc': '使用内联 SVG，无需 CDN。',
  'example.doc.thumbnail.prop.src': '图片地址',
  'example.doc.thumbnail.sample.alt': '示例缩略图',

  'example.doc.imageGroup.when': '图片组：主图 + 缩略图切换与预览。',
  'example.doc.imageGroup.demo.basic': '多图浏览',
  'example.doc.imageGroup.demo.basicDesc': '左右切换与缩略图条。',
  'example.doc.imageGroup.prop.images': '图片 URL 列表',

  'example.doc.clipboard.when': '剪贴板：一键复制文本到系统剪贴板。',
  'example.doc.clipboard.demo.basic': '复制按钮',
  'example.doc.clipboard.demo.basicDesc': '支持 Clipboard API 与降级方案。',
  'example.doc.clipboard.prop.text': '待复制文本',

  'example.doc.dragCanvas.when': '拖拽画布：低代码页面搭建的自由/网格画布。',
  'example.doc.dragCanvas.demo.basic': '物料 + 画布',
  'example.doc.dragCanvas.demo.basicDesc': '从左侧面板拖入节点；点击空白取消选中。',
  'example.doc.dragCanvas.prop.model': '画布节点 v-model',
  'example.doc.dragCanvas.prop.mode': 'free 或 grid 对齐',

  'example.doc.dragMaterial.when': '物料面板：可搜索、可拖拽的组件清单。',
  'example.doc.dragMaterial.demo.basic': '组件库',
  'example.doc.dragMaterial.demo.basicDesc': '拖到 DragCanvas 即可创建节点。',
  'example.doc.dragMaterial.prop.materials': '物料定义',
  'example.doc.dragMaterial.sample.button': '按钮',
  'example.doc.dragMaterial.sample.input': '输入框',
  'example.doc.dragMaterial.sample.card': '卡片',

  'example.doc.dragVerify.when': '滑动验证：拖动滑块至末端通过。',
  'example.doc.dragVerify.demo.basic': '滑块验证',
  'example.doc.dragVerify.demo.basicDesc': 'v-model 绑定是否通过。',
  'example.doc.dragVerify.demo.reset': '重置',
  'example.doc.dragVerify.prop.model': '是否验证通过',
  'example.doc.dragVerify.sample.pass': '已通过',
  'example.doc.dragVerify.sample.wait': '请拖动滑块',

  'example.doc.propPanel.when': '属性面板：编辑画布选中节点的属性。',
  'example.doc.propPanel.demo.basic': '选中编辑',
  'example.doc.propPanel.demo.basicDesc': '与 DragCanvas 联用；选中节点后右侧编辑。',
  'example.doc.propPanel.prop.fields': '字段 schema',
  'example.doc.propPanel.sample.node': '示例按钮',

  'example.doc.preview.when': '预览器：缩放与全屏查看内容。',
  'example.doc.preview.demo.basic': '缩放预览',
  'example.doc.preview.demo.basicDesc': '工具栏放大/缩小/全屏。',
  'example.doc.preview.prop.zoom': '初始缩放',
  'example.doc.preview.sample.body': '可被缩放的全屏预览内容。',

  'example.doc.print.when': '打印：将区域 HTML 送入浏览器打印对话框。',
  'example.doc.print.demo.basic': '区域打印',
  'example.doc.print.demo.basicDesc': '点击打印按钮；无外部服务。',
  'example.doc.print.prop.event': '打印完成后触发',
  'example.doc.print.sample.line1': '打印区域第一行内容。',
  'example.doc.print.sample.line2': '打印区域第二行内容。',

  'example.doc.excelIo.when': 'CSV 导入导出：本地解析，无需 Office 在线服务。',
  'example.doc.excelIo.demo.basic': '导出 / 导入',
  'example.doc.excelIo.demo.basicDesc': '导出 mock CSV；选择文件解析预览。',
  'example.doc.excelIo.prop.data': '导出行',
  'example.doc.excelIo.prop.import': '导入完成回调',

  'example.doc.ocrScan.when': 'OCR 扫描：本地 mock 识别（上传图片生成伪码）。',
  'example.doc.ocrScan.demo.basic': '上传识别',
  'example.doc.ocrScan.demo.basicDesc': '选择图片后 Canvas 采样并输出 SCAN- 伪结果。',
  'example.doc.ocrScan.prop.scan': '识别完成'
}

const en = {
  'example.doc.tree.when': 'Hierarchy tree: search, expand/collapse, checkboxes, and selection.',
  'example.doc.tree.demo.basic': 'Checkable tree',
  'example.doc.tree.demo.basicDesc': 'Built-in search and expand-all; v-model binds checked values.',
  'example.doc.tree.prop.data': 'Tree nodes via options or data',
  'example.doc.tree.prop.checkable': 'Show checkboxes',
  'example.doc.tree.prop.model': 'Checked value array',
  'example.doc.tree.sample.a': 'Folder A',
  'example.doc.tree.sample.a1': 'Child A1',
  'example.doc.tree.sample.a2': 'Child A2',
  'example.doc.tree.sample.b': 'Folder B',
  'example.doc.tree.sample.b1': 'Child B1',
  'example.doc.tree.sample.checked': 'Checked',

  'example.doc.virtualTree.when': 'Virtual tree: smooth scrolling for large node lists.',
  'example.doc.virtualTree.demo.basic': 'Large list',
  'example.doc.virtualTree.demo.basicDesc': '40 root nodes; only visible rows render.',
  'example.doc.virtualTree.prop.virtual': 'Virtual scroll (default true)',
  'example.doc.virtualTree.sample.node': 'Node {n}',
  'example.doc.virtualTree.sample.child': 'Child',

  'example.doc.lazyTree.when': 'Lazy tree: @load fires when expanding unloaded nodes.',
  'example.doc.lazyTree.demo.basic': 'On demand',
  'example.doc.lazyTree.demo.basicDesc': 'Expand branch to inject mock children.',
  'example.doc.lazyTree.prop.load': 'Fired when expanding unloaded node',
  'example.doc.lazyTree.sample.root': 'Root',
  'example.doc.lazyTree.sample.branch': 'Expandable branch',
  'example.doc.lazyTree.sample.leaf1': 'Lazy leaf 1',
  'example.doc.lazyTree.sample.leaf2': 'Lazy leaf 2',
  'example.doc.lazyTree.sample.hint': 'Expand the branch to simulate async load.',

  'example.doc.proTable.when': 'Pro table: sort, column toggle, filter, export, and print.',
  'example.doc.proTable.demo.basic': 'Toolbar table',
  'example.doc.proTable.demo.basicDesc': 'Built-in search and columns; mock rows below.',
  'example.doc.proTable.prop.columns': 'Column defs',
  'example.doc.proTable.prop.rows': 'Row data',
  'example.doc.proTable.prop.toolbar': 'Toolbar slot',
  'example.doc.proTable.sample.name': 'Name',
  'example.doc.proTable.sample.status': 'Status',
  'example.doc.proTable.sample.value': 'Value',

  'example.doc.virtualTable.when': 'Virtual table: default virtual scroll for 1k+ rows.',
  'example.doc.virtualTable.demo.basic': '500 rows',
  'example.doc.virtualTable.demo.basicDesc': 'Renders visible rows only; sort + export.',
  'example.doc.virtualTable.prop.virtual': 'Virtual scroll toggle',

  'example.doc.treeTable.when': 'Tree table: expandable hierarchical rows.',
  'example.doc.treeTable.demo.basic': 'Nested rows',
  'example.doc.treeTable.demo.basicDesc': 'Expand parent rows to see children.',
  'example.doc.treeTable.prop.rows': 'Tree row data',
  'example.doc.treeTable.sample.parent': 'Parent dept',
  'example.doc.treeTable.sample.child1': 'Child 1',
  'example.doc.treeTable.sample.child2': 'Child 2',
  'example.doc.treeTable.sample.solo': 'Standalone',

  'example.doc.editTable.when': 'Editable table: click cell to edit inline.',
  'example.doc.editTable.demo.basic': 'Inline edit',
  'example.doc.editTable.demo.basicDesc': 'Click cell to edit; Enter commits.',
  'example.doc.editTable.prop.rows': 'Editable rows',
  'example.doc.editTable.prop.change': 'Fired after edit commit',

  'example.doc.carousel.when': 'Carousel: autoplay, dots, and prev/next.',
  'example.doc.carousel.demo.basic': 'Slides',
  'example.doc.carousel.demo.basicDesc': 'Inline SVG placeholders — no CDN.',
  'example.doc.carousel.demo.autoplayToggle': 'Autoplay',
  'example.doc.carousel.prop.slides': 'Slide array',
  'example.doc.carousel.prop.autoplay': 'Autoplay toggle',
  'example.doc.carousel.prop.interval': 'Interval ms',
  'example.doc.carousel.sample.s1': 'Slide 1',
  'example.doc.carousel.sample.s2': 'Slide 2',
  'example.doc.carousel.sample.s3': 'Slide 3',
  'example.doc.carousel.sample.c1': 'First caption.',
  'example.doc.carousel.sample.c2': 'Second caption.',
  'example.doc.carousel.sample.c3': 'Third caption.',

  'example.doc.cardList.when': 'Card list: grid cards with multi-select.',
  'example.doc.cardList.demo.basic': 'Selectable cards',
  'example.doc.cardList.demo.basicDesc': 'Click to toggle; v-model is id array.',
  'example.doc.cardList.prop.items': 'Card items',
  'example.doc.cardList.prop.model': 'Selected ids',
  'example.doc.cardList.sample.title': 'Card {n}',
  'example.doc.cardList.sample.desc': 'Sample description.',

  'example.doc.waterfall.when': 'Waterfall: multi-column masonry layout.',
  'example.doc.waterfall.demo.basic': 'Three columns',
  'example.doc.waterfall.demo.basicDesc': 'Configurable columns; slot renders cards.',
  'example.doc.waterfall.prop.data': 'Data source',
  'example.doc.waterfall.prop.columns': 'Column count',
  'example.doc.waterfall.sample.item': 'Card {n}',

  'example.doc.barChart.when': 'Bar chart: SVG data-driven with token colors.',
  'example.doc.barChart.demo.basic': 'Basic bars',
  'example.doc.barChart.demo.basicDesc': 'Pass number[] to render.',
  'example.doc.barChart.prop.data': 'Value series',

  'example.doc.pieChart.when': 'Pie chart: sector proportions.',
  'example.doc.pieChart.demo.basic': 'Basic pie',
  'example.doc.pieChart.demo.basicDesc': 'Five mock segments.',
  'example.doc.pieChart.prop.data': 'Value series',

  'example.doc.lineChart.when': 'Line chart: trend series.',
  'example.doc.lineChart.demo.basic': 'Basic line',
  'example.doc.lineChart.demo.basicDesc': 'Seven-point mock trend.',
  'example.doc.lineChart.prop.data': 'Value series',

  'example.doc.gaugeChart.when': 'Gauge: single-value dial.',
  'example.doc.gaugeChart.demo.basic': 'Single gauge',
  'example.doc.gaugeChart.demo.basicDesc': '0–100 percent display.',
  'example.doc.gaugeChart.prop.data': 'Current value',

  'example.doc.heatMap.when': 'Heat map: matrix intensity coloring.',
  'example.doc.heatMap.demo.basic': 'Intensity grid',
  'example.doc.heatMap.demo.basicDesc': 'Random mock cell values.',
  'example.doc.heatMap.prop.data': 'Flat value array',

  'example.doc.radarChart.when': 'Radar chart: multi-axis comparison.',
  'example.doc.radarChart.demo.basic': 'Five axes',
  'example.doc.radarChart.demo.basicDesc': 'Mock scores per axis.',
  'example.doc.radarChart.prop.data': 'Axis scores',

  'example.doc.wordCloud.when': 'Word cloud: weight drives font size.',
  'example.doc.wordCloud.demo.basic': 'Keywords',
  'example.doc.wordCloud.demo.basicDesc': 'Driven by { text, value } array.',
  'example.doc.wordCloud.prop.data': 'Terms and weights',
  'example.doc.wordCloud.sample.a': 'Performance',
  'example.doc.wordCloud.sample.b': 'Theme',
  'example.doc.wordCloud.sample.c': 'Virtual scroll',
  'example.doc.wordCloud.sample.d': 'Telemetry',

  'example.doc.ranking.when': 'Ranking list: sortable bar leaderboard.',
  'example.doc.ranking.demo.basic': 'Top 5',
  'example.doc.ranking.demo.basicDesc': 'Toggle sort direction in toolbar.',
  'example.doc.ranking.prop.items': 'Items with label + value',
  'example.doc.ranking.sample.a': 'Product A',
  'example.doc.ranking.sample.b': 'Product B',
  'example.doc.ranking.sample.c': 'Product C',
  'example.doc.ranking.sample.d': 'Product D',
  'example.doc.ranking.sample.e': 'Product E',

  'example.doc.calendar.when': 'Calendar panel: pick a date via v-model.',
  'example.doc.calendar.demo.basic': 'Month view',
  'example.doc.calendar.demo.basicDesc': 'Navigate months and select a day.',
  'example.doc.calendar.prop.model': 'Selected date',
  'example.doc.calendar.sample.picked': 'Selected',

  'example.doc.qrcode.when': 'QR code: locally rendered canvas; v-model text.',
  'example.doc.qrcode.demo.basic': 'Live content',
  'example.doc.qrcode.demo.basicDesc': 'Edit input to update the code.',
  'example.doc.qrcode.prop.value': 'Encoded text',
  'example.doc.qrcode.prop.size': 'Size in px',
  'example.doc.qrcode.sample.placeholder': 'Text to encode',

  'example.doc.barcode.when': 'Barcode: local SVG/canvas rendering.',
  'example.doc.barcode.demo.basic': 'Live barcode',
  'example.doc.barcode.demo.basicDesc': 'Edit text to update bars.',
  'example.doc.barcode.prop.value': 'Barcode content',

  'example.doc.watermark.when': 'Watermark: semi-transparent overlay against leaks.',
  'example.doc.watermark.demo.basic': 'Region watermark',
  'example.doc.watermark.demo.basicDesc': 'Wrap content with repeating text.',
  'example.doc.watermark.prop.content': 'Watermark text',
  'example.doc.watermark.prop.opacity': 'Opacity',
  'example.doc.watermark.sample.text': 'AMG Internal',
  'example.doc.watermark.sample.body': 'Business content under watermark.',

  'example.doc.countdown.when': 'Countdown: time remaining to target.',
  'example.doc.countdown.demo.basic': '90 seconds',
  'example.doc.countdown.demo.basicDesc': 'mm:ss format; resettable.',
  'example.doc.countdown.demo.reset': 'Reset',
  'example.doc.countdown.prop.value': 'Target timestamp or Date',
  'example.doc.countdown.prop.format': 'Format template',

  'example.doc.scrollNotice.when': 'Scroll notice: marquee announcement bar.',
  'example.doc.scrollNotice.demo.basic': 'Marquee',
  'example.doc.scrollNotice.demo.basicDesc': 'Pause on hover.',
  'example.doc.scrollNotice.prop.text': 'Notice text',
  'example.doc.scrollNotice.prop.speed': 'Scroll speed',
  'example.doc.scrollNotice.sample.message': 'Scheduled maintenance tonight at 22:00 — save your work.',

  'example.doc.thumbnail.when': 'Thumbnail: click to lightbox preview.',
  'example.doc.thumbnail.demo.basic': 'Local placeholder',
  'example.doc.thumbnail.demo.basicDesc': 'Inline SVG — no CDN.',
  'example.doc.thumbnail.prop.src': 'Image URL',
  'example.doc.thumbnail.sample.alt': 'Sample thumbnail',

  'example.doc.imageGroup.when': 'Image group: hero + thumb strip and preview.',
  'example.doc.imageGroup.demo.basic': 'Gallery',
  'example.doc.imageGroup.demo.basicDesc': 'Prev/next and thumb navigation.',
  'example.doc.imageGroup.prop.images': 'Image URLs',

  'example.doc.clipboard.when': 'Clipboard: copy text with one click.',
  'example.doc.clipboard.demo.basic': 'Copy button',
  'example.doc.clipboard.demo.basicDesc': 'Clipboard API with fallback.',
  'example.doc.clipboard.prop.text': 'Text to copy',

  'example.doc.dragCanvas.when': 'Drag canvas: low-code free/grid page builder.',
  'example.doc.dragCanvas.demo.basic': 'Material + canvas',
  'example.doc.dragCanvas.demo.basicDesc': 'Drag from panel; click blank to deselect.',
  'example.doc.dragCanvas.prop.model': 'Canvas nodes v-model',
  'example.doc.dragCanvas.prop.mode': 'free or grid snap',

  'example.doc.dragMaterial.when': 'Material panel: searchable draggable components.',
  'example.doc.dragMaterial.demo.basic': 'Component library',
  'example.doc.dragMaterial.demo.basicDesc': 'Drag onto DragCanvas to create nodes.',
  'example.doc.dragMaterial.prop.materials': 'Material defs',
  'example.doc.dragMaterial.sample.button': 'Button',
  'example.doc.dragMaterial.sample.input': 'Input',
  'example.doc.dragMaterial.sample.card': 'Card',

  'example.doc.dragVerify.when': 'Drag verify: slide handle to pass.',
  'example.doc.dragVerify.demo.basic': 'Slider captcha',
  'example.doc.dragVerify.demo.basicDesc': 'v-model binds pass state.',
  'example.doc.dragVerify.demo.reset': 'Reset',
  'example.doc.dragVerify.prop.model': 'Passed flag',
  'example.doc.dragVerify.sample.pass': 'Passed',
  'example.doc.dragVerify.sample.wait': 'Drag the slider',

  'example.doc.propPanel.when': 'Prop panel: edit selected canvas node props.',
  'example.doc.propPanel.demo.basic': 'Select to edit',
  'example.doc.propPanel.demo.basicDesc': 'Pair with DragCanvas; edit on the right.',
  'example.doc.propPanel.prop.fields': 'Field schema',
  'example.doc.propPanel.sample.node': 'Sample button',

  'example.doc.preview.when': 'Preview: zoom and fullscreen content viewer.',
  'example.doc.preview.demo.basic': 'Zoom preview',
  'example.doc.preview.demo.basicDesc': 'Toolbar zoom in/out/fullscreen.',
  'example.doc.preview.prop.zoom': 'Initial zoom',
  'example.doc.preview.sample.body': 'Content that can be zoomed fullscreen.',

  'example.doc.print.when': 'Print: send region HTML to browser print dialog.',
  'example.doc.print.demo.basic': 'Region print',
  'example.doc.print.demo.basicDesc': 'Click print — no external service.',
  'example.doc.print.prop.event': 'Fired after print',
  'example.doc.print.sample.line1': 'First line in print region.',
  'example.doc.print.sample.line2': 'Second line in print region.',

  'example.doc.excelIo.when': 'CSV import/export: local parse — no Office online.',
  'example.doc.excelIo.demo.basic': 'Export / import',
  'example.doc.excelIo.demo.basicDesc': 'Export mock CSV; pick file to preview parse.',
  'example.doc.excelIo.prop.data': 'Export rows',
  'example.doc.excelIo.prop.import': 'Import callback',

  'example.doc.ocrScan.when': 'OCR scan: local mock recognition from uploaded image.',
  'example.doc.ocrScan.demo.basic': 'Upload scan',
  'example.doc.ocrScan.demo.basicDesc': 'Canvas samples pixels and emits SCAN- pseudo code.',
  'example.doc.ocrScan.prop.scan': 'Scan complete'
}

const packs = { 'zh-CN': zhCN, 'en-US': en, 'zh-TW': { ...zhCN }, 'ja-JP': { ...en }, 'ko-KR': { ...en }, 'ko-KP': { ...en }, 'ru-RU': { ...en } }

function patchLocale(locale) {
  const file = join(localeRoot, locale, 'exampleDoc.ts')
  let text = readFileSync(file, 'utf8')
  const map = packs[locale]
  const missing = Object.entries(map).filter(([k]) => !text.includes(`"${k}"`))
  if (!missing.length) {
    console.log(locale, 'i18n ok')
    return
  }
  const insert = missing.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')
  const idx = text.lastIndexOf('}')
  const before = text.slice(0, idx).replace(/\s+$/, '')
  const needsComma = !before.endsWith(',')
  text = before + (needsComma ? ',\n' : '\n') + insert + '\n' + text.slice(idx)
  writeFileSync(file, text, 'utf8')
  console.log(locale, 'i18n +', missing.length)
}

for (const locale of Object.keys(packs)) patchLocale(locale)

console.log('Done — data-display demos + i18n + registry')
