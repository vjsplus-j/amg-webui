<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Button,
  Card,
  DataTable,
  Dialog,
  Empty,
  Form,
  FormItem,
  InputText,
  PageHeader,
  Result,
  Select
} from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  MockCrudAdapter,
  createSeed
} from '@showcase/shared/mock-api/adapter'
import type { FetchPhase, MockRecord } from '@showcase/shared/mock-api/types'

const props = defineProps<{
  title: string
  entityLabel: string
  seedPrefix: string
}>()

const { t } = useLocale()

const phase = ref<FetchPhase>('idle')
const rows = ref<MockRecord[]>([])
const errorMessage = ref('')
const dialogOpen = ref(false)
const editingId = ref<string | null>(null)
const forceEmpty = ref(false)
const forceError = ref(false)

const adapter = new MockCrudAdapter({
  seed: createSeed(props.seedPrefix)
})

const form = reactive({
  name: '',
  status: 'active' as MockRecord['status']
})

const statusOptions = computed(() => [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
])

const columns = computed<Column<MockRecord>[]>(() => [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  {
    field: 'updatedAt',
    header: 'Updated',
    render: (value) => new Date(String(value)).toLocaleString()
  },
  { field: 'actions', header: 'Actions', width: '200px', align: 'right' }
])

async function loadRows() {
  phase.value = 'loading'
  errorMessage.value = ''
  adapter.setForceEmpty(forceEmpty.value)
  adapter.setForceError(forceError.value)
  try {
    const data = await adapter.list()
    rows.value = data
    phase.value = data.length ? 'ready' : 'empty'
  } catch (error) {
    rows.value = []
    errorMessage.value =
      error instanceof Error ? error.message : 'Unknown mock error'
    phase.value = 'error'
  }
}

function openCreate() {
  editingId.value = null
  form.name = ''
  form.status = 'active'
  dialogOpen.value = true
}

function openEdit(row: MockRecord) {
  editingId.value = row.id
  form.name = row.name
  form.status = row.status
  dialogOpen.value = true
}

async function saveForm() {
  if (!form.name.trim()) return
  if (editingId.value) {
    await adapter.update(editingId.value, {
      name: form.name,
      status: form.status
    })
  } else {
    await adapter.create({ name: form.name, status: form.status })
  }
  dialogOpen.value = false
  await loadRows()
}

async function removeRow(row: MockRecord) {
  await adapter.remove(row.id)
  await loadRows()
}

onMounted(loadRows)
</script>

<template>
  <div class="showcase-page">
    <PageHeader :title="title">
      <template #extra>
        <div class="showcase-toolbar">
          <Button severity="primary" label="Add" @click="openCreate" />
          <Button
            variant="outlined"
            label="Simulate empty"
            @click="
              () => {
                forceEmpty = true
                forceError = false
                loadRows()
              }
            "
          />
          <Button
            variant="outlined"
            label="Simulate error"
            @click="
              () => {
                forceError = true
                forceEmpty = false
                loadRows()
              }
            "
          />
          <Button
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            @click="
              () => {
                forceEmpty = false
                forceError = false
                loadRows()
              }
            "
          />
        </div>
      </template>
    </PageHeader>

    <Card>
      <Result
        v-if="phase === 'error'"
        status="error"
        title="Failed to load"
        :sub-title="errorMessage"
      >
        <template #extra>
          <Button severity="primary" label="Retry" @click="loadRows" />
        </template>
      </Result>

      <DataTable
        v-else
        :value="rows"
        :columns="columns"
        :loading="phase === 'loading'"
        :virtual="false"
        row-key="id"
      >
        <template #empty>
          <Empty
            :description="`No ${entityLabel.toLowerCase()} records yet`"
          >
            <Button severity="primary" label="Add" @click="openCreate" />
          </Empty>
        </template>

        <template #body-actions="{ row }">
          <div class="showcase-toolbar">
            <Button
              size="sm"
              variant="outlined"
              label="Edit"
              @click="openEdit(row as MockRecord)"
            />
            <Button
              size="sm"
              severity="danger"
              variant="outlined"
              :label="t(LocaleKeys.button.delete)"
              @click="removeRow(row as MockRecord)"
            />
          </div>
        </template>
      </DataTable>
    </Card>

    <Dialog
      v-model:visible="dialogOpen"
      :title="editingId ? `Edit ${entityLabel}` : `Create ${entityLabel}`"
      size="md"
    >
      <Form :model="form" label-position="top">
        <FormItem label="Name" prop="name">
          <InputText v-model="form.name" fluid placeholder="Name" />
        </FormItem>
        <FormItem label="Status" prop="status">
          <Select v-model="form.status" :options="statusOptions" fluid />
        </FormItem>
      </Form>
      <template #footer>
        <Button
          variant="outlined"
          :label="t(LocaleKeys.button.cancel)"
          @click="dialogOpen = false"
        />
        <Button
          severity="primary"
          :label="t(LocaleKeys.button.save)"
          @click="saveForm"
        />
      </template>
    </Dialog>
  </div>
</template>
