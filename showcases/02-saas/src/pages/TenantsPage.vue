<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasTenants } from '@showcase/shared/mock-api/saas'
import type { SaasTenant } from '@showcase/shared/mock-api/saas'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  slug: '',
  plan: 'Pro',
  status: 'active' as SaasTenant['status']
})

const list = useMockList<SaasTenant>({
  getData: () => mockSaasTenants,
  searchKeys: ['name', 'slug', 'plan'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Trial', value: 'trial' },
  { label: 'Suspended', value: 'suspended' }
]

const planOptions = [
  { label: 'Starter', value: 'Starter' },
  { label: 'Pro', value: 'Pro' },
  { label: 'Business', value: 'Business' },
  { label: 'Enterprise', value: 'Enterprise' }
]

const columns = computed<Column<SaasTenant>[]>(() => [
  { field: 'name', header: 'Tenant', sortable: true },
  { field: 'slug', header: 'Slug' },
  { field: 'plan', header: 'Plan' },
  { field: 'members', header: 'Members' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'createdAt', header: 'Created' }
])

function openCreate() {
  form.name = ''
  form.slug = ''
  form.plan = 'Pro'
  form.status = 'active'
  dialogOpen.value = true
}

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Tenants"
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
    empty-description="No tenants yet"
    search-placeholder="Search tenant, slug, plan…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="openCreate"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Create tenant" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name">
        <InputText v-model="form.name" fluid />
      </FormItem>
      <FormItem label="Slug" prop="slug">
        <InputText v-model="form.slug" fluid placeholder="acme" />
      </FormItem>
      <FormItem label="Plan" prop="plan">
        <Select v-model="form.plan" :options="planOptions" fluid />
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
