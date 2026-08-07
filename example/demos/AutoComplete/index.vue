<script setup lang="ts">
/**
 * Curated demo — Form wave1 AutoComplete
 */
import { ref, computed } from 'vue'
import { AutoComplete } from '@amg-webui/form'
import { Space } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
