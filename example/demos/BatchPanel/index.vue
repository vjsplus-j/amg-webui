<script setup lang="ts">
import { computed, ref } from 'vue'
import { BatchPanel } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { ApiRow, PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const selectedCount = ref(3)
const lastAction = ref('—')

const onAction = (key: string) => {
  lastAction.value = t('example.doc.batchPanel.sample.action', { key })
}

const codeBasic = demoSfc({
  imports: [
    `import { ref } from 'vue'`,
    `import { BatchPanel } from '@amg-webui/components/base'`
  ],
  script: [`const selectedCount = ref(3)`],
  template: [
    `  <BatchPanel :selected-count="selectedCount" :total-count="12" @action="onAction" />`
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'selectedCount / totalCount',
    description: t('example.doc.batchPanel.prop.count'),
    type: 'number',
    defaultValue: '0'
  },
  {
    name: 'showEmpty',
    description: t('example.doc.batchPanel.prop.showEmpty'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'actions',
    description: t('example.doc.batchPanel.prop.actions'),
    type: 'BatchPanelAction[]',
    defaultValue: 'built-in defaults'
  }
])

const eventRows = computed<ApiRow[]>(() => [
  {
    name: 'action / clear',
    description: t('example.doc.batchPanel.event.action'),
    type: '—',
    defaultValue: '-'
  }
])
</script>

<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.batchPanel.demo.active')"
      :description="t('example.doc.batchPanel.demo.activeDesc')"
      :code="codeBasic"
      default-open
    >
      <div class="vp-curated__stack">
        <BatchPanel
          :selected-count="selectedCount"
          :total-count="12"
          @action="onAction"
          @clear="selectedCount = 0"
        />
        <p class="vp-curated__hint">{{ lastAction }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.batchPanel.demo.empty')"
      :description="t('example.doc.batchPanel.demo.emptyDesc')"
    >
      <div class="vp-curated__row">
        <BatchPanel :selected-count="0" :total-count="12" show-empty />
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
.vp-curated__row,
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  gap: var(--spacing-md);
}

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
