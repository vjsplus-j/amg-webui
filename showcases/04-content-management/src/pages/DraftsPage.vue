<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Button } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRouter } from 'vue-router'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsDrafts } from '@showcase/shared/mock-api/cms'
import type { CmsDraft } from '@showcase/shared/mock-api/cms'

const router = useRouter()

const list = useMockList<CmsDraft & { savedLabel: string }>({
  getData: () =>
    mockCmsDrafts.map((d) => ({
      ...d,
      savedLabel: new Date(d.savedAt).toLocaleString()
    })),
  searchKeys: ['title', 'author'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Editing', value: 'editing' },
  { label: 'Autosaved', value: 'autosaved' }
]

const columns = computed<Column<CmsDraft>[]>(() => [
  { field: 'title', header: 'Draft', sortable: true },
  { field: 'author', header: 'Author' },
  { field: 'wordCount', header: 'Words' },
  { field: 'savedLabel', header: 'Last saved' },
  { field: 'status', header: 'Status' },
  { field: 'actions', header: '', width: '100px', align: 'right' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Drafts"
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
    empty-description="No drafts"
    search-placeholder="Search draft, author…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  >
    <template #body-actions>
      <Button size="sm" variant="outlined" label="Edit" @click="router.push('/editor')" />
    </template>
  </DataPageShell>
</template>
