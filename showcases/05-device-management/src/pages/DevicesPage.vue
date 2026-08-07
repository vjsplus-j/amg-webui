<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Button } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRouter } from 'vue-router'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockIotDevices } from '@showcase/shared/mock-api/device-mgmt'
import type { IotDevice } from '@showcase/shared/mock-api/device-mgmt'

const router = useRouter()

const list = useMockList<IotDevice & { lastSeenLabel: string }>({
  getData: () =>
    mockIotDevices.map((d) => ({
      ...d,
      lastSeenLabel: new Date(d.lastSeen).toLocaleString()
    })),
  searchKeys: ['name', 'model', 'group'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Sleep', value: 'sleep' }
]

const columns = computed<Column<IotDevice>[]>(() => [
  { field: 'name', header: 'Device', sortable: true },
  { field: 'model', header: 'Model' },
  { field: 'group', header: 'Group' },
  { field: 'firmware', header: 'Firmware' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'lastSeenLabel', header: 'Last seen' },
  { field: 'actions', header: '', width: '100px', align: 'right' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Device list"
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
    empty-description="No devices"
    search-placeholder="Search device, model, group…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="() => {}"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  >
    <template #body-actions="{ row }">
      <Button
        size="sm"
        variant="outlined"
        label="Detail"
        @click="router.push(`/devices/${(row as IotDevice).id}`)"
      />
    </template>
  </DataPageShell>
</template>
