<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Button, Dialog, Form, FormItem, InputText } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import DataPageShell from '@showcase/shared/components/DataPageShell.vue'
import { useMockList } from '@showcase/shared/composables/useMockList'
import { mockCmsTags } from '@showcase/shared/mock-api/cms'
import type { CmsTag } from '@showcase/shared/mock-api/cms'

const { t } = useLocale()
const dialogOpen = ref(false)
const form = reactive({ name: '', slug: '' })

const list = useMockList<CmsTag>({
  getData: () => mockCmsTags,
  searchKeys: ['name', 'slug']
})

const columns = computed<Column<CmsTag>[]>(() => [
  { field: 'name', header: 'Tag', sortable: true },
  { field: 'slug', header: 'Slug' },
  { field: 'usage', header: 'Usage count' }
])

onMounted(list.load)
</script>

<template>
  <DataPageShell
    title="Tags"
    :phase="list.phase.value"
    :error-message="list.errorMessage.value"
    :columns="columns"
    :rows="list.pagedRows.value"
    :total="list.total.value"
    :page="list.page.value"
    :page-size="list.pageSize.value"
    :search="list.search.value"
    :status-filter="'all'"
    :status-options="[{ label: 'All tags', value: 'all' }]"
    empty-description="No tags"
    search-placeholder="Search tag, slug…"
    @update:search="list.search.value = $event"
    @update:page="list.page.value = $event"
    @update:page-size="list.pageSize.value = $event"
    @refresh="list.resetFaults"
    @create="dialogOpen = true"
    @simulate-empty="list.simulateEmpty"
    @simulate-error="list.simulateError"
  />

  <Dialog v-model:visible="dialogOpen" title="Add tag" size="sm">
    <Form :model="form" label-position="top">
      <FormItem label="Name" prop="name"><InputText v-model="form.name" fluid /></FormItem>
      <FormItem label="Slug" prop="slug"><InputText v-model="form.slug" fluid /></FormItem>
    </Form>
    <template #footer>
      <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
      <Button severity="primary" :label="t(LocaleKeys.button.save)" @click="dialogOpen = false" />
    </template>
  </Dialog>
</template>
