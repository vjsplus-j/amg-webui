<script setup lang="ts">
/**
 * Curated demo — Form wave2 WeekPicker
 */
import { ref } from 'vue'
import { WeekPicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const week = ref<string | null>('2026-W30')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { WeekPicker } from '@amg-webui/form'`
  ],
  script: [`const week = ref('2026-W30')`],
  template: [`  <WeekPicker v-model="week" />`]
})

const codeDisabled = demoCode(
  `<WeekPicker v-model="empty" />`,
  `<WeekPicker v-model="week" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.weekPicker.demo.basic')"
      :description="t('example.doc.weekPicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <WeekPicker v-model="week" />
      </div>
      <p class="vp-curated__hint">
        {{ t('example.doc.weekPicker.sample.selected', { week: week ?? '—' }) }}
      </p>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.weekPicker.demo.disabled')"
      :description="t('example.doc.weekPicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <WeekPicker v-model="empty" />
          <WeekPicker v-model="week" disabled />
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
