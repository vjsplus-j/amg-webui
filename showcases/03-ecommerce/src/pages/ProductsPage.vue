<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockEcomProducts } from '@showcase/shared/mock-api/ecommerce'
import type { EcomProduct } from '@showcase/shared/mock-api/ecommerce'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  name: '',
  category: '',
  price: '',
  stock: '',
  status: 'draft' as EcomProduct['status']
})

const list = useMockList<EcomProduct>({
  getData: () => mockEcomProducts,
  searchKeys: ['name', 'category'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'On sale', value: 'on_sale' },
  { label: 'Draft', value: 'draft' },
  { label: 'Archived', value: 'archived' }
]

const columns = computed<Column<EcomProduct>[]>(() => [
  { field: 'name', header: 'Product', sortable: true },
  { field: 'category', header: 'Category' },
  { field: 'price', header: 'Price', render: (v) => `¥${Number(v)}` },
  { field: 'stock', header: 'Stock' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'updatedAt', header: 'Updated' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Products"
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
    empty-description="No products yet"
    search-placeholder="Search product, category…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Create product" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Category" prop="category"><InputText v-model="form.category" fluid /></FormItem>
      <FormItem label="Price" prop="price"><InputText v-model="form.price" fluid /></FormItem>
      <FormItem label="Stock" prop="stock"><InputText v-model="form.stock" fluid /></FormItem>
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
