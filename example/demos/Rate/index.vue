<script setup lang="ts">
/**
 * Curated demo — Form wave1 Rate
 */
import { ref } from 'vue'
import { Rate } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const score = ref(3)
const halfScore = ref(2.5)

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Rate } from '@amg-webui/form'`
  ],
  script: [`const score = ref(3)`],
  template: [
    `  <Rate v-model="score" />`,
    `  <Rate v-model="score" disabled />`
  ]
})

const codeHalf = demoCode(
  `<Rate v-model="halfScore" allow-half clearable :max="5" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.rate.demo.basic')"
      :description="t('example.doc.rate.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Rate v-model="score" />
          <Rate v-model="score" disabled />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.rate.demo.half')"
      :description="t('example.doc.rate.demo.halfDesc')"
      :code="codeHalf"
    >
      <div class="vp-curated__row">
        <Rate v-model="halfScore" allow-half clearable :max="5" />
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
