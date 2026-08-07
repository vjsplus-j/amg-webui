<script setup lang="ts">
/**
 * Curated demo — Data wave2 AdvancedSearch
 */
import { ref, computed } from 'vue'
import { AdvancedSearch } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { FilterCondition } from '@amg-webui/form/FilterBar/types'
import type { SearchLogic } from '@amg-webui/form/AdvancedSearch/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const conditions = ref<FilterCondition[]>([
  { id: '1', field: 'name', operator: 'contains', value: 'AMG' }
])
const logic = ref<SearchLogic>('and')
const lastSearch = ref('—')

const fields = computed(() => [
  { label: t('example.doc.advancedSearch.sample.fieldName'), value: 'name' },
  { label: t('example.doc.advancedSearch.sample.fieldTag'), value: 'tag' },
  { label: t('example.doc.advancedSearch.sample.fieldStatus'), value: 'status' }
])

const templates = computed(() => [
  {
    id: 'tpl-active',
    name: t('example.doc.advancedSearch.sample.templateActive'),
    logic: 'and' as SearchLogic,
    conditions: [
      { id: 't1', field: 'status', operator: 'eq', value: 'active' }
    ]
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { AdvancedSearch } from '@amg-webui/form'`
  ],
  script: [
    `const conditions = ref([{ id: '1', field: 'name', operator: 'contains', value: '' }])`,
    `const fields = [/* … */]`
  ],
  template: [
    `  <AdvancedSearch v-model="conditions" :fields="fields" @search="onSearch" />`
  ]
})

const codeLogic = demoSfc({
  imports: [`import { AdvancedSearch } from '@amg-webui/form'`],
  template: [
    `  <AdvancedSearch`,
    `    v-model="conditions"`,
    `    v-model:logic="logic"`,
    `    :fields="fields"`,
    `    :templates="templates"`,
    `  />`
  ]
})

function onSearch(payload: { conditions: FilterCondition[]; logic: SearchLogic }) {
  lastSearch.value = t('example.doc.advancedSearch.sample.searchResult', {
    logic: payload.logic.toUpperCase(),
    count: payload.conditions.length
  })
}

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.advancedSearch.demo.basic')"
      :description="t('example.doc.advancedSearch.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <AdvancedSearch
          v-model="conditions"
          :fields="fields"
          @search="onSearch"
        />
        <p class="vp-curated__hint">{{ lastSearch }}</p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.advancedSearch.demo.logic')"
      :description="t('example.doc.advancedSearch.demo.logicDesc')"
      :code="codeLogic"
    >
      <AdvancedSearch
        v-model="conditions"
        v-model:logic="logic"
        :fields="fields"
        :templates="templates"
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
