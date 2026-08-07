<script setup lang="ts">
/**
 * Curated demo — Form wave1 DatePicker
 */
import { ref } from 'vue'
import { DatePicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from './parts/Basic.vue'
import basicSource from './parts/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const date = ref<string | null>('2026-07-30')
const empty = ref<string | null>(null)

const codeDisabled = demoCode(
  `<DatePicker v-model="empty" :placeholder="t('example.doc.datePicker.sample.placeholder')" />`,
  `<DatePicker v-model="date" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.datePicker.demo.basic')"
      :description="t('example.doc.datePicker.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.datePicker.demo.disabled')"
      :description="t('example.doc.datePicker.demo.disabledDesc')"
      :code="codeDisabled"
    >
      <div class="vp-curated__row">
        <Space>
          <DatePicker
            v-model="empty"
            :placeholder="t('example.doc.datePicker.sample.placeholder')"
          />
          <DatePicker v-model="date" disabled />
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

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
