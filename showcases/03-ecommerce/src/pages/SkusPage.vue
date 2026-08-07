<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomSkus } from '@showcase/shared/mock-api/ecommerce'
import type { EcomSku } from '@showcase/shared/mock-api/ecommerce'

const list = useMockList<EcomSku>({
  getData: () => mockEcomSkus,
  searchKeys: ['product', 'sku', 'variant'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Out of stock', value: 'out_of_stock' }
]

const columns = computed<Column<EcomSku>[]>(() => [
  { field: 'product', header: 'Product', sortable: true },
  { field: 'sku', header: 'SKU' },
  { field: 'variant', header: 'Variant' },
  { field: 'price', header: 'Price', render: (v) => `¥${Number(v)}` },
  { field: 'stock', header: 'Stock' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="SKU"
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
    empty-description="No SKUs"
    search-placeholder="Search SKU, product, variant…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
