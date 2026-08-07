<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockIotAlarms } from '@showcase/shared/mock-api/device-mgmt'
import type { IotAlarm } from '@showcase/shared/mock-api/device-mgmt'

const list = useMockList<IotAlarm & { raisedLabel: string }>({
  getData: () =>
    mockIotAlarms.map((a) => ({
      ...a,
      raisedLabel: new Date(a.raisedAt).toLocaleString()
    })),
  searchKeys: ['device', 'message'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Acknowledged', value: 'acknowledged' },
  { label: 'Resolved', value: 'resolved' }
]

const columns = computed<Column<IotAlarm>[]>(() => [
  { field: 'device', header: 'Device', sortable: true },
  { field: 'severity', header: 'Severity', sortable: true },
  { field: 'message', header: 'Message' },
  { field: 'raisedLabel', header: 'Raised' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Alarms"
    :phase="list.phase.value"
    :error-message="list.errorMessage.value"
    :columns="columns"
    :rows="list.pagedRows.value"
    :total="list.total.value"
    :page="list.page.value"
    :page-size="list.pageSize.value"
    :search="list.search.value"
    :status-filter="list.statusFilter.value"
    :status-options="statusOptions"
    :show-create="false"
    empty-description="No alarms"
    search-placeholder="Search device, message…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
