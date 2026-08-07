<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText, Select } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsArticles } from '@showcase/shared/mock-api/cms'
import type { CmsArticle } from '@showcase/shared/mock-api/cms'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({
  title: '',
  author: '',
  category: '',
  tags: '',
  status: 'draft' as CmsArticle['status']
})

const list = useMockList<CmsArticle>({
  getData: () => mockCmsArticles,
  searchKeys: ['title', 'author', 'category', 'tags'],
  filterKey: 'status'
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
  { label: 'In review', value: 'review' }
]

const columns = computed<Column<CmsArticle>[]>(() => [
  { field: 'title', header: 'Title', sortable: true },
  { field: 'author', header: 'Author' },
  { field: 'category', header: 'Category' },
  { field: 'tags', header: 'Tags' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'updatedAt', header: 'Updated' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Articles"
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
    empty-description="No articles yet"
    search-placeholder="Search title, author, tags…"
    @update:search="list.search.value = $event"
    @update:status-filter="list.statusFilter.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="New article" size="md">
    <Form :model="form" label-position="top">
      <FormItem label="Title" prop="title"><InputText v-model="form.title" fluid /></FormItem>
      <FormItem label="Author" prop="author"><InputText v-model="form.author" fluid /></FormItem>
      <FormItem label="Category" prop="category"><InputText v-model="form.category" fluid /></FormItem>
      <FormItem label="Tags" prop="tags"><InputText v-model="form.tags" fluid placeholder="comma-separated" /></FormItem>
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
