<script setup lang="ts">
/**
 * Curated demo — Form wave1 Slider
 */
import { ref } from 'vue'
import { Slider } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
