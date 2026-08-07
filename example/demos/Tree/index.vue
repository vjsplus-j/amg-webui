<script setup lang="ts">
/**
 * Curated demo — Data wave1 Tree
 */
import { ref, computed } from 'vue'
import { Tree } from '@amg-webui/data'
import { Space } from '@amg-webui/core'
import { Switch } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const treeOptions = computed(() => [
  {
    label: t('example.doc.tree.sample.a'),
    value: 'a',
    children: [
      { label: t('example.doc.tree.sample.a1'), value: 'a1' },
      { label: t('example.doc.tree.sample.a2'), value: 'a2' }
    ]
  },
  {
    label: t('example.doc.tree.sample.b'),
    value: 'b',
    children: [{ label: t('example.doc.tree.sample.b1'), value: 'b1' }]
  }
])

const checked = ref<string[]>(['a1'])
const browseChecked = ref<string[]>([])
const strictChecked = ref<string[]>(['a1'])
const checkStrictly = ref(false)
const lastEvent = ref('—')

const codeCheckable = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Tree } from '@amg-webui/data'`
  ],
  script: [
    `const checked = ref(['a1'])`,
    `const treeOptions = computed(() => [/* … */])`
  ],
  template: [`  <Tree v-model="checked" :options="treeOptions" checkable />`]
})

const codeStrict = demoCode(
  `<Tree`,
  `  v-model="strictChecked"`,
  `  :options="treeOptions"`,
  `  checkable`,
  `  :check-strictly="checkStrictly"`,
  `  @check-change="onCheckChange"`,
  `/>`
)

const codeBrowse = demoCode(
  `<Tree`,
  `  v-model="browseChecked"`,
  `  :options="treeOptions"`,
  `  :checkable="false"`,
  `  default-expand-all`,
  `  @node-click="onNodeClick"`,
  `/>`
)

function onCheckChange(_node: unknown, checked: boolean, indeterminate: boolean) {
  lastEvent.value = t('example.doc.tree.sample.checkEvent', {
    checked: String(checked),
    indeterminate: String(indeterminate)
  })
}

function onNodeClick(node: { label: string }) {
  lastEvent.value = t('example.doc.tree.sample.clickEvent', { label: node.label })
}

</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.tree.demo.checkable')"
      :description="t('example.doc.tree.demo.checkableDesc')"
      :code="codeCheckable"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Tree v-model="checked" :options="treeOptions" checkable />
        <p class="vp-curated__hint">
          {{ t('example.doc.tree.sample.checked') }}:
          {{ checked.length ? checked.join(', ') : '—' }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tree.demo.strict')"
      :description="t('example.doc.tree.demo.strictDesc')"
      :code="codeStrict"
    >
      <Space direction="vertical" block size="md">
        <div class="vp-curated__row">
          <span>{{ t('example.doc.tree.sample.strictToggle') }}</span>
          <Switch v-model="checkStrictly" />
        </div>
        <Tree
          v-model="strictChecked"
          :options="treeOptions"
          checkable
          :check-strictly="checkStrictly"
          @check-change="onCheckChange"
        />
        <p class="vp-curated__hint">{{ lastEvent }}</p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.tree.demo.expand')"
      :description="t('example.doc.tree.demo.expandDesc')"
      :code="codeBrowse"
    >
      <Space direction="vertical" block size="md">
        <Tree
          v-model="browseChecked"
          :options="treeOptions"
          :checkable="false"
          default-expand-all
          @node-click="onNodeClick"
        />
        <p class="vp-curated__hint">{{ t('example.doc.tree.sample.expandHint') }}</p>
      </Space>
    </DemoBlock>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-curated__row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-curated__api {
  width: 100%;
  margin-top: var(--theme-section-gap);
}
</style>
