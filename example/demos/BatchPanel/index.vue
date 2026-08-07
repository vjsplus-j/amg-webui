<script setup lang="ts">
import { ref } from 'vue'
import { BatchPanel } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import { demoSfc } from '../../components/demo/demoCode'
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
    `import { BatchPanel } from '@amg-webui/data'`
  ],
  script: [`const selectedCount = ref(3)`],
  template: [
    `  <BatchPanel :selected-count="selectedCount" :total-count="12" @action="onAction" />`
  ]
})

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
</style>
