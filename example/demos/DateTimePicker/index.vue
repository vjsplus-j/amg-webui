<script setup lang="ts">
/**
 * Curated demo — Form wave1 DateTimePicker
 */
import { computed, ref } from 'vue'
import { DateTimePicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const datetime = ref<string | null>('2026-07-30T14:30:00')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { DateTimePicker } from '@amg-webui/form'`
  ],
  script: [`const datetime = ref('2026-07-30T14:30:00')`],
  template: [
    `  <DateTimePicker`,
    `    v-model="datetime"`,
    `    value-format="iso"`,
    `    :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeSeconds = demoCode(
  `<DateTimePicker v-model="datetime" show-seconds value-format="iso" />`,
  `<DateTimePicker v-model="empty" disabled :placeholder="t('example.doc.dateTimePicker.sample.placeholder')" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.dateTimePicker.prop.modelValue'),
    type: 'string | Date | null',
    defaultValue: 'null'
  },
  {
    name: 'placeholder',
    description: t('example.doc.dateTimePicker.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'showSeconds / valueFormat',
    description: t('example.doc.dateTimePicker.prop.showSeconds'),
    type: 'boolean / iso | date',
    defaultValue: 'false / iso'
  },
  {
    name: 'disabled',
    description: t('example.doc.dateTimePicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.dateTimePicker.event.change'),
    type: '(value: string | Date | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.dateTimePicker.demo.basic')"
      :description="t('example.doc.dateTimePicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <DateTimePicker
          v-model="datetime"
          value-format="iso"
          :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dateTimePicker.demo.seconds')"
      :description="t('example.doc.dateTimePicker.demo.secondsDesc')"
      :code="codeSeconds"
    >
      <div class="vp-curated__row">
        <Space>
          <DateTimePicker v-model="datetime" show-seconds value-format="iso" />
          <DateTimePicker
            v-model="empty"
            disabled
            :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"
          />
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
