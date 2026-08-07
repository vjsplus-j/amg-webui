<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockIotGroups } from '@showcase/shared/mock-api/device-mgmt'
import type { IotGroup } from '@showcase/shared/mock-api/device-mgmt'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({ name: '', region: '', status: 'active' as IotGroup['status'] })

const list = useMockList<IotGroup>({
  getData: () => mockIotGroups,
  searchKeys: ['name', 'region'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' }
]

const columns = computed<Column<IotGroup>[]>(() => [
  { field: 'name', header: 'Group', sortable: true },
  { field: 'devices', header: 'Devices' },
  { field: 'region', header: 'Region' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Groups"
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
    empty-description="No groups"
    search-placeholder="Search group, region…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Create group" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Region" prop="region"><InputText v-model="form.region" fluid /></FormItem>
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
