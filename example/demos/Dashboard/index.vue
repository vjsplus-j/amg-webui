<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dashboard } from '@amg-webui/data'
import { Card, StatusTip } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const loading = ref(false)
const selected = ref('')

const stats = computed(() => [
  { id: 'users', label: t('example.doc.dashboard.sample.users'), value: 1284, trend: 'up' as const },
  { id: 'orders', label: t('example.doc.dashboard.sample.orders'), value: 356, trend: 'flat' as const },
  { id: 'revenue', label: t('example.doc.dashboard.sample.revenue'), value: '$42k', trend: 'down' as const }
])

const widgets = computed(() => [
  { id: 'users', span: 1 },
  { id: 'orders', span: 1 },
  { id: 'revenue', span: 1 },
  { id: 'chart', span: 3 }
])

const codeBasic = demoSfc({
  imports: [`import { Dashboard } from '@amg-webui/data'`],
  template: [
    '  <Dashboard :stats="stats" :columns="3" @select-stat="onSelect" @refresh="onRefresh" />'
  ]
})

const propRows = computed<PropRow[]>(() => [
  { name: 'stats', type: 'DashboardStat[]', description: t('example.doc.dashboard.prop.stats') },
  { name: 'widgets', type: 'DashboardWidget[]', description: t('example.doc.dashboard.prop.widgets') },
  { name: 'columns', type: 'number', defaultValue: '3', description: t('example.doc.dashboard.prop.columns') }
])

function onRefresh() {
  loading.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 800)
}
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.dashboard.when') }}</p>

    <DemoBlock
      :title="t('example.doc.dashboard.demo.stats')"
      :description="t('example.doc.dashboard.demo.statsDesc')"
      :code="codeBasic"
    >
      <Dashboard
        :stats="stats"
        :loading="loading"
        :columns="3"
        @refresh="onRefresh"
        @select-stat="selected = $event.label"
      />
      <StatusTip
        v-if="selected"
        class="vp-curated__tip"
        severity="info"
        :message="t('example.doc.dashboard.sample.selected', { label: selected })"
      />
    </DemoBlock>

    <DemoBlock :title="t('example.doc.dashboard.demo.widgets')" :description="t('example.doc.dashboard.demo.widgetsDesc')">
      <Dashboard :widgets="widgets" :stats="stats" :columns="3">
        <template #widget-chart>
          <Card :title="t('example.doc.dashboard.sample.chart')" bordered>
            <p class="vp-curated__chart-placeholder">{{ t('example.doc.dashboard.sample.chartBody') }}</p>
          </Card>
        </template>
      </Dashboard>
    </DemoBlock>

    <DemoBlock :title="t('example.doc.dashboard.demo.empty')" :description="t('example.doc.dashboard.demo.emptyDesc')">
      <Dashboard />
    </DemoBlock>

    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated__tip {
  margin-top: var(--spacing-md);
  width: 100%;
}
.vp-curated__chart-placeholder {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}
</style>
