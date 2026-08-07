<script setup lang="ts">
/**
 * Curated demo — Data wave2 TreeTable
 */
import { computed, ref } from 'vue'
import { TreeTable } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const rows = computed(() => [
  {
    id: 'dept-a',
    label: t('example.doc.treeTable.sample.parent'),
    children: [
      { id: 'dept-a1', label: t('example.doc.treeTable.sample.child1') },
      { id: 'dept-a2', label: t('example.doc.treeTable.sample.child2') }
    ]
  },
  { id: 'dept-b', label: t('example.doc.treeTable.sample.solo') }
])

const selected = ref<unknown>(null)

function onSelect(row: unknown) {
  selected.value = row
}

const selectedLabel = computed(() => {
  const row = selected.value as { label?: string } | null
  return row?.label ?? '—'
})

const codeBasic = demoSfc({
  imports: [
    `import { computed } from 'vue'`,
    `import { TreeTable } from '@amg-webui/data'`
  ],
  script: [`const rows = computed(() => [/* tree rows */])`],
  template: [`  <TreeTable :rows="rows" @change="onSelect" />`]
})

const codeSearch = demoSfc({
  imports: [`import { TreeTable } from '@amg-webui/data'`],
  template: [
    `  <TreeTable`,
    `    :title="t('example.doc.treeTable.sample.customTitle')"`,
    `    :rows="rows"`,
    `  />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'rows / data',
    description: t('example.doc.treeTable.prop.rows'),
    type: 'TreeRow[]',
    defaultValue: '[]'
  },
  {
    name: 'title',
    description: t('example.doc.treeTable.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.treeTable.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.treeTable.event.change'),
    type: '(row: TreeRow) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.treeTable.demo.basic')"
      :description="t('example.doc.treeTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <TreeTable :rows="rows" @change="onSelect" />
        <p class="vp-curated__hint">
          {{ t('example.doc.treeTable.sample.selected', { label: selectedLabel }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.treeTable.demo.search')"
      :description="t('example.doc.treeTable.demo.searchDesc')"
      :code="codeSearch"
    >
      <TreeTable
        :title="t('example.doc.treeTable.sample.customTitle')"
        :rows="rows"
      />
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
