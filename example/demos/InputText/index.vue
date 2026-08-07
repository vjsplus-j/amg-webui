<script setup lang="ts">
/**
 * Curated demo — Form wave1 InputText
 */
import { computed, ref } from 'vue'
import { InputText } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const basic = ref('')
const limited = ref('')
const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const sizeVals = ref<Record<Size, string>>({
  xs: '',
  sm: '',
  md: '',
  lg: '',
  xl: ''
})

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { InputText } from '@amg-webui/form'`
  ],
  script: [`const value = ref('')`],
  template: [
    `  <InputText v-model="value" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
    `  <InputText v-model="value" disabled />`
  ]
})

const codeSize = demoCode(
  `<InputText v-model="xs" size="xs" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="sm" size="sm" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="md" size="md" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="lg" size="lg" :placeholder="t('example.doc.inputText.sample.placeholder')" />`,
  `<InputText v-model="xl" size="xl" :placeholder="t('example.doc.inputText.sample.placeholder')" />`
)

const codeLimit = demoCode(
  `<InputText`,
  `  v-model="limited"`,
  `  :maxlength="20"`,
  `  :placeholder="t('example.doc.inputText.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.inputText.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'placeholder',
    description: t('example.doc.inputText.prop.placeholder'),
    type: 'string',
    defaultValue: '—'
  },
  {
    name: 'size',
    description: t('example.doc.inputText.prop.size'),
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    defaultValue: "'md'"
  },
  {
    name: 'disabled / readonly',
    description: t('example.doc.inputText.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'maxlength / fluid',
    description: t('example.doc.inputText.prop.maxlength'),
    type: 'number / boolean',
    defaultValue: '— / false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.inputText.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.inputText.demo.basic')"
      :description="t('example.doc.inputText.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Space>
          <InputText
            v-model="basic"
            :placeholder="t('example.doc.inputText.sample.placeholder')"
          />
          <InputText
            v-model="basic"
            disabled
            :placeholder="t('example.doc.inputText.sample.placeholder')"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputText.demo.size')"
      :description="t('example.doc.inputText.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-curated__row">
        <Space>
          <InputText
            v-for="sz in sizes"
            :key="sz"
            v-model="sizeVals[sz]"
            :size="sz"
            :placeholder="t('example.doc.inputText.sample.placeholder')"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.inputText.demo.limit')"
      :description="t('example.doc.inputText.demo.limitDesc')"
      :code="codeLimit"
    >
      <div class="vp-curated__row">
        <InputText
          v-model="limited"
          :maxlength="20"
          fluid
          :placeholder="t('example.doc.inputText.sample.placeholder')"
        />
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
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
