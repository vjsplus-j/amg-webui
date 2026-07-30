<script setup lang="ts">
/**
 * Curated demo — Data wave1 Transfer
 */
import { computed, ref } from 'vue'
import { Transfer, Space } from '@amg-webui/components/base'
import type { TransferItem } from '@amg-webui/components/base/Transfer'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoCode, demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()

const selected = ref<(string | number)[]>(['a'])
const filterSelected = ref<(string | number)[]>([])

const transferData = computed<TransferItem[]>(() => [
  { key: 'a', label: t('example.doc.transfer.sample.a') },
  { key: 'b', label: t('example.doc.transfer.sample.b') },
  { key: 'c', label: t('example.doc.transfer.sample.c') },
  { key: 'd', label: t('example.doc.transfer.sample.d') },
  { key: 'e', label: t('example.doc.transfer.sample.e') },
  { key: 'f', label: t('example.doc.transfer.sample.f') }
])

const codeBasic = demoSfc({
  imports: [
    `import { ref, computed } from 'vue'`,
    `import { Transfer } from '@amg-webui/components/base'`
  ],
  script: [
    `const selected = ref(['a'])`,
    `const transferData = computed(() => [/* … */])`
  ],
  template: [`  <Transfer v-model="selected" :data="transferData" />`]
})

const codeFilterable = demoCode(
  `<Transfer`,
  `  v-model="filterSelected"`,
  `  :data="transferData"`,
  `  filterable`,
  `/>`
)

const propRows = computed<PropRow[]>(() => [
  {
    name: 'data',
    description: t('example.doc.transfer.prop.data'),
    type: 'TransferItem[]',
    defaultValue: '[]'
  },
  {
    name: 'modelValue',
    description: t('example.doc.transfer.prop.modelValue'),
    type: '(string | number)[]',
    defaultValue: '[]'
  },
  {
    name: 'filterable',
    description: t('example.doc.transfer.prop.filterable'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'disabled',
    description: t('example.doc.transfer.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'update:modelValue / change',
    description: t('example.doc.transfer.event.change'),
    type: '(keys: (string | number)[]) => void',
    defaultValue: '-'
  }
])

const slotRows = computed<ApiRow[]>(() => [
  {
    name: 'left-title / right-title',
    description: t('example.doc.transfer.slot.titles'),
    type: 'VNode',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.transfer.demo.basic')"
      :description="t('example.doc.transfer.demo.basicDesc')"
      :code="codeBasic"
      default-open
    >
      <Space direction="vertical" block size="md">
        <Transfer v-model="selected" :data="transferData" />
        <p class="vp-curated__hint">
          {{ t('example.doc.transfer.sample.selected') }}:
          {{ selected.length ? selected.join(', ') : '—' }}
        </p>
      </Space>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.transfer.demo.filterable')"
      :description="t('example.doc.transfer.demo.filterableDesc')"
      :code="codeFilterable"
    >
      <Transfer v-model="filterSelected" :data="transferData" filterable />
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
