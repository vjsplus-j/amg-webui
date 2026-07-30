<script setup lang="ts">
/**
 * Curated demo — Form wave1 TimePicker
 */
import { computed, ref } from 'vue'
import { TimePicker, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const time = ref<string | null>('14:30:00')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TimePicker } from '@amg-webui/components/base'`
  ],
  script: [`const time = ref('14:30:00')`],
  template: [
    `  <TimePicker`,
    `    v-model="time"`,
    `    :placeholder="t('example.doc.timePicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeSeconds = demoCode(
  `<TimePicker v-model="time" show-seconds />`,
  `<TimePicker v-model="empty" disabled :placeholder="t('example.doc.timePicker.sample.placeholder')" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.timePicker.prop.modelValue'),
    type: 'string | Date | null',
    defaultValue: 'null'
  },
  {
    name: 'placeholder',
    description: t('example.doc.timePicker.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'showSeconds / valueFormat',
    description: t('example.doc.timePicker.prop.showSeconds'),
    type: 'boolean / time | date',
    defaultValue: 'false / time'
  },
  {
    name: 'disabled',
    description: t('example.doc.timePicker.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.timePicker.event.change'),
    type: '(value: string | Date | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.timePicker.demo.basic')"
      :description="t('example.doc.timePicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TimePicker
          v-model="time"
          :placeholder="t('example.doc.timePicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.timePicker.demo.seconds')"
      :description="t('example.doc.timePicker.demo.secondsDesc')"
      :code="codeSeconds"
    >
      <div class="vp-curated__row">
        <Space>
          <TimePicker v-model="time" show-seconds />
          <TimePicker
            v-model="empty"
            disabled
            :placeholder="t('example.doc.timePicker.sample.placeholder')"
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
