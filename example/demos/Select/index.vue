<script setup lang="ts">
/**
 * Curated demo — Form wave1 Select
 */
import { computed, ref } from 'vue'
import { Select, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref<string | undefined>('a')
const cleared = ref<string | undefined>()
const multiValue = ref<(string | number)[]>(['a', 'b'])
const remoteValue = ref<string | undefined>()
const largeValue = ref<string | number | undefined>()

const options = computed(() => [
  { label: t('example.doc.select.sample.optA'), value: 'a' },
  { label: t('example.doc.select.sample.optB'), value: 'b' },
  { label: t('example.doc.select.sample.optC'), value: 'c' }
])

const multiOptions = computed(() => [
  ...options.value,
  { label: t('example.doc.select.sample.optD'), value: 'd' },
  { label: t('example.doc.select.sample.optE'), value: 'e' }
])

const remoteOptions = ref<{ label: string; value: string }[]>([])
const remoteLoading = ref(false)

const allRemote = computed(() => [
  { label: t('example.doc.select.sample.remoteA'), value: 'ra' },
  { label: t('example.doc.select.sample.remoteB'), value: 'rb' },
  { label: t('example.doc.select.sample.remoteC'), value: 'rc' },
  { label: t('example.doc.select.sample.remoteD'), value: 'rd' }
])

function onRemoteMethod(query: string) {
  remoteLoading.value = true
  window.setTimeout(() => {
    const lower = query.trim().toLowerCase()
    remoteOptions.value = lower
      ? allRemote.value.filter((item) => item.label.toLowerCase().includes(lower))
      : allRemote.value
    remoteLoading.value = false
  }, 400)
}

const largeOptions = computed(() =>
  Array.from({ length: 120 }, (_, i) => ({
    label: t('example.doc.select.sample.largeOpt', { n: i + 1 }),
    value: `opt-${i + 1}`
  }))
)

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Select } from '@amg-webui/components/base'`
  ],
  script: [
    `const value = ref('a')`,
    `const options = computed(() => [`,
    `  { label: t('example.doc.select.sample.optA'), value: 'a' },`,
    `  { label: t('example.doc.select.sample.optB'), value: 'b' },`,
    `  { label: t('example.doc.select.sample.optC'), value: 'c' }`,
    `])`
  ],
  template: [
    `  <Select`,
    `    v-model="value"`,
    `    :options="options"`,
    `    :placeholder="t('example.doc.select.sample.placeholder')"`,
    `    fluid`,
    `  />`
  ]
})

const codeClearable = demoCode(
  `<Select`,
  `  v-model="cleared"`,
  `  :options="options"`,
  `  clearable`,
  `  filterable`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `/>`,
  `<Select`,
  `  v-model="cleared"`,
  `  :options="options"`,
  `  disabled`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `/>`
)

const codeMultiple = demoCode(
  `<Select`,
  `  v-model="multiValue"`,
  `  :options="multiOptions"`,
  `  multiple`,
  `  collapse-tags`,
  `  clearable`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const codeRemote = demoCode(
  `<Select`,
  `  v-model="remoteValue"`,
  `  :options="remoteOptions"`,
  `  remote`,
  `  filterable`,
  `  :loading="remoteLoading"`,
  `  :remote-method="onRemoteMethod"`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const codeVirtual = demoCode(
  `<Select`,
  `  v-model="largeValue"`,
  `  :options="largeOptions"`,
  `  filterable`,
  `  virtual`,
  `  :placeholder="t('example.doc.select.sample.placeholder')"`,
  `  fluid`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'modelValue',
    description: t('example.doc.select.prop.modelValue'),
    type: 'string | number | boolean | (string | number)[]',
    defaultValue: '—'
  },
  {
    name: 'options',
    description: t('example.doc.select.prop.options'),
    type: 'SelectOption[]',
    defaultValue: '[]'
  },
  {
    name: 'multiple / collapseTags',
    description: t('example.doc.select.prop.multiple'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'remote / remoteMethod / loading',
    description: t('example.doc.select.prop.remote'),
    type: 'boolean / fn / boolean',
    defaultValue: 'false / — / false'
  },
  {
    name: 'virtual / virtualThreshold',
    description: t('example.doc.select.prop.virtual'),
    type: 'boolean / number',
    defaultValue: 'auto / 60'
  },
  {
    name: 'placeholder / size',
    description: t('example.doc.select.prop.placeholder'),
    type: 'string / Size',
    defaultValue: '— / md'
  },
  {
    name: 'clearable / filterable',
    description: t('example.doc.select.prop.clearable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.select.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.select.event.change'),
    type: '(value) => void',
    defaultValue: '-'
  },
  {
    name: 'remove-tag',
    description: t('example.doc.select.event.removeTag'),
    type: '(value: string | number) => void',
    defaultValue: '-'
  },
  {
    name: 'clear',
    description: t('example.doc.select.event.clear'),
    type: '() => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.select.demo.basic')"
      :description="t('example.doc.select.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__row">
        <Select
          v-model="value"
          :options="options"
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.clearable')"
      :description="t('example.doc.select.demo.clearableDesc')"
      :code="codeClearable"
    >
      <div class="vp-curated__row">
        <Space>
          <Select
            v-model="cleared"
            :options="options"
            clearable
            filterable
            :placeholder="t('example.doc.select.sample.placeholder')"
          />
          <Select
            v-model="cleared"
            :options="options"
            disabled
            :placeholder="t('example.doc.select.sample.placeholder')"
          />
        </Space>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.multiple')"
      :description="t('example.doc.select.demo.multipleDesc')"
      :code="codeMultiple"
    >
      <div class="vp-curated__row">
        <Select
          v-model="multiValue"
          :options="multiOptions"
          multiple
          collapse-tags
          clearable
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.remote')"
      :description="t('example.doc.select.demo.remoteDesc')"
      :code="codeRemote"
    >
      <div class="vp-curated__row">
        <Select
          v-model="remoteValue"
          :options="remoteOptions"
          remote
          filterable
          :loading="remoteLoading"
          :remote-method="onRemoteMethod"
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
        />
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.select.demo.virtual')"
      :description="t('example.doc.select.demo.virtualDesc')"
      :code="codeVirtual"
    >
      <div class="vp-curated__row">
        <Select
          v-model="largeValue"
          :options="largeOptions"
          filterable
          virtual
          :placeholder="t('example.doc.select.sample.placeholder')"
          fluid
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
