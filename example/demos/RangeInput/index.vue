<script setup lang="ts">
/**
 * Curated demo — Form wave2 RangeInput
 */
import { computed, ref } from 'vue'
import { RangeInput, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const range = ref({ min: 10, max: 100 })
const decimal = ref({ min: 1.5, max: 9.9 })
const empty = ref({ min: null, max: null })

const rangeLabel = computed(() =>
  t('example.doc.rangeInput.sample.echo', {
    min: range.value.min ?? '—',
    max: range.value.max ?? '—'
  })
)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { RangeInput } from '@amg-webui/components/base'`
  ],
  script: [`const range = ref({ min: 10, max: 100 })`],
  template: [`  <RangeInput v-model="range" />`]
})

const codePrecision = demoCode(
  `<RangeInput v-model="decimal" :precision="1" :step="0.5" />`,
  `<RangeInput v-model="empty" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.rangeInput.prop.modelValue'),
    type: '{ min?: number | null; max?: number | null }',
    defaultValue: '{ min: null, max: null }'
  },
  {
    name: 'precision / step',
    description: t('example.doc.rangeInput.prop.precision'),
    type: 'number',
    defaultValue: '0 / 1'
  },
  {
    name: 'disabled',
    description: t('example.doc.rangeInput.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.rangeInput.event.change'),
    type: '(value: RangeValue) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.rangeInput.demo.basic')"
      :description="t('example.doc.rangeInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <RangeInput v-model="range" />
        <p class="vp-curated__hint">{{ rangeLabel }}</p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.rangeInput.demo.precision')"
      :description="t('example.doc.rangeInput.demo.precisionDesc')"
      :code="codePrecision"
    >
      <div class="vp-curated__row">
        <Space>
          <RangeInput v-model="decimal" :precision="1" :step="0.5" />
          <RangeInput v-model="empty" disabled />
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
