<script setup lang="ts">
/**
 * Curated demo — Form wave1 TagInput
 */
import { computed, ref } from 'vue'
import { TagInput, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const tags = ref<string[]>(['vue', 'amg'])
const limited = ref<string[]>(['alpha'])

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { TagInput } from '@amg-webui/components/base'`
  ],
  script: [`const tags = ref(['vue', 'amg'])`],
  template: [
    `  <TagInput`,
    `    v-model="tags"`,
    `    :placeholder="t('example.doc.tagInput.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeLimit = demoCode(
  `<TagInput`,
  `  v-model="limited"`,
  `  :max="3"`,
  `  unique`,
  `  :placeholder="t('example.doc.tagInput.sample.placeholder')"`,
  `/>`,
  `<TagInput v-model="limited" disabled />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.tagInput.prop.modelValue'),
    type: 'string[]',
    defaultValue: '[]'
  },
  {
    name: 'placeholder / size',
    description: t('example.doc.tagInput.prop.placeholder'),
    type: 'string / Size',
    defaultValue: '— / md'
  },
  {
    name: 'max / unique',
    description: t('example.doc.tagInput.prop.max'),
    type: 'number / boolean',
    defaultValue: '— / false'
  },
  {
    name: 'disabled / fluid',
    description: t('example.doc.tagInput.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / add / remove',
    description: t('example.doc.tagInput.event.change'),
    type: '(value: string[]) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tagInput.demo.basic')"
      :description="t('example.doc.tagInput.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <TagInput
          v-model="tags"
          :placeholder="t('example.doc.tagInput.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tagInput.demo.limit')"
      :description="t('example.doc.tagInput.demo.limitDesc')"
      :code="codeLimit"
    >
      <div class="vp-curated__row">
        <Space direction="vertical">
          <TagInput
            v-model="limited"
            :max="3"
            unique
            :placeholder="t('example.doc.tagInput.sample.placeholder')"
            fluid
          />
          <TagInput v-model="limited" disabled />
        </Space>
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
