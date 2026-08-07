<script setup lang="ts">
/**
 * Curated demo — Nav wave1 Dropdown
 */
import { computed, ref } from 'vue'
import { Dropdown } from '@amg-webui/overlay'
import { Space } from '@amg-webui/core'
import type { NavItem } from '@amg-webui/utils/nav'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const active = ref<string | number>('edit')
const nestedActive = ref<string | number>('copyLink')

const items = computed<NavItem[]>(() => [
  { label: t('example.doc.dropdown.sample.edit'), value: 'edit', icon: 'Pencil' },
  { label: t('example.doc.dropdown.sample.duplicate'), value: 'duplicate', icon: 'Copy' },
  { label: t('example.doc.dropdown.sample.archive'), value: 'archive', disabled: true },
  { label: t('example.doc.dropdown.sample.delete'), value: 'delete', icon: 'Trash2' }
])

const nestedItems = computed<NavItem[]>(() => [
  { label: t('example.doc.dropdown.sample.edit'), value: 'edit', icon: 'Pencil' },
  { type: 'divider', label: '' },
  {
    label: t('example.doc.dropdown.sample.share'),
    icon: 'Share2',
    children: [
      { label: t('example.doc.dropdown.sample.copyLink'), value: 'copyLink', icon: 'Link' },
      { label: t('example.doc.dropdown.sample.export'), value: 'export', icon: 'Download' }
    ]
  },
  { type: 'divider', label: '' },
  { label: t('example.doc.dropdown.sample.delete'), value: 'delete', icon: 'Trash2' }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Dropdown } from '@amg-webui/overlay'`
  ],
  script: [`const active = ref('edit')`],
  template: [
    `  <Dropdown v-model="active" :items="items">`,
    `    <template #trigger>{{ t('example.doc.dropdown.sample.trigger') }}</template>`,
    `  </Dropdown>`
  ]
})

const codeNested = demoCode(
  `<Dropdown v-model="nestedActive" :items="nestedItems">`,
  `  <template #trigger>{{ t('example.doc.dropdown.sample.nestedTrigger') }}</template>`,
  `</Dropdown>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'items',
    description: t('example.doc.dropdown.prop.items'),
    type: 'NavItem[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.dropdown.prop.model'),
    type: 'string | number',
    defaultValue: '—'
  },
  {
    name: 'disabled',
    description: t('example.doc.dropdown.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change / select',
    description: t('example.doc.dropdown.event.change'),
    type: '(value | item) => void',
    defaultValue: '-'
  },
  {
    name: 'openChange',
    description: t('example.doc.dropdown.event.openChange'),
    type: '(open: boolean) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'trigger',
    description: t('example.doc.dropdown.slot.trigger'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.dropdown.demo.basic')"
      :description="t('example.doc.dropdown.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Dropdown v-model="active" :items="items">
          <template #trigger>{{ t('example.doc.dropdown.sample.trigger') }}</template>
        </Dropdown>
        <p class="vp-curated__hint">
          {{ t('example.doc.dropdown.sample.active', { key: String(active) }) }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.dropdown.demo.nested')"
      :description="t('example.doc.dropdown.demo.nestedDesc')"
      :code="codeNested"
    >
      <Space direction="vertical" block size="md">
        <Dropdown v-model="nestedActive" :items="nestedItems">
          <template #trigger>{{ t('example.doc.dropdown.sample.nestedTrigger') }}</template>
        </Dropdown>
        <p class="vp-curated__hint">
          {{ t('example.doc.dropdown.sample.active', { key: String(nestedActive) }) }}
        </p>
      </Space>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.props) }}</h3>
      <PropsTable :rows="propRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.events) }}</h3>
      <PropsTable :rows="eventRows" />
      <h3 class="vp-curated__api-sub">{{ t(LocaleKeys.exampleDoc.slots) }}</h3>
      <PropsTable :rows="slotRows" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.vp-curated__hint {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-body);
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
