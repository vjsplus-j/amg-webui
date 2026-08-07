<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Button } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRouter } from 'vue-router'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomOrders } from '@showcase/shared/mock-api/ecommerce'
import type { EcomOrder } from '@showcase/shared/mock-api/ecommerce'

const router = useRouter()

const list = useMockList<EcomOrder & { placedLabel: string }>({
  getData: () =>
    mockEcomOrders.map((o) => ({
      ...o,
      placedLabel: new Date(o.placedAt).toLocaleString()
    })),
  searchKeys: ['id', 'customer'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Cancelled', value: 'cancelled' }
]

const columns = computed<Column<EcomOrder>[]>(() => [
  { field: 'id', header: 'Order ID', sortable: true },
  { field: 'customer', header: 'Customer' },
  { field: 'items', header: 'Items' },
  { field: 'total', header: 'Total', render: (v) => `¥${Number(v)}` },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'placedLabel', header: 'Placed' },
  { field: 'actions', header: '', width: '100px', align: 'right' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Orders"
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
    empty-description="No orders"
    search-placeholder="Search order ID, customer…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  >
    <template #body-actions="{ row }">
      <Button
        size="sm"
        variant="outlined"
        label="View"
        @click="router.push(`/orders/${(row as EcomOrder).id}`)"
      />
    </template>
  </DataPageShell>
</template>
