<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockSaasPlans } from '@showcase/shared/mock-api/saas'
import type { SaasPlan } from '@showcase/shared/mock-api/saas'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  price: '',
  interval: 'monthly' as SaasPlan['interval'],
  seats: '',
  features: '',
  status: 'draft' as SaasPlan['status']
})

const list = useMockList<SaasPlan>({
  getData: () => mockSaasPlans,
  searchKeys: ['name', 'features'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

const columns = computed<Column<SaasPlan>[]>(() => [
  { field: 'name', header: 'Plan', sortable: true },
  { field: 'price', header: 'Price', render: (v) => `$${Number(v)}` },
  { field: 'interval', header: 'Interval' },
  { field: 'seats', header: 'Seats' },
  { field: 'features', header: 'Features' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Plans"
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
    empty-description="No plans defined"
    search-placeholder="Search plan, features…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Create plan" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Price (USD)" prop="price"><InputText v-model="form.price" fluid /></FormItem>
      <FormItem label="Interval" prop="interval">
        <Select
          v-model="form.interval"
          :options="[
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' }
          ]"
          fluid
        />
      </FormItem>
      <FormItem label="Seat limit" prop="seats"><InputText v-model="form.seats" fluid /></FormItem>
      <FormItem label="Features" prop="features"><InputText v-model="form.features" fluid /></FormItem>
    </Form>
    <template #footer>
      <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
      <Button severity="primary" :label="t(LocaleKeys.button.save)" @click="dialogOpen = false" />
    </template>
  </Dialog>
</template>
