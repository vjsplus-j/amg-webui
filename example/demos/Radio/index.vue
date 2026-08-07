<script setup lang="ts">
/**
 * Curated demo — Form wave1 Radio + RadioGroup
 */
import { ref, computed } from 'vue'
import { Radio, RadioGroup } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode } from '../../components/demo/demoCode'
import Basic from '@amg-webui/demos/radio/Basic.vue'
import basicSource from '@amg-webui/demos/radio/Basic.vue?raw'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const groupVal = ref('apple')
const optionsVal = ref('zh-CN')
const vertVal = ref('1')

const langOptions = computed(() => [
  { label: t('example.doc.radio.sample.zh'), value: 'zh-CN' },
  { label: t('example.doc.radio.sample.en'), value: 'en-US' },
  { label: t('example.doc.radio.sample.ja'), value: 'ja-JP' }
])

const codeGroup = demoCode(
  `<RadioGroup v-model="groupVal" name="fruit">`,
  `  <Radio value="apple" :label="t('example.doc.radio.sample.apple')" />`,
  `  <Radio value="orange" :label="t('example.doc.radio.sample.orange')" />`,
  `  <Radio value="banana" :label="t('example.doc.radio.sample.banana')" />`,
  `</RadioGroup>`
)

const codeOptions = demoCode(
  `<RadioGroup`,
  `  v-model="optionsVal"`,
  `  :options="langOptions"`,
  `  :aria-label="t('example.doc.radio.sample.langGroup')"`,
  `/>`
)

const codeVert = demoCode(
  `<RadioGroup v-model="vertVal" direction="vertical" size="lg">`,
  `  <Radio value="1" :label="t('example.doc.radio.sample.optA')" />`,
  `  <Radio value="2" :label="t('example.doc.radio.sample.optB')" />`,
  `  <Radio value="3" :label="t('example.doc.radio.sample.optC')" />`,
  `</RadioGroup>`
)

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.radio.demo.basic')"
      :description="t('example.doc.radio.demo.basicDesc')"
      :code="basicSource"
      default-open
    >
      <Basic />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.radio.demo.group')"
      :description="t('example.doc.radio.demo.groupDesc')"
      :code="codeGroup"
    >
      <div class="vp-curated__row">
        <RadioGroup v-model="groupVal" name="fruit">
          <Radio value="apple" :label="t('example.doc.radio.sample.apple')" />
          <Radio value="orange" :label="t('example.doc.radio.sample.orange')" />
          <Radio value="banana" :label="t('example.doc.radio.sample.banana')" />
        </RadioGroup>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.radio.demo.options')"
      :description="t('example.doc.radio.demo.optionsDesc')"
      :code="codeOptions"
    >
      <div class="vp-curated__row">
        <RadioGroup
          v-model="optionsVal"
          :options="langOptions"
          :aria-label="t('example.doc.radio.sample.langGroup')"
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.radio.demo.vertical')"
      :description="t('example.doc.radio.demo.verticalDesc')"
      :code="codeVert"
    >
      <div class="vp-curated__row">
        <RadioGroup v-model="vertVal" direction="vertical" size="lg">
          <Radio value="1" :label="t('example.doc.radio.sample.optA')" />
          <Radio value="2" :label="t('example.doc.radio.sample.optB')" />
          <Radio value="3" :label="t('example.doc.radio.sample.optC')" />
        </RadioGroup>
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
