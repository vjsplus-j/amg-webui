<script setup lang="ts">
/**
 * Curated demo — Form wave2 QuarterPicker
 */
import { ref } from 'vue'
import { QuarterPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const quarter = ref<string | null>('2026-Q3')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { QuarterPicker } from '@amg-webui/form'`
  ],
  script: [`const quarter = ref('2026-Q3')`],
  template: [`  <QuarterPicker v-model="quarter" />`]
})

const codeDisabled = demoCode(
  `<QuarterPicker v-model="empty" />`,
  `<QuarterPicker v-model="quarter" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.quarterPicker.demo.basic')"
      :description="t('example.doc.quarterPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <QuarterPicker v-model="quarter" />
      </div>
      <p class="vp-curated__hint">
        {{ t('example.doc.quarterPicker.sample.selected', { quarter: quarter ?? '—' }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.quarterPicker.demo.disabled')"
      :description="t('example.doc.quarterPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <QuarterPicker v-model="empty" />
          <QuarterPicker v-model="quarter" disabled />
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
  margin: var(--spacing-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
