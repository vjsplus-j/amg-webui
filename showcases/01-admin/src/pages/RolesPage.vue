<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  AutoComplete,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  Dialog,
  Empty,
  Form,
  FormItem,
  InputText,
  MessageBox,
  PageHeader,
  Pagination,
  Result,
  Select,
  Textarea,
  Tooltip
} from 'amg-webui'
import type { Column } from 'amg-webui'
import type { SortOrder } from '@amg-webui/data/DataTable/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  createAdminRole,
  deleteAdminRoles,
  permissionOptions,
  queryAdminRoles,
  setForceRoleEmptyList,
  setForceRoleListError,
  suggestRoleCodes,
  updateAdminRole,
  type AdminRole
} from '../mock/admin-roles'

type FetchPhase = 'idle' | 'loading' | 'ready' | 'error'

const { t } = useLocale()

const phase = ref<FetchPhase>('idle')
const errorMessage = ref('')
const rows = ref<AdminRole[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(8)
const search = ref('')
const statusFilter = ref('all')
const sortField = ref('name')
const sortOrder = ref<SortOrder>('asc')
const selection = ref<string[]>([])

const dialogOpen = ref(false)
const deleteConfirmOpen = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)

const form = reactive({
  code: '',
  name: '',
  description: '',
  status: 'active' as AdminRole['status'],
  permissionIds: [] as string[]
})

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const formStatusOptions = statusOptions.slice(1)

const columns = computed<Column<AdminRole>[]>(() => [
  { field: 'code', header: 'Code', sortable: true },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'description', header: 'Description' },
  {
    field: 'permissionIds',
    header: 'Permissions',
    render: (_, row) => `${row.permissionIds.length} granted`
  },
  { field: 'userCount', header: 'Users', sortable: true, width: '90px' },
  { field: 'status', header: 'Status', sortable: true, width: '100px' },
  {
    field: 'updatedAt',
    header: 'Updated',
    sortable: true,
    render: (value) => new Date(String(value)).toLocaleString()
  },
  { field: 'actions', header: 'Actions', width: '180px', align: 'right' }
])

async function loadRoles() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const result = await queryAdminRoles({
      search: search.value,
      status: statusFilter.value,
      page: page.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value
    })
    rows.value = result.items
    total.value = result.total
    phase.value = 'ready'
  } catch (error) {
    phase.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load roles'
  }
}

function resetFaults() {
  setForceRoleListError(false)
  setForceRoleEmptyList(false)
  void loadRoles()
}

function simulateEmpty() {
  setForceRoleEmptyList(true)
  setForceRoleListError(false)
  void loadRoles()
}

function simulateError() {
  setForceRoleListError(true)
  setForceRoleEmptyList(false)
  void loadRoles()
}

function resetForm() {
  form.code = ''
  form.name = ''
  form.description = ''
  form.status = 'active'
  form.permissionIds = []
}

function openCreate() {
  editingId.value = null
  resetForm()
  dialogOpen.value = true
}

function openEdit(role: AdminRole) {
  editingId.value = role.id
  form.code = role.code
  form.name = role.name
  form.description = role.description
  form.status = role.status
  form.permissionIds = [...role.permissionIds]
  dialogOpen.value = true
}

async function saveRole() {
  if (!form.code.trim() || !form.name.trim()) {
    errorMessage.value = 'Code and name are required'
    return
  }
  saving.value = true
  try {
    if (editingId.value) {
      await updateAdminRole(editingId.value, { ...form })
      await MessageBox.alert('Role updated successfully', 'Success', { severity: 'success' })
    } else {
      await createAdminRole({ ...form })
      await MessageBox.alert('Role created successfully', 'Success', { severity: 'success' })
    }
    dialogOpen.value = false
    await loadRoles()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save role'
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!selection.value.length) return
  try {
    await deleteAdminRoles(selection.value)
    selection.value = []
    deleteConfirmOpen.value = false
    await loadRoles()
    await MessageBox.alert('Role(s) deleted', 'Deleted', { severity: 'success' })
  } catch (error) {
    deleteConfirmOpen.value = false
    errorMessage.value = error instanceof Error ? error.message : 'Failed to delete role'
  }
}

watch([page, pageSize, statusFilter], () => {
  void loadRoles()
})

