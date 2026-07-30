<script setup lang="ts">
/**
 * Curated demo — Data wave1 TreeSelect
 */
import { computed, ref } from 'vue'
import { TreeSelect, Space } from '@amg-webui/components/base'
import type { TreeSelectOption } from '@amg-webui/components/base/TreeSelect'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const picked = ref<unknown>('a1')
const cleared = ref<unknown>(undefined)
const filtered = ref<unknown>('a1')
const multiPicked = ref<unknown[]>(['a1', 'b1'])

const treeOptions = computed<TreeSelectOption[]>(() => [
  {
    label: t('example.doc.treeSelect.sample.a'),
    value: 'a',
    children: [
      { label: t('example.doc.treeSelect.sample.a1'), value: 'a1' },
      { label: t('example.doc.treeSelect.sample.a2'), value: 'a2' }
    ]
  },
  {
    label: t('example.doc.treeSelect.sample.b'),
    value: 'b',
    children: [{ label: t('example.doc.treeSelect.sample.b1'), value: 'b1' }]
  }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { TreeSelect } from '@amg-webui/components/base'`
  ],
  script: [
    `const picked = ref('a1')`,
    `const treeOptions = computed(() => [/* … */])`
  ],
  template: [`  <TreeSelect v-model="picked" :options="treeOptions" clearable />`]
})

const codeFilter = demoCode(
  `<TreeSelect`,
  `  v-model="filtered"`,
  `  :options="treeOptions"`,
  `  filterable`,
  `  clearable`,
  `/>`
)

const codeMultiple = demoSfc({
  imports: [`import { TreeSelect } from '@amg-webui/components/base'`],
  template: [
    `  <TreeSelect`,
    `    v-model="multiPicked"`,
    `    :options="treeOptions"`,
    `    multiple`,
    `    show-checkbox`,
    `    filterable`,
    `  />`
  ]
})

const codePlaceholder = demoCode(
  `<TreeSelect`,
  `  v-model="cleared"`,
  `  :options="treeOptions"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'options',
    description: t('example.doc.treeSelect.prop.options'),
    type: 'TreeSelectOption[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.treeSelect.prop.modelValue'),
    type: 'unknown | unknown[]',
    defaultValue: '—'
  },
  {
    name: 'filterable / clearable',
    description: t('example.doc.treeSelect.prop.filterable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'multiple / showCheckbox',
    description: t('example.doc.treeSelect.prop.multiple'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'placeholder',
    description: t('example.doc.treeSelect.prop.placeholder'),
    type: 'string',
    defaultValue: 'i18n default'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.treeSelect.event.change'),
    type: '(value) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.treeSelect.demo.basic')"
      :description="t('example.doc.treeSelect.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <TreeSelect v-model="picked" :options="treeOptions" clearable />
        <p class="vp-curated__hint">
          {{ t('example.doc.treeSelect.sample.selected') }}: {{ picked ?? '—' }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.treeSelect.demo.filter')"
      :description="t('example.doc.treeSelect.demo.filterDesc')"
      :code="codeFilter"
    >
      <TreeSelect
        v-model="filtered"
        :options="treeOptions"
        filterable
        clearable
      />
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.treeSelect.demo.multiple')"
      :description="t('example.doc.treeSelect.demo.multipleDesc')"
      :code="codeMultiple"
    >
      <Space direction="vertical" block size="md">
        <TreeSelect
          v-model="multiPicked"
          :options="treeOptions"
          multiple
          show-checkbox
          filterable
        />
        <p class="vp-curated__hint">
          {{ t('example.doc.treeSelect.sample.multiSelected', {
            list: multiPicked.length ? multiPicked.join(', ') : '—'
          }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.treeSelect.demo.placeholder')"
      :description="t('example.doc.treeSelect.demo.placeholderDesc')"
      :code="codePlaceholder"
    >
      <TreeSelect v-model="cleared" :options="treeOptions" />
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
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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
