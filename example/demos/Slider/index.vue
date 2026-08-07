<script setup lang="ts">
/**
 * Curated demo — Form wave1 Slider
 */
import { computed, ref } from 'vue'
import { Slider } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const volume = ref(40)
const range = ref<[number, number]>([20, 70])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Slider } from '@amg-webui/form'`
  ],
  script: [`const volume = ref(40)`],
  template: [`  <Slider v-model="volume" :min="0" :max="100" />`]
})

const codeRange = demoCode(
  `<Slider v-model="range" range :min="0" :max="100" :step="5" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.slider.prop.modelValue'),
    type: 'number | [number, number]',
    defaultValue: '0'
  },
  {
    name: 'min / max / step',
    description: t('example.doc.slider.prop.minMax'),
    type: 'number',
    defaultValue: '0 / 100 / 1'
  },
  {
    name: 'range',
    description: t('example.doc.slider.prop.range'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'showTooltip / disabled',
    description: t('example.doc.slider.prop.showTooltip'),
    type: 'boolean',
    defaultValue: 'true / false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.slider.event.change'),
    type: '(value: number | [number, number]) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.slider.demo.basic')"
      :description="t('example.doc.slider.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Slider v-model="volume" :min="0" :max="100" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.slider.demo.range')"
      :description="t('example.doc.slider.demo.rangeDesc')"
      :code="codeRange"
    >
      <div class="vp-curated__row">
        <Slider v-model="range" range :min="0" :max="100" :step="5" />
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
