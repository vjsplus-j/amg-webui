<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockIotTelemetry } from '@showcase/shared/mock-api/device-mgmt'
import type { IotTelemetry } from '@showcase/shared/mock-api/device-mgmt'

const list = useMockList<IotTelemetry & { recordedLabel: string }>({
  getData: () =>
    mockIotTelemetry.map((t) => ({
      ...t,
      recordedLabel: new Date(t.recordedAt).toLocaleString()
    })),
  searchKeys: ['device', 'metric', 'value']
})

const columns = computed<Column<IotTelemetry>[]>(() => [
  { field: 'device', header: 'Device', sortable: true },
  { field: 'metric', header: 'Metric' },
  { field: 'value', header: 'Value' },
  { field: 'recordedLabel', header: 'Recorded' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Telemetry"
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
    empty-description="No telemetry data"
    search-placeholder="Search device, metric…"
    @update:search="list.search.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
