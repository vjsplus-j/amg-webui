<script setup lang="ts">
/**
 * Curated demo — Form wave2 MonthPicker
 */
import { computed, ref } from 'vue'
import { MonthPicker, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const month = ref<string | null>('2026-07-01')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { MonthPicker } from '@amg-webui/components/base'`
  ],
  script: [`const month = ref('2026-07-01')`],
  template: [
    `  <MonthPicker`,
    `    v-model="month"`,
    `    value-format="iso"`,
    `    :placeholder="t('example.doc.monthPicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeDisabled = demoCode(
  `<MonthPicker v-model="empty" :placeholder="t('example.doc.monthPicker.sample.placeholder')" />`,
  `<MonthPicker v-model="month" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.monthPicker.prop.modelValue'),
    type: 'string | Date | null',
    defaultValue: 'null'
  },
  {
    name: 'placeholder',
    description: t('example.doc.monthPicker.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'valueFormat',
    description: t('example.doc.monthPicker.prop.valueFormat'),
    type: "'date' | 'iso'",
    defaultValue: "'iso'"
  },
  {
    name: 'disabled',
    description: t('example.doc.monthPicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.monthPicker.event.change'),
    type: '(value: string | Date | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.monthPicker.demo.basic')"
      :description="t('example.doc.monthPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <MonthPicker
          v-model="month"
          value-format="iso"
          :placeholder="t('example.doc.monthPicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.monthPicker.demo.disabled')"
      :description="t('example.doc.monthPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <MonthPicker
            v-model="empty"
            :placeholder="t('example.doc.monthPicker.sample.placeholder')"
          />
          <MonthPicker v-model="month" disabled />
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
