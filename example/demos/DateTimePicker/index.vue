<script setup lang="ts">
/**
 * Curated demo — Form wave1 DateTimePicker
 */
import { ref } from 'vue'
import { DateTimePicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const datetime = ref<string | null>('2026-07-30T14:30:00')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { DateTimePicker } from '@amg-webui/form'`
  ],
  script: [`const datetime = ref('2026-07-30T14:30:00')`],
  template: [
    `  <DateTimePicker`,
    `    v-model="datetime"`,
    `    value-format="iso"`,
    `    :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeSeconds = demoCode(
  `<DateTimePicker v-model="datetime" show-seconds value-format="iso" />`,
  `<DateTimePicker v-model="empty" disabled :placeholder="t('example.doc.dateTimePicker.sample.placeholder')" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.dateTimePicker.demo.basic')"
      :description="t('example.doc.dateTimePicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <DateTimePicker
          v-model="datetime"
          value-format="iso"
          :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dateTimePicker.demo.seconds')"
      :description="t('example.doc.dateTimePicker.demo.secondsDesc')"
      :code="codeSeconds"
    >
      <div class="vp-curated__row">
        <Space>
          <DateTimePicker v-model="datetime" show-seconds value-format="iso" />
          <DateTimePicker
            v-model="empty"
            disabled
            :placeholder="t('example.doc.dateTimePicker.sample.placeholder')"
          />
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
