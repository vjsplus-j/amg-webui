<script setup lang="ts">
/**
 * Curated demo — Data wave2 ProTable
 */
import { ref, computed } from 'vue'
import { ProTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { ProTable } from '@amg-webui/data'`
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
</style>
