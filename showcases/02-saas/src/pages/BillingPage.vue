<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasInvoices } from '@showcase/shared/mock-api/saas'
import type { SaasInvoice } from '@showcase/shared/mock-api/saas'

const list = useMockList<SaasInvoice>({
  getData: () => mockSaasInvoices,
  searchKeys: ['id', 'tenant'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Open', value: 'open' },
  { label: 'Void', value: 'void' }
]

const columns = computed<Column<SaasInvoice>[]>(() => [
  { field: 'id', header: 'Invoice', sortable: true },
  { field: 'tenant', header: 'Tenant' },
  {
    field: 'amount',
    header: 'Amount',
    render: (_, row) => `${row.currency} ${Number(row.amount).toLocaleString()}`
  },
  { field: 'issuedAt', header: 'Issued' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Billing"
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
    empty-description="No invoices"
    search-placeholder="Search invoice, tenant…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
