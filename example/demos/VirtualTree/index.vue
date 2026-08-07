<script setup lang="ts">
/**
 * Curated demo — Data wave2 VirtualTree
 */
import { computed, ref } from 'vue'
import { VirtualTree } from '@amg-webui/data'
import { Space, Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

function makeBranch(prefix: string, count: number): TreeNode[] {
  return Array.from({ length: count }, (_, i) => ({
    label: t('example.doc.virtualTree.sample.node', { n: `${prefix}-${i + 1}` }),
    value: `${prefix}-${i + 1}`,
    children:
      i % 4 === 0
        ? [
            {
              label: t('example.doc.virtualTree.sample.child'),
              value: `${prefix}-${i + 1}-c`,
              isLeaf: true
            }
          ]
        : undefined,
    isLeaf: i % 4 !== 0
  }))
}

const largeOptions = computed<TreeNode[]>(() => [
  {
    label: t('example.doc.virtualTree.sample.root'),
    value: 'root',
    children: makeBranch('a', 120)
  },
  {
    label: t('example.doc.virtualTree.sample.rootB'),
    value: 'root-b',
    children: makeBranch('b', 80)
  }
])

const smallOptions = computed<TreeNode[]>(() => [
  {
    label: t('example.doc.virtualTree.sample.root'),
    value: 's-root',
    children: [
      { label: t('example.doc.virtualTree.sample.child'), value: 's-1', isLeaf: true },
      { label: t('example.doc.virtualTree.sample.child'), value: 's-2', isLeaf: true }
    ]
  }
])

const checked = ref<string[]>(['a-1'])
const browseChecked = ref<string[]>([])
const strictChecked = ref<string[]>([])
const loading = ref(false)

const codeLarge = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { VirtualTree } from '@amg-webui/data'`
  ],
  script: [
    `const checked = ref(['a-1'])`,
    `const largeOptions = computed(() => [/* 200+ nodes */])`
  ],
  template: [`  <VirtualTree v-model="checked" :options="largeOptions" checkable />`]
})

const codeStrict = demoSfc({
  imports: [`import { VirtualTree } from '@amg-webui/data'`],
  template: [
    `  <VirtualTree`,
    `    v-model="strictChecked"`,
    `    :options="largeOptions"`,
    `    checkable`,
    `    check-strictly`,
    `  />`
  ]
})

const codeBrowse = demoSfc({
  imports: [`import { VirtualTree } from '@amg-webui/data'`],
  template: [
    `  <VirtualTree`,
    `    v-model="browseChecked"`,
    `    :options="smallOptions"`,
    `    :checkable="false"`,
    `    :loading="loading"`,
    `  />`
  ]
})

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.virtualTree.demo.large')"
      :description="t('example.doc.virtualTree.demo.largeDesc')"
      :code="codeLarge"
      default-open
    >
      <Space direction="vertical" block size="md">
        <VirtualTree v-model="checked" :options="largeOptions" checkable />
        <p class="vp-curated__hint">
          {{ t('example.doc.virtualTree.sample.checked', { count: checked.length }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.virtualTree.demo.strict')"
      :description="t('example.doc.virtualTree.demo.strictDesc')"
      :code="codeStrict"
    >
      <VirtualTree
        v-model="strictChecked"
        :options="largeOptions"
        checkable
        check-strictly
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.virtualTree.demo.browse')"
      :description="t('example.doc.virtualTree.demo.browseDesc')"
      :code="codeBrowse"
    >
      <Space direction="vertical" block size="md">
        <VirtualTree
          v-model="browseChecked"
          :options="smallOptions"
          :checkable="false"
          :loading="loading"
        />
        <Button size="sm" variant="outlined" @click="loading = !loading">
          {{ t('example.doc.virtualTree.sample.toggleLoading') }}
        </Button>
      </Space>
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
