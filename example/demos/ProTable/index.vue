<script setup lang="ts">
/**
 * Curated demo — Data wave2 ProTable
 */
import { computed, ref } from 'vue'
import { ProTable } from '@amg-webui/components/base'
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
  { field: 'name', header: t('example.doc.proTable.sample.name'), sortable: true },
  { field: 'status', header: t('example.doc.proTable.sample.status'), sortable: true },
  { field: 'value', header: t('example.doc.proTable.sample.value'), sortable: true }
])

const rows = ref([
  { id: 1, name: 'alpha', status: 'online', value: 120 },
  { id: 2, name: 'beta', status: 'offline', value: 86 },
  { id: 3, name: 'gamma', status: 'online', value: 204 },
  { id: 4, name: 'delta', status: 'online', value: 42 }
])

const loading = ref(false)
const selected = ref<Record<string, unknown> | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { ProTable } from '@amg-webui/components/base'`
  ],
  script: [`const rows = ref([/* … */])`, `const columns = computed(() => [/* … */])`],
  template: [
    `  <ProTable`,
    `    :columns="columns"`,
    `    :rows="rows"`,
    `    @update:model-value="selected = $event"`,
    `  />`
  ]
})

const codeLoading = demoCode(`<ProTable :columns="columns" :rows="rows" :loading="loading" />`)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'columns',
    description: t('example.doc.proTable.prop.columns'),
    type: 'TableColumn[]',
    defaultValue: '[]'
  },
  {
    name: 'rows / data',
    description: t('example.doc.proTable.prop.rows'),
    type: 'Record<string, unknown>[]',
    defaultValue: '[]'
  },
  {
    name: 'loading',
    description: t('example.doc.proTable.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.proTable.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.proTable.event.change'),
    type: '(row: Record<string, unknown>) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.proTable.demo.basic')"
      :description="t('example.doc.proTable.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-pro-table-demo">
        <ProTable
          :columns="columns"
          :rows="rows"
          @update:model-value="selected = ($event as Record<string, unknown>)"
        />
        <p v-if="selected" class="vp-pro-table-demo__hint">
          {{ t('example.doc.proTable.sample.selected', { name: String(selected.name) }) }}
        </p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.proTable.demo.loading')"
      :description="t('example.doc.proTable.demo.loadingDesc')"
      :code="codeLoading"
    >
      <ProTable :columns="columns" :rows="rows" :loading="loading" />
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
.vp-pro-table-demo {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
  min-width: 0;
}

.vp-pro-table-demo__hint {
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
