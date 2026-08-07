<script setup lang="ts">
/**
 * Curated demo — Form wave2 RangeInput
 */
import { ref, computed } from 'vue'
import { RangeInput } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { RangeInput } from '@amg-webui/form'`
  ],
  script: [`const range = ref({ min: 10, max: 100 })`],
  template: [`  <RangeInput v-model="range" />`]
})

const codePrecision = demoCode(
  `<RangeInput v-model="decimal" :precision="1" :step="0.5" />`,
  `<RangeInput v-model="empty" disabled />`
)

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
</style>
