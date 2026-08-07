<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsPublishJobs } from '@showcase/shared/mock-api/cms'
import type { CmsPublishJob } from '@showcase/shared/mock-api/cms'

const list = useMockList<CmsPublishJob & { scheduledLabel: string }>({
  getData: () =>
    mockCmsPublishJobs.map((j) => ({
      ...j,
      scheduledLabel: new Date(j.scheduledAt).toLocaleString()
    })),
  searchKeys: ['title', 'channel'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Queued', value: 'queued' },
  { label: 'Publishing', value: 'publishing' },
  { label: 'Done', value: 'done' },
  { label: 'Failed', value: 'failed' }
]

const columns = computed<Column<CmsPublishJob>[]>(() => [
  { field: 'title', header: 'Content', sortable: true },
  { field: 'channel', header: 'Channel' },
  { field: 'scheduledLabel', header: 'Scheduled' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Publish queue"
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
    empty-description="No publish jobs"
    search-placeholder="Search title, channel…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
