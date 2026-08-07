<script setup lang="ts">
/**
 * Curated demo — Form wave1 CheckboxGroup
 */
import { ref, computed } from 'vue'
import { CheckboxGroup } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const checked = ref<unknown[]>(['name', 'status'])
const limited = ref<unknown[]>(['email'])

const options = computed(() => [
  { label: t('biz.name'), value: 'name' },
  { label: t('biz.status'), value: 'status' },
  { label: t('biz.email'), value: 'email' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { CheckboxGroup } from '@amg-webui/form'`
  ],
  script: [
    `const checked = ref(['name', 'status'])`,
    `const options = computed(() => [/* field options */])`
  ],
  template: [`  <CheckboxGroup v-model="checked" :options="options" />`]
})

const codeLimit = demoCode(
  `<CheckboxGroup v-model="limited" :options="options" :max="2" direction="vertical" />`,
  `<CheckboxGroup v-model="limited" :options="options" disabled />`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.checkboxGroup.demo.basic')"
      :description="t('example.doc.checkboxGroup.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="checked" :options="options" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkboxGroup.demo.limit')"
      :description="t('example.doc.checkboxGroup.demo.limitDesc')"
      :code="codeLimit"
    >
      <div class="vp-curated__row">
        <Space direction="vertical">
          <CheckboxGroup
            v-model="limited"
            :options="options"
            :max="2"
            direction="vertical"
          />
          <CheckboxGroup v-model="limited" :options="options" disabled />
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
