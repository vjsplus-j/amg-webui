<script setup lang="ts">
/**
 * Curated demo — Data wave2 EditTable
 */
import { ref, computed } from 'vue'
import { EditTable } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
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
    `import { EditTable } from '@amg-webui/data'`
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
  imports: [`import { EditTable } from '@amg-webui/data'`],
  template: [
    `  <EditTable`,
    `    :title="t('example.doc.editTable.sample.customTitle')"`,
    `    :columns="columns"`,
    `    :rows="rows"`,
    `  />`
  ]
})

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
