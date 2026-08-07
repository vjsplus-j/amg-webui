<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockVideoRecordings } from '@showcase/shared/mock-api/video-surveillance'
import type { VideoRecording } from '@showcase/shared/mock-api/video-surveillance'

const list = useMockList<VideoRecording>({
  getData: () => mockVideoRecordings,
  searchKeys: ['channel'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Ready', value: 'ready' },
  { label: 'Recording', value: 'recording' },
  { label: 'Archived', value: 'archived' }
]

const columns = computed<Column<VideoRecording>[]>(() => [
  { field: 'channel', header: 'Channel', sortable: true },
  { field: 'start', header: 'Start' },
  { field: 'end', header: 'End' },
  { field: 'size', header: 'Size' },
  { field: 'type', header: 'Type' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Recordings"
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
    empty-description="No recordings"
    search-placeholder="Search channel…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
