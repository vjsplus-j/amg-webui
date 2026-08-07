<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockIotOperations } from '@showcase/shared/mock-api/device-mgmt'
import type { IotOperation } from '@showcase/shared/mock-api/device-mgmt'

const list = useMockList<IotOperation & { startedLabel: string }>({
  getData: () =>
    mockIotOperations.map((o) => ({
      ...o,
      startedLabel: new Date(o.startedAt).toLocaleString()
    })),
  searchKeys: ['device', 'action', 'operator'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Success', value: 'success' },
  { label: 'Failed', value: 'failed' },
  { label: 'Running', value: 'running' }
]

const columns = computed<Column<IotOperation>[]>(() => [
  { field: 'device', header: 'Device', sortable: true },
  { field: 'action', header: 'Action' },
  { field: 'operator', header: 'Operator' },
  { field: 'startedLabel', header: 'Started' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Operations"
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
    empty-description="No operations logged"
    search-placeholder="Search device, action…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
