<script setup lang="ts">
/**
 * Curated demo — Form wave1 InputNumber
 */
import { computed, ref } from 'vue'
import { InputNumber, Space } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const qty = ref<number | null>(1)
const bounded = ref<number | null>(5)
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const sizeVals = ref<Record<Size, number | null>>({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
})

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { InputNumber } from '@amg-webui/components/base'`
  ],
  script: [`const qty = ref(1)`],
  template: [
    `  <InputNumber v-model="qty" />`,
    `  <InputNumber v-model="qty" disabled />`
  ]
})

const codeLimits = demoCode(
  `<InputNumber v-model="bounded" :min="1" :max="10" :step="1" />`
)

const codeSize = demoCode(
  `<InputNumber v-model="xs" size="xs" />`,
  `<InputNumber v-model="sm" size="sm" />`,
  `<InputNumber v-model="md" size="md" />`,
  `<InputNumber v-model="lg" size="lg" />`,
  `<InputNumber v-model="xl" size="xl" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.inputNumber.prop.modelValue'),
    type: 'number | null',
    defaultValue: 'null'
  },
  {
    name: 'min / max',
    description: t('example.doc.inputNumber.prop.minMax'),
    type: 'number',
    defaultValue: '—'
  },
  {
    name: 'step / precision',
    description: t('example.doc.inputNumber.prop.step'),
    type: 'number',
    defaultValue: '1 / —'
  },
  {
    name: 'controls / size',
    description: t('example.doc.inputNumber.prop.controls'),
    type: 'boolean / Size',
    defaultValue: 'true / md'
  },
  {
    name: 'disabled',
    description: t('example.doc.inputNumber.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.inputNumber.event.change'),
    type: '(value: number | null) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.inputNumber.demo.basic')"
      :description="t('example.doc.inputNumber.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <InputNumber v-model="qty" />
          <InputNumber v-model="qty" disabled />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputNumber.demo.limits')"
      :description="t('example.doc.inputNumber.demo.limitsDesc')"
      :code="codeLimits"
    >
      <div class="vp-curated__row">
        <InputNumber v-model="bounded" :min="1" :max="10" :step="1" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputNumber.demo.size')"
      :description="t('example.doc.inputNumber.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <InputNumber
            v-for="sz in sizes"
            :key="sz"
            v-model="sizeVals[sz]"
            :size="sz"
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
