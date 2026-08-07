<script setup lang="ts">
/**
 * Curated demo — Data wave2 LazyTree
 */
import { ref } from 'vue'
import { LazyTree } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import type { LazyLoadContext, TreeNode } from '@amg-webui/utils/data-display/tree-types'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
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
    `import { LazyTree } from '@amg-webui/data'`
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
  imports: [`import { LazyTree } from '@amg-webui/data'`],
  template: [`  <LazyTree :options="propNodes" :load="loadProp" />`]
})

const codeBrowse = demoSfc({
  imports: [`import { LazyTree } from '@amg-webui/data'`],
  template: [`  <LazyTree v-model="active" :options="nodes" :checkable="false" @load="onLoad" />`]
})

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
</style>
