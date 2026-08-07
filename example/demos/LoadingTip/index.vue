<script setup lang="ts">
import { computed, ref } from 'vue'
import { LoadingTip, StatusTip, ProgressTip, Button } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const pct = ref(42)

const codeTips = demoSfc({
  imports: [`import { LoadingTip, StatusTip, ProgressTip } from '@amg-webui/core'`],
  template: [
    '  <LoadingTip />',
    '  <StatusTip severity="success" closable>{{ t(\'example.doc.statusTip.sample.ok\') }}</StatusTip>',
    '  <ProgressTip :percentage="42" severity="info" :message="t(\'example.doc.progressTip.sample.msg\')" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  {
    name: 'LoadingTip.loading',
    type: 'boolean',
    defaultValue: 'true',
    description: t('example.doc.loadingTip.prop.loading')
  },
  {
    name: 'StatusTip.severity',
    type: "'info' | 'success' | 'warning' | 'danger'",
    defaultValue: 'info',
    description: t('example.doc.statusTip.prop.severity')
  },
  {
    name: 'ProgressTip.percentage',
    type: 'number',
    defaultValue: '0',
    description: t('example.doc.progressTip.prop.percentage')
  }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.loadingTip.when') }}</p>

    <DemoBlock
      :title="t('example.doc.loadingTip.demo.basic')"
      :description="t('example.doc.loadingTip.demo.basicDesc')"
      :code="codeTips"
    >
      <div class="vp-curated__stack">
        <LoadingTip />
        <div class="vp-curated__row">
          <StatusTip severity="info">{{ t('example.doc.statusTip.sample.info') }}</StatusTip>
          <StatusTip severity="success" closable>{{ t('example.doc.statusTip.sample.ok') }}</StatusTip>
          <StatusTip severity="warning">{{ t('example.doc.statusTip.sample.warn') }}</StatusTip>
          <StatusTip severity="danger">{{ t('example.doc.statusTip.sample.err') }}</StatusTip>
        </div>
        <ProgressTip
          :percentage="pct"
          severity="info"
          :message="t('example.doc.progressTip.sample.msg')"
        />
        <div class="vp-curated__row">
          <Button size="sm" variant="outlined" @click="pct = Math.max(0, pct - 10)">-10</Button>
          <Button size="sm" variant="solid" severity="primary" @click="pct = Math.min(100, pct + 10)">
            +10
          </Button>
        </div>
      </div>
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated__stack {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}
.vp-curated__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 100%;
  align-items: center;
}
</style>
