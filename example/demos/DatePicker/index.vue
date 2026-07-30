<script setup lang="ts">
/**
 * Curated demo — Form wave1 DatePicker
 */
import { computed, ref } from 'vue'
import { DatePicker, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const date = ref<string | null>('2026-07-30')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { DatePicker } from '@amg-webui/components/base'`
  ],
  script: [`const date = ref('2026-07-30')`],
  template: [
    `  <DatePicker`,
    `    v-model="date"`,
    `    value-format="iso"`,
    `    :placeholder="t('example.doc.datePicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<DatePicker v-model="empty" :placeholder="t('example.doc.datePicker.sample.placeholder')" />`,
  `<DatePicker v-model="date" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.datePicker.prop.modelValue'),
    type: 'string | Date | null',
    defaultValue: 'null'
  },
  {
    name: 'placeholder',
    description: t('example.doc.datePicker.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'valueFormat',
    description: t('example.doc.datePicker.prop.valueFormat'),
    type: "'date' | 'iso'",
    defaultValue: "'iso'"
  },
  {
    name: 'disabled',
    description: t('example.doc.datePicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.datePicker.event.change'),
    type: '(value: string | Date | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.datePicker.demo.basic')"
      :description="t('example.doc.datePicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <DatePicker
          v-model="date"
          value-format="iso"
          :placeholder="t('example.doc.datePicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.datePicker.demo.disabled')"
      :description="t('example.doc.datePicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <DatePicker
            v-model="empty"
            :placeholder="t('example.doc.datePicker.sample.placeholder')"
          />
          <DatePicker v-model="date" disabled />
        </Space>
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
