<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockVideoSnapshots } from '@showcase/shared/mock-api/video-surveillance'
import type { VideoSnapshot } from '@showcase/shared/mock-api/video-surveillance'

const list = useMockList<VideoSnapshot & { capturedLabel: string }>({
  getData: () =>
    mockVideoSnapshots.map((s) => ({
      ...s,
      capturedLabel: new Date(s.capturedAt).toLocaleString()
    })),
  searchKeys: ['channel']
})

const columns = computed<Column<VideoSnapshot>[]>(() => [
  { field: 'channel', header: 'Channel', sortable: true },
  { field: 'capturedLabel', header: 'Captured' },
  { field: 'size', header: 'Size' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Snapshots"
    :phase="list.phase.value"
    :error-message="list.errorMessage.value"
    :columns="columns"
    :rows="list.pagedRows.value"
    :total="list.total.value"
    :page="list.page.value"
    :page-size="list.pageSize.value"
    :search="list.search.value"
    :status-filter="'all'"
    :status-options="[{ label: 'All channels', value: 'all' }]"
    :show-create="false"
    empty-description="No snapshots"
    search-placeholder="Search channel…"
    @update:search="list.search.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
