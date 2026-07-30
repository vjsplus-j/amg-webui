<script setup lang="ts">
/**
 * Curated demo — Data wave2 EditTable
 */
import { computed, ref } from 'vue'
import { EditTable, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const columns = computed(() => [
  { field: 'name', header: t('example.doc.editTable.sample.colName') },
  { field: 'email', header: t('example.doc.editTable.sample.colEmail') },
  { field: 'role', header: t('example.doc.editTable.sample.colRole') }
])

const rows = ref([
  { name: 'Alice Chen', email: 'alice@example.com', role: 'admin' },
  { name: 'Bob Lee', email: 'bob@example.com', role: 'editor' },
  { name: 'Carol Wu', email: 'carol@example.com', role: 'viewer' }
])

const lastChange = ref('—')

function onChange(data: unknown) {
  lastChange.value = t('example.doc.editTable.sample.changed', {
    count: Array.isArray(data) ? data.length : 0
  })
}

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { EditTable } from '@amg-webui/components/base'`
  ],
  script: [
    `const columns = computed(() => [/* … */])`,
    `const rows = ref([/* … */])`
  ],
  template: [
    `  <EditTable :columns="columns" :rows="rows" @change="onChange" />`
  ]
})

const codeFilter = demoSfc({
  imports: [`import { EditTable } from '@amg-webui/components/base'`],
  template: [
    `  <EditTable`,
    `    :title="t('example.doc.editTable.sample.customTitle')"`,
    `    :columns="columns"`,
    `    :rows="rows"`,
    `  />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'columns',
    description: t('example.doc.editTable.prop.columns'),
    type: 'TableColumn[]',
    defaultValue: '[] (auto from first row)'
  },
  {
    name: 'rows / data',
    description: t('example.doc.editTable.prop.rows'),
    type: 'Record<string, unknown>[]',
    defaultValue: '[]'
  },
  {
    name: 'title',
    description: t('example.doc.editTable.prop.title'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.editTable.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'change',
    description: t('example.doc.editTable.event.change'),
    type: '(rows: Record<string, unknown>[]) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.editTable.demo.basic')"
      :description="t('example.doc.editTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <EditTable :columns="columns" :rows="rows" @change="onChange" />
        <p class="vp-curated__hint">{{ lastChange }}</p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.editTable.demo.filter')"
      :description="t('example.doc.editTable.demo.filterDesc')"
      :code="codeFilter"
    >
      <EditTable
        :title="t('example.doc.editTable.sample.customTitle')"
        :columns="columns"
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
