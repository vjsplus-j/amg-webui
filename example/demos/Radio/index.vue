<script setup lang="ts">
/**
 * Curated demo — Form wave1 Radio + RadioGroup
 */
import { computed, ref } from 'vue'
import { Radio, RadioGroup, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const solo = ref('a')
const groupVal = ref('apple')
const optionsVal = ref('zh-CN')
const vertVal = ref('1')

const langOptions = computed(() => [
  { label: t('example.doc.radio.sample.zh'), value: 'zh-CN' },
  { label: t('example.doc.radio.sample.en'), value: 'en-US' },
  { label: t('example.doc.radio.sample.ja'), value: 'ja-JP' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Radio } from '@amg-webui/components/base'`
  ],
  script: [`const solo = ref('a')`],
  template: [
    `  <Radio v-model="solo" value="a" :label="t('example.doc.radio.sample.optA')" />`,
    `  <Radio v-model="solo" value="b" :label="t('example.doc.radio.sample.optB')" />`,
    `  <Radio v-model="solo" value="c" :label="t('example.doc.radio.sample.optC')" disabled />`
  ]
})

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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue / value',
    description: t('example.doc.radio.prop.modelValue'),
    type: 'unknown',
    defaultValue: '—'
  },
  {
    name: 'label',
    description: t('example.doc.radio.prop.label'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'size',
    description: t('example.doc.radio.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'"
  },
  {
    name: 'disabled',
    description: t('example.doc.radio.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'RadioGroup.direction',
    description: t('example.doc.radio.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'RadioGroup.options',
    description: t('example.doc.radio.prop.options'),
    type: 'RadioOption[]',
    defaultValue: '—'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.radio.event.change'),
    type: '(value: unknown) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'default',
    description: t('example.doc.radio.slot.default'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.radio.demo.basic')"
      :description="t('example.doc.radio.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <Radio v-model="solo" value="a" :label="t('example.doc.radio.sample.optA')" />
          <Radio v-model="solo" value="b" :label="t('example.doc.radio.sample.optB')" />
          <Radio
            v-model="solo"
            value="c"
            :label="t('example.doc.radio.sample.optC')"
            disabled
          />
        </Space>
      </div>
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

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
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

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-curated__api-sub {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-secondary);
}
</style>