watch([sortField, sortOrder], () => {
  void loadRoles()
})

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    void loadRoles()
  }, 300)
})

onMounted(loadRoles)
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Roles">
      <template #extra>
        <div class="showcase-toolbar">
          <Tooltip content="Create a new role">
            <Button severity="primary" label="Create role" @click="openCreate" />
          </Tooltip>
          <Button
            variant="outlined"
            severity="danger"
            label="Delete selected"
            :disabled="!selection.length"
            @click="deleteConfirmOpen = true"
          />
          <Button variant="outlined" label="Simulate empty" @click="simulateEmpty" />
          <Button variant="outlined" label="Simulate error" @click="simulateError" />
          <Button
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            @click="resetFaults"
          />
        </div>
      </template>
    </PageHeader>

    <Card>
      <div class="roles-filters">
        <AutoComplete
          v-model="search"
          fluid
          placeholder="Search code or name…"
          @fetch-suggestions="
            (query, cb) => suggestRoleCodes(query).then((items) => cb(items))
          "
        />
        <Select v-model="statusFilter" :options="statusOptions" fluid />
      </div>

      <Result
        v-if="phase === 'error'"
        status="error"
        title="Failed to load roles"
        :sub-title="errorMessage"
      >
        <template #extra>
          <Button severity="primary" label="Retry" @click="resetFaults" />
        </template>
      </Result>

      <template v-else>
        <DataTable
          v-model:selection="selection"
          v-model:sort-field="sortField"
          v-model:sort-order="sortOrder"
          :value="rows"
          :columns="columns"
          :loading="phase === 'loading'"
          row-key="id"
          selection-mode="multiple"
          :virtual="false"
          striped
        >
          <template #empty>
            <Empty description="No roles defined">
              <Button severity="primary" label="Create role" @click="openCreate" />
            </Empty>
          </template>
          <template #body-actions="{ row }">
            <div class="showcase-toolbar">
              <Tooltip content="Edit role in dialog">
                <Button
                  size="sm"
                  variant="outlined"
                  label="Edit"
                  @click="openEdit(row as AdminRole)"
                />
              </Tooltip>
            </div>
          </template>
        </DataTable>

        <div v-if="phase === 'ready' && total > 0" class="showcase-pagination">
          <Pagination
            :total="total"
            :page="page"
            :page-size="pageSize"
            @update:page="page = $event"
            @update:page-size="pageSize = $event"
          />
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="dialogOpen"
      :title="editingId ? 'Edit role' : 'Create role'"
      size="md"
    >
      <Form :model="form" label-position="top">
        <FormItem label="Code" prop="code" required>
          <AutoComplete
            v-model="form.code"
            fluid
            placeholder="e.g. editor"
            :disabled="Boolean(editingId)"
            @fetch-suggestions="
              (query, cb) => suggestRoleCodes(query).then((items) => cb(items))
            "
          />
        </FormItem>
        <FormItem label="Name" prop="name" required>
          <InputText v-model="form.name" fluid placeholder="Display name" />
        </FormItem>
        <FormItem label="Description" prop="description">
          <Textarea v-model="form.description" fluid :rows="3" />
        </FormItem>
        <FormItem label="Status" prop="status">
          <Select v-model="form.status" :options="formStatusOptions" fluid />
        </FormItem>
        <FormItem label="Permissions" prop="permissionIds">
          <Select
            v-model="form.permissionIds"
            :options="permissionOptions"
            fluid
            multiple
            placeholder="Assign permissions"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="dialogOpen = false" />
        <Button
          severity="primary"
          :label="t(LocaleKeys.button.save)"
          :loading="saving"
          @click="saveRole"
        />
      </template>
    </Dialog>

    <ConfirmDialog
      v-model:visible="deleteConfirmOpen"
      icon="danger"
      title="Delete roles"
      :message="`Delete ${selection.length} selected role(s)? Users assigned may lose access.`"
      confirm-label="Delete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.roles-filters {
  display: grid;
  grid-template-columns: 1fr minmax(140px, 200px);
  gap: 12px;
  margin-bottom: 16px;
}

.showcase-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .roles-filters {
    grid-template-columns: 1fr;
  }
}
</style>
