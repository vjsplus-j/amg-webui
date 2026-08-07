<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomCustomers } from '@showcase/shared/mock-api/ecommerce'
import type { EcomCustomer } from '@showcase/shared/mock-api/ecommerce'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  email: '',
  segment: 'new' as EcomCustomer['segment'],
  status: 'active' as EcomCustomer['status']
})

const list = useMockList<EcomCustomer>({
  getData: () => mockEcomCustomers,
  searchKeys: ['name', 'email'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' }
]

const columns = computed<Column<EcomCustomer>[]>(() => [
  { field: 'name', header: 'Customer', sortable: true },
  { field: 'email', header: 'Email' },
  { field: 'orders', header: 'Orders' },
  { field: 'lifetime', header: 'Lifetime', render: (v) => `¥${Number(v).toLocaleString()}` },
  { field: 'segment', header: 'Segment' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Customers"
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
    empty-description="No customers"
    search-placeholder="Search name, email…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Add customer" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Email" prop="email"><InputText v-model="form.email" fluid /></FormItem>
      <FormItem label="Segment" prop="segment">
        <Select
          v-model="form.segment"
          :options="[
            { label: 'VIP', value: 'vip' },
            { label: 'Regular', value: 'regular' },
            { label: 'New', value: 'new' }
          ]"
          fluid
        />
      </FormItem>
      <FormItem label="Status" prop="status">
        <Select v-model="form.status" :options="statusOptions.slice(1)" fluid />
      </FormItem>
    </Form>
    <template #footer>
      <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
      <Button severity="primary" :label="t(LocaleKeys.button.save)" @click="dialogOpen = false" />
    </template>
  </Dialog>
</template>
