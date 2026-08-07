<script setup lang="ts">
import { computed, onMounted } from 'vue'
import type { Column } from 'amg-webui'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasSubscriptions } from '@showcase/shared/mock-api/saas'
import type { SaasSubscription } from '@showcase/shared/mock-api/saas'

const list = useMockList<SaasSubscription>({
  getData: () => mockSaasSubscriptions,
  searchKeys: ['tenant', 'plan'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Past due', value: 'past_due' },
  { label: 'Cancelled', value: 'cancelled' }
]

const columns = computed<Column<SaasSubscription>[]>(() => [
  { field: 'tenant', header: 'Tenant', sortable: true },
  { field: 'plan', header: 'Plan' },
  { field: 'seats', header: 'Seats' },
  { field: 'mrr', header: 'MRR', render: (v) => `$${Number(v).toLocaleString()}` },
  { field: 'renewsAt', header: 'Renews' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Subscriptions"
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
    empty-description="No subscriptions"
    search-placeholder="Search tenant, plan…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />
</template>
