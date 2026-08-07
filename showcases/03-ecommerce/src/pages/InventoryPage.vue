<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomInventory } from '@showcase/shared/mock-api/ecommerce'
import type { EcomInventory } from '@showcase/shared/mock-api/ecommerce'

const list = useMockList<EcomInventory>({
  getData: () => mockEcomInventory,
  searchKeys: ['sku', 'warehouse'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All levels', value: 'all' },
  { label: 'OK', value: 'ok' },
  { label: 'Low', value: 'low' },
  { label: 'Critical', value: 'critical' }
]

const columns = computed<Column<EcomInventory>[]>(() => [
  { field: 'sku', header: 'SKU', sortable: true },
  { field: 'warehouse', header: 'Warehouse' },
  { field: 'onHand', header: 'On hand' },
  { field: 'reserved', header: 'Reserved' },
  { field: 'reorderAt', header: 'Reorder at' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Inventory"
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
    empty-description="No inventory records"
    search-placeholder="Search SKU, warehouse…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
