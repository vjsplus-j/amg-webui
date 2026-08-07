<script setup lang="ts">
/**
 * Curated demo — Form wave1 InputNumber
 */
import { ref } from 'vue'
import { InputNumber } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const qty = ref<number | null>(1)
const bounded = ref<number | null>(5)
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const sizeVals = ref<Record<Size, number | null>>({
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
})

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { InputNumber } from '@amg-webui/form'`
  ],
  script: [`const qty = ref(1)`],
  template: [
    `  <InputNumber v-model="qty" />`,
    `  <InputNumber v-model="qty" disabled />`
  ]
})

const codeLimits = demoCode(
  `<InputNumber v-model="bounded" :min="1" :max="10" :step="1" />`
)

const codeSize = demoCode(
  `<InputNumber v-model="xs" size="xs" />`,
  `<InputNumber v-model="sm" size="sm" />`,
  `<InputNumber v-model="md" size="md" />`,
  `<InputNumber v-model="lg" size="lg" />`,
  `<InputNumber v-model="xl" size="xl" />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.inputNumber.demo.basic')"
      :description="t('example.doc.inputNumber.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <InputNumber v-model="qty" />
          <InputNumber v-model="qty" disabled />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputNumber.demo.limits')"
      :description="t('example.doc.inputNumber.demo.limitsDesc')"
      :code="codeLimits"
    >
      <div class="vp-curated__row">
        <InputNumber v-model="bounded" :min="1" :max="10" :step="1" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputNumber.demo.size')"
      :description="t('example.doc.inputNumber.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <InputNumber
            v-for="sz in sizes"
            :key="sz"
            v-model="sizeVals[sz]"
            :size="sz"
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
