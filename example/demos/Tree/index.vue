<script setup lang="ts">
/**
 * Curated demo — Data wave1 Tree
 */
import { computed, ref } from 'vue'
import { Tree, Space, Switch } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
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
    `import { Tree } from '@amg-webui/components/base'`
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

const propRows = computed<PropRow[]>(() => [
  {
    name: 'options / data',
    description: t('example.doc.tree.prop.data'),
    type: 'TreeNode[]',
    defaultValue: '[]'
  },
  {
    name: 'checkable',
    description: t('example.doc.tree.prop.checkable'),
    type: 'boolean',
    defaultValue: 'true'
  },
  {
    name: 'checkStrictly',
    description: t('example.doc.tree.prop.checkStrictly'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'defaultExpandAll',
    description: t('example.doc.tree.prop.defaultExpandAll'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'virtual',
    description: t('example.doc.tree.prop.virtual'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'modelValue (v-model)',
    description: t('example.doc.tree.prop.model'),
    type: 'string[]',
    defaultValue: '[]'
  },
  {
    name: 'disabled / loading',
    description: t('example.doc.tree.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.tree.event.change'),
    type: '(value: string[]) => void',
    defaultValue: '-'
  },
  {
    name: 'node-click',
    description: t('example.doc.tree.event.nodeClick'),
    type: '(node: TreeNode) => void',
    defaultValue: '-'
  },
  {
    name: 'check-change',
    description: t('example.doc.tree.event.checkChange'),
    type: '(node, checked, indeterminate) => void',
    defaultValue: '-'
  },
  {
    name: 'node-expand / node-collapse',
    description: t('example.doc.tree.event.expand'),
    type: '(node: TreeNode) => void',
    defaultValue: '-'
  }
])
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
