<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsCategories } from '@showcase/shared/mock-api/cms'
import type { CmsCategory } from '@showcase/shared/mock-api/cms'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({ name: '', slug: '', status: 'active' as CmsCategory['status'] })

const list = useMockList<CmsCategory>({
  getData: () => mockCmsCategories,
  searchKeys: ['name', 'slug'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Hidden', value: 'hidden' }
]

const columns = computed<Column<CmsCategory>[]>(() => [
  { field: 'name', header: 'Category', sortable: true },
  { field: 'slug', header: 'Slug' },
  { field: 'articles', header: 'Articles' },
  { field: 'status', header: 'Status', sortable: true }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Categories"
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
    empty-description="No categories"
    search-placeholder="Search name, slug…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Add category" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Slug" prop="slug"><InputText v-model="form.slug" fluid /></FormItem>
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
