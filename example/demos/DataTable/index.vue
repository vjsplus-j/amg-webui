<script setup lang="ts">
/**
 * Curated demo — Data wave1 DataTable
 */
import { ref, computed } from 'vue'
import { DataTable } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import Basic from './parts/Basic.vue'
import basicSource from './parts/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const columns = computed(() => [
  { field: 'id', header: 'ID', width: '5rem', sortable: true, align: 'center' as const },
  { field: 'name', header: t('example.doc.datatable.sample.name'), sortable: true, filter: true },
  { field: 'email', header: t('example.doc.datatable.sample.email'), sortable: true, filter: true },
  {
    field: 'role',
    header: t('example.doc.datatable.sample.role'),
    width: '7rem',
    render: (value: string) =>
      value === 'admin' ? t(LocaleKeys.common.admin) : t(LocaleKeys.common.user)
  }
])

function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `User ${String(i + 1).padStart(3, '0')}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? 'admin' : 'user'
  }))
}

const virtualRows = ref(makeRows(200))
const pageRows = ref(makeRows(87))
const pageFirst = ref(0)
const pageSize = ref(20)
const selectionKeys = ref<(string | number)[]>([1, 3, 5])

const codeSelection = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { DataTable } from '@amg-webui/data'`
  ],
  script: [
    `const rows = ref([{ id: 1, name: 'A' }, { id: 2, name: 'B' }])`,
    `const selectedKeys = ref([1])`
  ],
  template: [
    `  <DataTable`,
    `    row-key="id"`,
    `    :value="rows"`,
    `    :columns="columns"`,
    `    selection-mode="multiple"`,
    `    v-model:selection="selectedKeys"`,
    `  />`
  ]
})

const codePaginator = demoSfc({
  imports: [`import { DataTable } from '@amg-webui/data'`],
  template: [
    `  <DataTable`,
    `    :value="rows"`,
    `    :columns="columns"`,
    `    paginator`,
    `    v-model:first="first"`,
    `    v-model:rows="rowsPerPage"`,
    `    striped`,
    `    filter-global`,
    `  />`
  ]
})

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.datatable.demo.selection')"
      :description="t('example.doc.datatable.demo.selectionDesc')"
      :code="codeSelection"
      default-open
    >
      <DataTable
        row-key="id"
        :value="virtualRows"
        :columns="columns"
        filter-global
        striped
        selection-mode="multiple"
        v-model:selection="selectionKeys"
      />
      <p class="vp-curated__hint">
        {{ t('example.doc.datatable.sample.selected') }}: {{ selectionKeys.length }}
        ({{ selectionKeys.join(', ') }})
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.datatable.demo.basic')"
      :description="t('example.doc.datatable.demo.basicDesc')"
      :code="basicSource"
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.datatable.demo.paginator')"
      :description="t('example.doc.datatable.demo.paginatorDesc')"
      :code="codePaginator"
    >
      <DataTable
        :value="pageRows"
        :columns="columns"
        paginator
        v-model:first="pageFirst"
        v-model:rows="pageSize"
        striped
        filter-global
      />
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: var(--spacing-md) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
