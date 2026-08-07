<script setup lang="ts">
/**
 * Curated demo — Data wave1 TreeSelect
 */
import { computed, ref } from 'vue'
import { TreeSelect } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import type { TreeSelectOption } from '@amg-webui/data/TreeSelect'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
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
    `import { TreeSelect } from '@amg-webui/data'`
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
  imports: [`import { TreeSelect } from '@amg-webui/data'`],
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
</style>
