<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Card, Progress } from 'amg-webui'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasUsage } from '@showcase/shared/mock-api/saas'
import type { SaasUsage } from '@showcase/shared/mock-api/saas'

const list = useMockList<SaasUsage>({
  getData: () => mockSaasUsage,
  searchKeys: ['tenant', 'metric', 'period']
})

const columns = computed<Column<SaasUsage>[]>(() => [
  { field: 'tenant', header: 'Tenant', sortable: true },
  { field: 'metric', header: 'Metric' },
  { field: 'used', header: 'Used', render: (v) => Number(v).toLocaleString() },
  { field: 'limit', header: 'Limit', render: (v) => Number(v).toLocaleString() },
  { field: 'period', header: 'Period' }
])

function usagePercent(row: SaasUsage) {
  return Math.min(100, Math.round((row.used / row.limit) * 100))
}

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Usage"
    :phase="list.phase.value"
    :error-message="list.errorMessage.value"
    :columns="columns"
    :rows="list.pagedRows.value"
    :total="list.total.value"
    :page="list.page.value"
    :page-size="list.pageSize.value"
    :search="list.search.value"
    :status-filter="'all'"
    :status-options="[{ label: 'All metrics', value: 'all' }]"
    :show-create="false"
    empty-description="No usage data"
    search-placeholder="Search tenant, metric…"
    @update:search="list.search.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Card v-if="list.phase.value === 'ready'" title="Quota utilization">
    <div class="showcase-grid showcase-grid--2">
      <div v-for="row in list.filteredRows.value" :key="row.id" class="showcase-panel">
        <p class="showcase-panel__title">{{ row.tenant }} — {{ row.metric }}</p>
        <Progress :value="usagePercent(row)" :max="100" />
        <p class="showcase-usage-meta">
          {{ row.used.toLocaleString() }} / {{ row.limit.toLocaleString() }} ({{ row.period }})
        </p>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.showcase-usage-meta {
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: var(--theme-text-secondary, #64748b);
}
</style>
