<script setup lang="ts">
/**
 * Curated demo — Form wave1 Search
 */
import { computed, ref } from 'vue'
import { Search } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const keyword = ref('')
const cleared = ref('')

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { Search } from '@amg-webui/form'`
  ],
  script: [`const keyword = ref('')`],
  template: [
    `  <Search`,
    `    v-model="keyword"`,
    `    :placeholder="t('example.doc.search.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeClearable = demoCode(
  `<Search`,
  `  v-model="cleared"`,
  `  clearable`,
  `  :placeholder="t('example.doc.search.sample.placeholder')"`,
  `/>`,
  `<Search v-model="cleared" disabled :placeholder="t('example.doc.search.sample.placeholder')" />`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.search.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'placeholder / size',
    description: t('example.doc.search.prop.placeholder'),
    type: 'string / Size',
    defaultValue: '— / md'
  },
  {
    name: 'clearable / fluid',
    description: t('example.doc.search.prop.clearable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.search.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / search',
    description: t('example.doc.search.event.search'),
    type: '(value: string) => void',
    defaultValue: '-'
  },
  {
    name: 'clear',
    description: t('example.doc.search.event.clear'),
    type: '() => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.search.demo.basic')"
      :description="t('example.doc.search.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Search
          v-model="keyword"
          :placeholder="t('example.doc.search.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.search.demo.clearable')"
      :description="t('example.doc.search.demo.clearableDesc')"
      :code="codeClearable"
    >
      <div class="vp-curated__row">
        <Space>
          <Search
            v-model="cleared"
            clearable
            :placeholder="t('example.doc.search.sample.placeholder')"
          />
          <Search
            v-model="cleared"
            disabled
            :placeholder="t('example.doc.search.sample.placeholder')"
          />
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
