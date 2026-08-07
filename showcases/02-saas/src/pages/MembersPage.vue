<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasMembers } from '@showcase/shared/mock-api/saas'
import type { SaasMember } from '@showcase/shared/mock-api/saas'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  email: '',
  role: 'member' as SaasMember['role'],
  tenant: '',
  status: 'active' as SaasMember['status']
})

const list = useMockList<SaasMember>({
  getData: () =>
    mockSaasMembers.map((m) => ({
      ...m,
      lastLogin: m.lastLogin ? new Date(m.lastLogin).toLocaleString() : '—'
    })),
  searchKeys: ['name', 'email', 'tenant'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Invited', value: 'invited' },
  { label: 'Disabled', value: 'disabled' }
]

const roleOptions = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' }
]

const columns = computed<Column<SaasMember>[]>(() => [
  { field: 'name', header: 'Member', sortable: true },
  { field: 'email', header: 'Email' },
  { field: 'role', header: 'Role' },
  { field: 'tenant', header: 'Tenant' },
  { field: 'lastLogin', header: 'Last login' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Members"
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
    empty-description="No members yet"
    search-placeholder="Search name, email, tenant…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Invite member" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Email" prop="email"><InputText v-model="form.email" fluid /></FormItem>
      <FormItem label="Role" prop="role"><Select v-model="form.role" :options="roleOptions" fluid /></FormItem>
      <FormItem label="Tenant" prop="tenant"><InputText v-model="form.tenant" fluid /></FormItem>
      <FormItem label="Status" prop="status">
        <Select v-model="form.status" :options="statusOptions.slice(1)" fluid />
      </FormItem>
    </Form>
    <template #footer>
      <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
      <Button severity="primary" label="Send invite" @click="dialogOpen = false" />
    </template>
  </Dialog>
</template>
