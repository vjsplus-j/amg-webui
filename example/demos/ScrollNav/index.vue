<script setup lang="ts">
/**
 * Curated demo — Nav wave1 ScrollNav
 */
import { computed, ref } from 'vue'
import { ScrollNav, Space } from '@amg-webui/components/base'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const active = ref<string | number>('tab1')
const compactActive = ref<string | number>('tab1')

const TAB_KEYS = [
  'tab1',
  'tab2',
  'tab3',
  'tab4',
  'tab5',
  'tab6',
  'tab7',
  'tab8',
  'tab9',
  'tab10',
  'tab11',
  'tab12'
] as const

const overflowItems = computed<NavItem[]>(() =>
  TAB_KEYS.map((key) => ({
    label: t(`example.doc.scrollNav.sample.${key}`),
    value: key
  }))
)

const compactItems = computed<NavItem[]>(() =>
  TAB_KEYS.slice(0, 5).map((key) => ({
    label: t(`example.doc.scrollNav.sample.${key}`),
    value: key
  }))
)

const codeOverflow = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { ScrollNav } from '@amg-webui/components/base'`
  ],
  script: [
    `const active = ref('tab1')`,
    `const overflowItems = computed(() => [/* 12+ tabs */])`
  ],
  template: [`  <ScrollNav v-model="active" :items="overflowItems" />`]
})

const codeCompact = demoCode(
  `<ScrollNav`,
  `  v-model="compactActive"`,
  `  :items="compactItems"`,
  `  :fade-edges="false"`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'items',
    description: t('example.doc.scrollNav.prop.items'),
    type: 'NavItem[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.scrollNav.prop.modelValue'),
    type: 'string | number',
    defaultValue: '—'
  },
  {
    name: 'direction',
    description: t('example.doc.scrollNav.prop.direction'),
    type: "'horizontal' | 'vertical'",
    defaultValue: "'horizontal'"
  },
  {
    name: 'fadeEdges',
    description: t('example.doc.scrollNav.prop.fadeEdges'),
    type: 'boolean',
    defaultValue: 'true'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change / select',
    description: t('example.doc.scrollNav.event.change'),
    type: '(value | item) => void',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.scrollNav.demo.overflow')"
      :description="t('example.doc.scrollNav.demo.overflowDesc')"
      :code="codeOverflow"
      default-open
    >
      <Space direction="vertical" block size="md">
        <ScrollNav v-model="active" :items="overflowItems" />
        <p class="vp-curated__hint">
          {{ t('example.doc.scrollNav.sample.active') }}: {{ String(active) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.scrollNav.demo.basic')"
      :description="t('example.doc.scrollNav.demo.basicDesc')"
      :code="codeCompact"
    >
      <ScrollNav v-model="compactActive" :items="compactItems" :fade-edges="false" />
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
