<script setup lang="ts">
/**
 * Curated demo — Form wave1 RadioGroup
 */
import { ref, computed } from 'vue'
import { RadioGroup } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const picked = ref<unknown>('name')
const vertical = ref<unknown>('status')

const options = computed(() => [
  { label: t('biz.name'), value: 'name' },
  { label: t('biz.status'), value: 'status' },
  { label: t('biz.email'), value: 'email' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { RadioGroup } from '@amg-webui/form'`
  ],
  script: [
    `const picked = ref('name')`,
    `const options = computed(() => [/* field options */])`
  ],
  template: [`  <RadioGroup v-model="picked" :options="options" />`]
})

const codeVertical = demoCode(
  `<RadioGroup v-model="vertical" :options="options" direction="vertical" />`,
  `<RadioGroup v-model="picked" :options="options" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.radioGroup.demo.basic')"
      :description="t('example.doc.radioGroup.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <RadioGroup v-model="picked" :options="options" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.radioGroup.demo.vertical')"
      :description="t('example.doc.radioGroup.demo.verticalDesc')"
      :code="codeVertical"
    >
      <div class="vp-curated__row">
        <Space>
          <RadioGroup v-model="vertical" :options="options" direction="vertical" />
          <RadioGroup v-model="picked" :options="options" disabled />
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
