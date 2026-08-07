<script setup lang="ts">
/**
 * Curated demo — Form wave1 Checkbox + CheckboxGroup
 */
import { ref, computed } from 'vue'
import { Checkbox, CheckboxGroup } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const solo = ref(true)
const half = ref(false)
const groupVal = ref<string[]>(['read'])
const optionsVal = ref<string[]>(['a'])
const maxVal = ref<string[]>(['1', '2'])

const featureOptions = computed(() => [
  { label: t('example.doc.checkbox.sample.featureA'), value: 'a' },
  { label: t('example.doc.checkbox.sample.featureB'), value: 'b' },
  { label: t('example.doc.checkbox.sample.featureC'), value: 'c' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Checkbox } from '@amg-webui/form'`
  ],
  script: [`const solo = ref(true)`],
  template: [
    `  <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.agree')" />`,
    `  <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.disabled')" disabled />`
  ]
})

const codeIndeterminate = demoCode(
  `<Checkbox`,
  `  v-model="half"`,
  `  indeterminate`,
  `  :label="t('example.doc.checkbox.sample.indeterminate')"`,
  `/>`
)

const codeGroup = demoCode(
  `<CheckboxGroup v-model="groupVal">`,
  `  <Checkbox value="read" :label="t('example.doc.checkbox.sample.read')" />`,
  `  <Checkbox value="write" :label="t('example.doc.checkbox.sample.write')" />`,
  `  <Checkbox value="exec" :label="t('example.doc.checkbox.sample.exec')" />`,
  `</CheckboxGroup>`
)

const codeOptions = demoCode(
  `<CheckboxGroup`,
  `  v-model="optionsVal"`,
  `  :options="featureOptions"`,
  `  direction="vertical"`,
  `/>`
)

const codeMax = demoCode(
  `<CheckboxGroup v-model="maxVal" :max="2">`,
  `  <Checkbox value="1" :label="t('example.doc.checkbox.sample.item1')" />`,
  `  <Checkbox value="2" :label="t('example.doc.checkbox.sample.item2')" />`,
  `  <Checkbox value="3" :label="t('example.doc.checkbox.sample.item3')" />`,
  `  <Checkbox value="4" :label="t('example.doc.checkbox.sample.item4')" />`,
  `</CheckboxGroup>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.checkbox.demo.basic')"
      :description="t('example.doc.checkbox.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Checkbox v-model="solo" :label="t('example.doc.checkbox.sample.agree')" />
          <Checkbox
            v-model="solo"
            :label="t('example.doc.checkbox.sample.disabled')"
            disabled
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.indeterminate')"
      :description="t('example.doc.checkbox.demo.indeterminateDesc')"
      :code="codeIndeterminate"
    >
      <div class="vp-curated__row">
        <Checkbox
          v-model="half"
          indeterminate
          :label="t('example.doc.checkbox.sample.indeterminate')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.group')"
      :description="t('example.doc.checkbox.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="groupVal">
          <Checkbox value="read" :label="t('example.doc.checkbox.sample.read')" />
          <Checkbox value="write" :label="t('example.doc.checkbox.sample.write')" />
          <Checkbox value="exec" :label="t('example.doc.checkbox.sample.exec')" />
        </CheckboxGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.options')"
      :description="t('example.doc.checkbox.demo.optionsDesc')"
      :code="codeOptions"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="optionsVal" :options="featureOptions" direction="vertical" />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.checkbox.demo.max')"
      :description="t('example.doc.checkbox.demo.maxDesc')"
      :code="codeMax"
    >
      <div class="vp-curated__row">
        <CheckboxGroup v-model="maxVal" :max="2">
          <Checkbox value="1" :label="t('example.doc.checkbox.sample.item1')" />
          <Checkbox value="2" :label="t('example.doc.checkbox.sample.item2')" />
          <Checkbox value="3" :label="t('example.doc.checkbox.sample.item3')" />
          <Checkbox value="4" :label="t('example.doc.checkbox.sample.item4')" />
        </CheckboxGroup>
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
