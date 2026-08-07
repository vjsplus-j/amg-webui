<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockVideoAlarms } from '@showcase/shared/mock-api/video-surveillance'
import type { VideoAlarm } from '@showcase/shared/mock-api/video-surveillance'

const list = useMockList<VideoAlarm & { timeLabel: string }>({
  getData: () =>
    mockVideoAlarms.map((a) => ({
      ...a,
      timeLabel: new Date(a.time).toLocaleString()
    })),
  searchKeys: ['channel', 'type'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Reviewed', value: 'reviewed' },
  { label: 'Dismissed', value: 'dismissed' }
]

const columns = computed<Column<VideoAlarm>[]>(() => [
  { field: 'channel', header: 'Channel', sortable: true },
  { field: 'type', header: 'Type' },
  { field: 'timeLabel', header: 'Time' },
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
    search-placeholder="Search channel, type…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
