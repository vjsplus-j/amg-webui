<script setup lang="ts">
import { computed, ref } from 'vue'
import { TimeRangeInput } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const range = ref({ start: '09:00', end: '18:00' })
const invalidRange = ref({ start: '20:00', end: '08:00' })

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TimeRangeInput } from '@amg-webui/form'`
  ],
  script: [`const range = ref({ start: '09:00', end: '18:00' })`],
  template: [`  <TimeRangeInput v-model="range" clearable />`]
})

const codeValidation = demoCode(
  `<TimeRangeInput v-model="invalidRange" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.timeRangeInput.prop.modelValue'),
    type: '{ start?: string | null; end?: string | null }',
    defaultValue: '{ start: null, end: null }'
  },
  {
    name: 'clearable',
    description: t('example.doc.timeRangeInput.prop.clearable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'showSeconds',
    description: t('example.doc.timeRangeInput.prop.showSeconds'),
    type: 'boolean',
    defaultValue: 'true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change / clear',
    description: t('example.doc.timeRangeInput.event.change'),
    type: '—',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.timeRangeInput.demo.basic')"
      :description="t('example.doc.timeRangeInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TimeRangeInput v-model="range" clearable />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.timeRangeInput.demo.validation')"
      :description="t('example.doc.timeRangeInput.demo.validationDesc')"
      :code="codeValidation"
    >
      <div class="vp-curated__row">
        <TimeRangeInput v-model="invalidRange" />
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
