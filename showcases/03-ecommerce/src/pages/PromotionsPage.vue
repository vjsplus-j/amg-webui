<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomPromotions } from '@showcase/shared/mock-api/ecommerce'
import type { EcomPromotion } from '@showcase/shared/mock-api/ecommerce'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  code: '',
  discount: '',
  startsAt: '',
  endsAt: '',
  status: 'scheduled' as EcomPromotion['status']
})

const list = useMockList<EcomPromotion>({
  getData: () => mockEcomPromotions,
  searchKeys: ['name', 'code'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Active', value: 'active' },
  { label: 'Ended', value: 'ended' }
]

const columns = computed<Column<EcomPromotion>[]>(() => [
  { field: 'name', header: 'Promotion', sortable: true },
  { field: 'code', header: 'Code' },
  { field: 'discount', header: 'Discount' },
  { field: 'startsAt', header: 'Starts' },
  { field: 'endsAt', header: 'Ends' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Promotions"
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
    empty-description="No promotions"
    search-placeholder="Search name, code…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Create promotion" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Code" prop="code"><InputText v-model="form.code" fluid /></FormItem>
      <FormItem label="Discount" prop="discount"><InputText v-model="form.discount" fluid /></FormItem>
      <FormItem label="Starts" prop="startsAt"><InputText v-model="form.startsAt" fluid type="date" /></FormItem>
      <FormItem label="Ends" prop="endsAt"><InputText v-model="form.endsAt" fluid type="date" /></FormItem>
    </Form>
    <template #footer>
      <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
      <Button severity="primary" :label="t(LocaleKeys.button.save)" @click="dialogOpen = false" />
    </template>
  </Dialog>
</template>
