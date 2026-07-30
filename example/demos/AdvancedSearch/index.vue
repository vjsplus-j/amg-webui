<script setup lang="ts">
/**
 * Curated demo — Data wave2 AdvancedSearch
 */
import { computed, ref } from 'vue'
import { AdvancedSearch, Space } from '@amg-webui/components/base'
import type { FilterCondition } from '@amg-webui/components/base/FilterBar/types'
import type { SearchLogic } from '@amg-webui/components/base/AdvancedSearch/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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
    `import { AdvancedSearch } from '@amg-webui/components/base'`
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
  imports: [`import { AdvancedSearch } from '@amg-webui/components/base'`],
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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.advancedSearch.prop.modelValue'),
    type: 'FilterCondition[]',
    defaultValue: '[]'
  },
  {
    name: 'logic',
    description: t('example.doc.advancedSearch.prop.logic'),
    type: "'and' | 'or'",
    defaultValue: "'and'"
  },
  {
    name: 'fields / templates',
    description: t('example.doc.advancedSearch.prop.fields'),
    type: 'FilterFieldOption[] / template[]',
    defaultValue: '[]'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.advancedSearch.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'search / save-template',
    description: t('example.doc.advancedSearch.event.search'),
    type: '—',
    defaultValue: '-'
  },
  {
    name: 'update:modelValue / change',
    description: t('example.doc.advancedSearch.event.change'),
    type: '(conditions: FilterCondition[]) => void',
    defaultValue: '-'
  }
])
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
