<script setup lang="ts">
/**
 * Curated demo — Form wave1 FilterBar
 */
import { ref, computed } from 'vue'
import { FilterBar } from '@amg-webui/form'
import type { FilterCondition } from '@amg-webui/form/FilterBar/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { FilterBar } from '@amg-webui/form'`
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
</style>
