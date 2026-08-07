<script setup lang="ts">
/**
 * Curated demo — Form wave1 TimePicker
 */
import { ref } from 'vue'
import { TimePicker } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const time = ref<string | null>('14:30:00')
const empty = ref<string | null>(null)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TimePicker } from '@amg-webui/form'`
  ],
  script: [`const time = ref('14:30:00')`],
  template: [
    `  <TimePicker`,
    `    v-model="time"`,
    `    :placeholder="t('example.doc.timePicker.sample.placeholder')"`,
    `  />`
  ]
})

const codeSeconds = demoCode(
  `<TimePicker v-model="time" show-seconds />`,
  `<TimePicker v-model="empty" disabled :placeholder="t('example.doc.timePicker.sample.placeholder')" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.timePicker.demo.basic')"
      :description="t('example.doc.timePicker.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TimePicker
          v-model="time"
          :placeholder="t('example.doc.timePicker.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.timePicker.demo.seconds')"
      :description="t('example.doc.timePicker.demo.secondsDesc')"
      :code="codeSeconds"
    >
      <div class="vp-curated__row">
        <Space>
          <TimePicker v-model="time" show-seconds />
          <TimePicker
            v-model="empty"
            disabled
            :placeholder="t('example.doc.timePicker.sample.placeholder')"
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
