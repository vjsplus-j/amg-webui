<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsMedia } from '@showcase/shared/mock-api/cms'
import type { CmsMedia } from '@showcase/shared/mock-api/cms'

const list = useMockList<CmsMedia>({
  getData: () => mockCmsMedia,
  searchKeys: ['name'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Ready', value: 'ready' },
  { label: 'Processing', value: 'processing' }
]

const columns = computed<Column<CmsMedia>[]>(() => [
  { field: 'name', header: 'File', sortable: true },
  { field: 'type', header: 'Type' },
  { field: 'size', header: 'Size' },
  { field: 'uploadedAt', header: 'Uploaded' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Media library"
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
    empty-description="No media files"
    search-placeholder="Search filename…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="() => {}"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
