<script setup lang="ts">
import { ref } from 'vue'
import { TimeRangeInput } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const range = ref({ start: '09:00', end: '18:00' })
const invalidRange = ref({ start: '20:00', end: '08:00' })

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TimeRangeInput } from '@amg-webui/form'`
  ],
  script: [`const range = ref({ start: '09:00', end: '18:00' })`],
  template: [`  <TimeRangeInput v-model="range" clearable />`]
})

const codeValidation = demoCode(
  `<TimeRangeInput v-model="invalidRange" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.timeRangeInput.demo.basic')"
      :description="t('example.doc.timeRangeInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TimeRangeInput v-model="range" clearable />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.timeRangeInput.demo.validation')"
      :description="t('example.doc.timeRangeInput.demo.validationDesc')"
      :code="codeValidation"
    >
      <div class="vp-curated__row">
        <TimeRangeInput v-model="invalidRange" />
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
