<script setup lang="ts">
/**
 * Curated demo — Data wave2 TreeTable
 */
import { ref, computed } from 'vue'
import { TreeTable } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
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
