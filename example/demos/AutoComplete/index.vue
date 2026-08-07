<script setup lang="ts">
/**
 * Curated demo — Form wave1 AutoComplete
 */
import { computed, ref } from 'vue'
import { AutoComplete } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const query = ref('')
const remoteQuery = ref('')

const suggestions = computed(() => [
  t('example.doc.autoComplete.sample.suggestA'),
  t('example.doc.autoComplete.sample.suggestB'),
  t('example.doc.autoComplete.sample.suggestC')
])

const allRemote = computed(() => [
  t('example.doc.autoComplete.sample.suggestA'),
  t('example.doc.autoComplete.sample.suggestB'),
  t('example.doc.autoComplete.sample.suggestC'),
  t('example.doc.autoComplete.sample.suggestD')
])

function onFetchSuggestions(
  q: string,
  cb: (items: string[]) => void
) {
  const lower = q.trim().toLowerCase()
  cb(
    lower
      ? allRemote.value.filter((item) => item.toLowerCase().includes(lower))
      : allRemote.value
  )
}

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { AutoComplete } from '@amg-webui/form'`
  ],
  script: [
    `const query = ref('')`,
    `const suggestions = computed(() => [`,
    `  t('example.doc.autoComplete.sample.suggestA'),`,
    `  t('example.doc.autoComplete.sample.suggestB'),`,
    `  t('example.doc.autoComplete.sample.suggestC')`,
    `])`
  ],
  template: [
    `  <AutoComplete`,
    `    v-model="query"`,
    `    :suggestions="suggestions"`,
    `    :placeholder="t('example.doc.autoComplete.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeRemote = demoCode(
  `<AutoComplete`,
  `  v-model="remoteQuery"`,
  `  :placeholder="t('example.doc.autoComplete.sample.placeholder')"`,
  `  @fetch-suggestions="onFetchSuggestions"`,
  `/>`,
  `<AutoComplete`,
  `  v-model="remoteQuery"`,
  `  disabled`,
  `  :placeholder="t('example.doc.autoComplete.sample.placeholder')"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.autoComplete.prop.modelValue'),
    type: 'string',
    defaultValue: "''"
  },
  {
    name: 'suggestions',
    description: t('example.doc.autoComplete.prop.suggestions'),
    type: 'AutoCompleteSuggestion[]',
    defaultValue: '[]'
  },
  {
    name: 'placeholder / size',
    description: t('example.doc.autoComplete.prop.placeholder'),
    type: 'string / Size',
    defaultValue: '— / md'
  },
  {
    name: 'debounce / fluid',
    description: t('example.doc.autoComplete.prop.debounce'),
    type: 'number / boolean',
    defaultValue: '300 / false'
  },
  {
    name: 'disabled',
    description: t('example.doc.autoComplete.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / select',
    description: t('example.doc.autoComplete.event.change'),
    type: '(value: string) => void',
    defaultValue: '-'
  },
  {
    name: 'fetchSuggestions',
    description: t('example.doc.autoComplete.event.fetch'),
    type: '(query, cb) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.autoComplete.demo.basic')"
      :description="t('example.doc.autoComplete.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <AutoComplete
          v-model="query"
          :suggestions="suggestions"
          :placeholder="t('example.doc.autoComplete.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.autoComplete.demo.remote')"
      :description="t('example.doc.autoComplete.demo.remoteDesc')"
      :code="codeRemote"
    >
      <div class="vp-curated__row">
        <Space>
          <AutoComplete
            v-model="remoteQuery"
            :placeholder="t('example.doc.autoComplete.sample.placeholder')"
            @fetch-suggestions="onFetchSuggestions"
          />
          <AutoComplete
            v-model="remoteQuery"
            disabled
            :placeholder="t('example.doc.autoComplete.sample.placeholder')"
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
