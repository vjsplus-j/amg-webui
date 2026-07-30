<script setup lang="ts">
/**
 * Curated demo — Data wave2 LazyTree
 */
import { computed, ref } from 'vue'
import { LazyTree, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { LazyLoadContext, TreeNode } from '@amg-webui/utils/data-display/tree-types'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const nodes = ref<TreeNode[]>([
  { label: t('example.doc.lazyTree.sample.root'), value: 'root', children: [] },
  { label: t('example.doc.lazyTree.sample.branch'), value: 'branch' }
])

const checked = ref<string[]>([])
const active = ref<string[]>([])
const loadLog = ref('—')

function onLoad(ctx: LazyLoadContext) {
  loadLog.value = t('example.doc.lazyTree.sample.loading', { label: ctx.node.label })
  window.setTimeout(() => {
    ctx.resolve([
      { label: t('example.doc.lazyTree.sample.leaf1'), value: 'l1', isLeaf: true },
      { label: t('example.doc.lazyTree.sample.leaf2'), value: 'l2', isLeaf: true }
    ])
    loadLog.value = t('example.doc.lazyTree.sample.loaded', { label: ctx.node.label })
  }, 800)
}

async function loadProp(_node: TreeNode): Promise<TreeNode[]> {
  await new Promise((r) => window.setTimeout(r, 600))
  return [
    { label: t('example.doc.lazyTree.sample.leaf1'), value: 'p1', isLeaf: true },
    { label: t('example.doc.lazyTree.sample.leaf2'), value: 'p2', isLeaf: true }
  ]
}

const propNodes = ref<TreeNode[]>([
  { label: t('example.doc.lazyTree.sample.propRoot'), value: 'prop-root' }
])

const codeLazy = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { LazyTree } from '@amg-webui/components/base'`
  ],
  script: [
    `const nodes = ref([/* root + branch */])`,
    `function onLoad({ node, resolve }) {`,
    `  setTimeout(() => resolve([/* children */]), 800)`,
    `}`
  ],
  template: [`  <LazyTree v-model="checked" :options="nodes" checkable @load="onLoad" />`]
})

const codeProp = demoSfc({
  imports: [`import { LazyTree } from '@amg-webui/components/base'`],
  template: [`  <LazyTree :options="propNodes" :load="loadProp" />`]
})

const codeBrowse = demoSfc({
  imports: [`import { LazyTree } from '@amg-webui/components/base'`],
  template: [`  <LazyTree v-model="active" :options="nodes" :checkable="false" @load="onLoad" />`]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'options / data',
    description: t('example.doc.lazyTree.prop.data'),
    type: 'TreeNode[]',
    defaultValue: '[]'
  },
  {
    name: 'load',
    description: t('example.doc.lazyTree.prop.loadFn'),
    type: '(node) => Promise<TreeNode[]>',
    defaultValue: '—'
  },
  {
    name: 'checkable / checkStrictly',
    description: t('example.doc.lazyTree.prop.checkable'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'modelValue (v-model)',
    description: t('example.doc.lazyTree.prop.model'),
    type: 'string[]',
    defaultValue: '[]'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'load',
    description: t('example.doc.lazyTree.prop.load'),
    type: '({ node, resolve }) => void',
    defaultValue: '-'
  },
  {
    name: 'update:modelValue / change',
    description: t('example.doc.lazyTree.event.change'),
    type: '(value: string[]) => void',
    defaultValue: '-'
  },
  {
    name: 'node-expand / check-change',
    description: t('example.doc.lazyTree.event.expand'),
    type: '(node) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.lazyTree.demo.lazy')"
      :description="t('example.doc.lazyTree.demo.lazyDesc')"
      :code="codeLazy"
      default-open
    >
      <Space direction="vertical" block size="md">
        <LazyTree v-model="checked" :options="nodes" checkable @load="onLoad" />
        <p class="vp-curated__hint">
          {{ loadLog }}
          ·
          {{ t('example.doc.lazyTree.sample.checked', { list: checked.length ? checked.join(', ') : '—' }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.lazyTree.demo.loadProp')"
      :description="t('example.doc.lazyTree.demo.loadPropDesc')"
      :code="codeProp"
    >
      <LazyTree :options="propNodes" :load="loadProp" />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.lazyTree.demo.browse')"
      :description="t('example.doc.lazyTree.demo.browseDesc')"
      :code="codeBrowse"
    >
      <LazyTree v-model="active" :options="nodes" :checkable="false" @load="onLoad" />
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
