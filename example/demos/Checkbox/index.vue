<script setup lang="ts">
/**
 * Curated demo — Form wave1 Checkbox + CheckboxGroup
 */
import { computed, ref } from 'vue'
import { Checkbox, CheckboxGroup } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const solo = ref(true)
const half = ref(false)
const groupVal = ref<string[]>(['read'])
const optionsVal = ref<string[]>(['a'])
const maxVal = ref<string[]>(['1', '2'])

const featureOptions = computed(() => [
  { label: t('example.doc.checkbox.sample.featureA'), value: 'a' },
  { label: t('example.doc.checkbox.sample.featureB'), value: 'b' },
  { label: t('example.doc.checkbox.sample.featureC'), value: 'c' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Checkbox } from '@amg-webui/form'`
  ],
  script: [`const solo = ref(true)`],
  template: [
    `  <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.agree')" />`,
    `  <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.disabled')" disabled />`
  ]
})

const codeIndeterminate = demoCode(
  `<Checkbox`,
  `  v-model="half"`,
  `  indeterminate`,
  `  :label="t('example.doc.checkbox.sample.indeterminate')"`,
  `/>`
)

const codeGroup = demoCode(
  `<CheckboxGroup v-model="groupVal">`,
  `  <Checkbox value="read" :label="t('example.doc.checkbox.sample.read')" />`,
  `  <Checkbox value="write" :label="t('example.doc.checkbox.sample.write')" />`,
  `  <Checkbox value="exec" :label="t('example.doc.checkbox.sample.exec')" />`,
  `</CheckboxGroup>`
)

const codeOptions = demoCode(
  `<CheckboxGroup`,
  `  v-model="optionsVal"`,
  `  :options="featureOptions"`,
  `  direction="vertical"`,
  `/>`
)

const codeMax = demoCode(
  `<CheckboxGroup v-model="maxVal" :max="2">`,
  `  <Checkbox value="1" :label="t('example.doc.checkbox.sample.item1')" />`,
  `  <Checkbox value="2" :label="t('example.doc.checkbox.sample.item2')" />`,
  `  <Checkbox value="3" :label="t('example.doc.checkbox.sample.item3')" />`,
  `  <Checkbox value="4" :label="t('example.doc.checkbox.sample.item4')" />`,
  `</CheckboxGroup>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.checkbox.prop.modelValue'),
    type: 'boolean | unknown[] (group)',
    defaultValue: 'false / []'
  },
  {
    name: 'value / label',
    description: t('example.doc.checkbox.prop.label'),
    type: 'unknown / string',
    defaultValue: '—'
  },
  {
    name: 'indeterminate',
    description: t('example.doc.checkbox.prop.indeterminate'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'size',
    description: t('example.doc.checkbox.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'"
  },
  {
    name: 'CheckboxGroup.max',
    description: t('example.doc.checkbox.prop.max'),
    type: 'number',
    defaultValue: '—'
  },
  {
    name: 'CheckboxGroup.options',
    description: t('example.doc.checkbox.prop.options'),
    type: 'CheckboxOption[]',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.checkbox.event.change'),
    type: '(value: boolean | unknown[]) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.checkbox.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.checkbox.demo.basic')"
      :description="t('example.doc.checkbox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.agree')" />
          <Checkbox
            v-model="solo"
            :label="t('example.doc.checkbox.sample.disabled')"
            disabled
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.indeterminate')"
      :description="t('example.doc.checkbox.demo.indeterminateDesc')"
      :code="codeIndeterminate"
    >
      <div class="vp-curated__row">
        <Checkbox
          v-model="half"
          indeterminate
          :label="t('example.doc.checkbox.sample.indeterminate')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.group')"
      :description="t('example.doc.checkbox.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="groupVal">
          <Checkbox value="read" :label="t('example.doc.checkbox.sample.read')" />
          <Checkbox value="write" :label="t('example.doc.checkbox.sample.write')" />
          <Checkbox value="exec" :label="t('example.doc.checkbox.sample.exec')" />
        </CheckboxGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.options')"
      :description="t('example.doc.checkbox.demo.optionsDesc')"
      :code="codeOptions"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="optionsVal" :options="featureOptions" direction="vertical" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.max')"
      :description="t('example.doc.checkbox.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="maxVal" :max="2">
          <Checkbox value="1" :label="t('example.doc.checkbox.sample.item1')" />
          <Checkbox value="2" :label="t('example.doc.checkbox.sample.item2')" />
          <Checkbox value="3" :label="t('example.doc.checkbox.sample.item3')" />
          <Checkbox value="4" :label="t('example.doc.checkbox.sample.item4')" />
        </CheckboxGroup>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
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
