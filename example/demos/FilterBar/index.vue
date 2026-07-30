<script setup lang="ts">
/**
 * Curated demo — Form wave1 FilterBar
 */
import { computed, ref } from 'vue'
import { FilterBar } from '@amg-webui/components/base'
import type { FilterCondition } from '@amg-webui/components/base/FilterBar/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const conditions = ref<FilterCondition[]>([])
const preset = ref<FilterCondition[]>([
  { id: 'demo-1', field: 'name', operator: 'contains', value: 'demo' }
])

const fields = computed(() => [
  { label: t('example.doc.filterBar.sample.fieldName'), value: 'name' },
  { label: t('example.doc.filterBar.sample.fieldStatus'), value: 'status' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { FilterBar } from '@amg-webui/components/base'`
  ],
  script: [
    `const conditions = ref([])`,
    `const fields = computed(() => [/* filter fields */])`
  ],
  template: [`  <FilterBar v-model="conditions" :fields="fields" />`]
})

const codePreset = demoCode(
  `<FilterBar v-model="preset" :fields="fields" />`,
  `<FilterBar v-model="conditions" :fields="fields" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.filterBar.prop.modelValue'),
    type: 'FilterCondition[]',
    defaultValue: '[]'
  },
  {
    name: 'fields',
    description: t('example.doc.filterBar.prop.fields'),
    type: 'FilterFieldOption[]',
    defaultValue: '[]'
  },
  {
    name: 'collapsed / loading',
    description: t('example.doc.filterBar.prop.collapsed'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.filterBar.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.filterBar.event.change'),
    type: '(value: FilterCondition[]) => void',
    defaultValue: '-'
  },
  {
    name: 'search / reset',
    description: t('example.doc.filterBar.event.search'),
    type: '(value: FilterCondition[]) => void / () => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.filterBar.demo.basic')"
      :description="t('example.doc.filterBar.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <FilterBar v-model="conditions" :fields="fields" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.filterBar.demo.preset')"
      :description="t('example.doc.filterBar.demo.presetDesc')"
      :code="codePreset"
    >
      <div class="vp-curated__row">
        <FilterBar v-model="preset" :fields="fields" />
      </div>
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
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
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
