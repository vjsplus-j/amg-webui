<script setup lang="ts">
/**
 * Curated demo — Form wave1 RadioGroup
 */
import { computed, ref } from 'vue'
import { RadioGroup, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const picked = ref<unknown>('name')
const vertical = ref<unknown>('status')

const options = computed(() => [
  { label: t('biz.name'), value: 'name' },
  { label: t('biz.status'), value: 'status' },
  { label: t('biz.email'), value: 'email' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { RadioGroup } from '@amg-webui/components/base'`
  ],
  script: [
    `const picked = ref('name')`,
    `const options = computed(() => [/* field options */])`
  ],
  template: [`  <RadioGroup v-model="picked" :options="options" />`]
})

const codeVertical = demoCode(
  `<RadioGroup v-model="vertical" :options="options" direction="vertical" />`,
  `<RadioGroup v-model="picked" :options="options" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.radioGroup.prop.modelValue'),
    type: 'unknown',
    defaultValue: '—'
  },
  {
    name: 'options',
    description: t('example.doc.radioGroup.prop.options'),
    type: 'RadioOption[]',
    defaultValue: '[]'
  },
  {
    name: 'direction / name',
    description: t('example.doc.radioGroup.prop.direction'),
    type: "'horizontal' | 'vertical' / string",
    defaultValue: 'horizontal / —'
  },
  {
    name: 'disabled',
    description: t('example.doc.radioGroup.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.radioGroup.event.change'),
    type: '(value: unknown) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.radioGroup.demo.basic')"
      :description="t('example.doc.radioGroup.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <RadioGroup v-model="picked" :options="options" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.radioGroup.demo.vertical')"
      :description="t('example.doc.radioGroup.demo.verticalDesc')"
      :code="codeVertical"
    >
      <div class="vp-curated__row">
        <Space>
          <RadioGroup v-model="vertical" :options="options" direction="vertical" />
          <RadioGroup v-model="picked" :options="options" disabled />
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
