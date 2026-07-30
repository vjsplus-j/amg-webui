<script setup lang="ts">
/**
 * Curated demo — Data wave2 VirtualTable
 */
import { computed, ref } from 'vue'
import { VirtualTable } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const columns = computed(() => [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'name', header: t('example.doc.virtualTable.sample.name'), sortable: true },
  { field: 'status', header: t('example.doc.virtualTable.sample.status'), sortable: true },
  { field: 'value', header: t('example.doc.virtualTable.sample.value'), sortable: true }
])

function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Row ${String(i + 1).padStart(4, '0')}`,
    status: i % 2 === 0 ? 'online' : 'offline',
    value: (i + 1) * 17
  }))
}

const rows = ref(makeRows(500))
const selected = ref<Record<string, unknown> | null>(null)
const smallRows = ref(makeRows(8))

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { VirtualTable } from '@amg-webui/components/base'`
  ],
  script: [
    `const rows = ref(/* 500 rows */)`,
    `const columns = computed(() => [/* … */])`
  ],
  template: [
    `  <VirtualTable`,
    `    :columns="columns"`,
    `    :rows="rows"`,
    `    virtual`,
    `    @update:model-value="selected = $event"`,
    `  />`
  ]
})

const codeCompact = demoCode(
  `<VirtualTable`,
  `  :columns="columns"`,
  `  :rows="smallRows"`,
  `  :virtual="false"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'columns',
    description: t('example.doc.virtualTable.prop.columns'),
    type: 'TableColumn[]',
    defaultValue: '[]'
  },
  {
    name: 'rows / data',
    description: t('example.doc.virtualTable.prop.rows'),
    type: 'Record<string, unknown>[]',
    defaultValue: '[]'
  },
  {
    name: 'virtual',
    description: t('example.doc.virtualTable.prop.virtual'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'disabled',
    description: t('example.doc.virtualTable.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'loading',
    description: t('example.doc.virtualTable.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.virtualTable.event.change'),
    type: '(row: Record<string, unknown>) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.virtualTable.demo.basic')"
      :description="t('example.doc.virtualTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-virtual-table-demo">
        <VirtualTable
          :columns="columns"
          :rows="rows"
          virtual
          @update:model-value="selected = ($event as Record<string, unknown>)"
        />
        <p v-if="selected" class="vp-virtual-table-demo__hint">
          {{ t('example.doc.virtualTable.sample.selected', { id: String(selected.id) }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.virtualTable.demo.compact')"
      :description="t('example.doc.virtualTable.demo.compactDesc')"
      :code="codeCompact"
    >
      <VirtualTable :columns="columns" :rows="smallRows" :virtual="false" />
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
.vp-virtual-table-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}

.vp-virtual-table-demo__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
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
