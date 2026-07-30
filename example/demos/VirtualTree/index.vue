<script setup lang="ts">
/**
 * Curated demo — Data wave2 VirtualTree
 */
import { computed, ref } from 'vue'
import { VirtualTree, Space, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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
    `import { VirtualTree } from '@amg-webui/components/base'`
  ],
  script: [
    `const checked = ref(['a-1'])`,
    `const largeOptions = computed(() => [/* 200+ nodes */])`
  ],
  template: [`  <VirtualTree v-model="checked" :options="largeOptions" checkable />`]
})

const codeStrict = demoSfc({
  imports: [`import { VirtualTree } from '@amg-webui/components/base'`],
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
  imports: [`import { VirtualTree } from '@amg-webui/components/base'`],
  template: [
    `  <VirtualTree`,
    `    v-model="browseChecked"`,
    `    :options="smallOptions"`,
    `    :checkable="false"`,
    `    :loading="loading"`,
    `  />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'options / data',
    description: t('example.doc.virtualTree.prop.data'),
    type: 'TreeNode[]',
    defaultValue: '[]'
  },
  {
    name: 'checkable / checkStrictly',
    description: t('example.doc.virtualTree.prop.checkable'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'virtual',
    description: t('example.doc.virtualTree.prop.virtual'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'modelValue (v-model)',
    description: t('example.doc.virtualTree.prop.model'),
    type: 'string[]',
    defaultValue: '[]'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.virtualTree.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.virtualTree.event.change'),
    type: '(value: string[]) => void',
    defaultValue: '-'
  },
  {
    name: 'check-change / node-expand',
    description: t('example.doc.virtualTree.event.interaction'),
    type: '(node, …) => void',
    defaultValue: '-'
  }
])
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
