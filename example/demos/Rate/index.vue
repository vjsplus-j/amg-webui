<script setup lang="ts">
/**
 * Curated demo — Form wave1 Rate
 */
import { computed, ref } from 'vue'
import { Rate, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const score = ref(3)
const halfScore = ref(2.5)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Rate } from '@amg-webui/components/base'`
  ],
  script: [`const score = ref(3)`],
  template: [
    `  <Rate v-model="score" />`,
    `  <Rate v-model="score" disabled />`
  ]
})

const codeHalf = demoCode(
  `<Rate v-model="halfScore" allow-half clearable :max="5" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.rate.prop.modelValue'),
    type: 'number',
    defaultValue: '0'
  },
  {
    name: 'max',
    description: t('example.doc.rate.prop.max'),
    type: 'number',
    defaultValue: '5'
  },
  {
    name: 'allowHalf / clearable',
    description: t('example.doc.rate.prop.allowHalf'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.rate.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.rate.event.change'),
    type: '(value: number) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.rate.demo.basic')"
      :description="t('example.doc.rate.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Rate v-model="score" />
          <Rate v-model="score" disabled />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.rate.demo.half')"
      :description="t('example.doc.rate.demo.halfDesc')"
      :code="codeHalf"
    >
      <div class="vp-curated__row">
        <Rate v-model="halfScore" allow-half clearable :max="5" />
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
