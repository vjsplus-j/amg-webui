<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  ConfirmDialog,
  DataTable,
  Dialog,
  Drawer,
  Empty,
  Form,
  FormItem,
  InputText,
  MessageBox,
  PageHeader,
  Pagination,
  Popover,
  Result,
  Select,
  Tooltip
} from 'amg-webui'
import type { Column } from 'amg-webui'
import type { SortOrder } from '@amg-webui/data/DataTable/types'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import {
  createAdminUser,
  deleteAdminUsers,
  queryAdminUsers,
  setForceEmptyList,
  setForceListError,
  setForceSubmitError,
  suggestUsernames,
  updateAdminUser,
  type AdminUser
} from '../mock/admin-users'
import {
  getOrganizationCascaderOptions,
  findOrganizationName
} from '../mock/admin-organizations'
import { listAdminRoles } from '../mock/admin-roles'
import { permissionsForRole } from '../mock/admin-permissions'
import { useAdminAuth } from '../composables/useAdminAuth'
import UserFormFields from '../components/UserFormFields.vue'
import {
  createEmptyUserModel,
  userToModel,
  useUserFormModel
} from '../composables/useUserFormModel'

type FetchPhase = 'idle' | 'loading' | 'ready' | 'error'

const router = useRouter()
const { t } = useLocale()
const { logout } = useAdminAuth()

const phase = ref<FetchPhase>('idle')
const errorMessage = ref('')
const rows = ref<AdminUser[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const search = ref('')
const statusFilter = ref('all')
const roleFilter = ref('all')
const orgFilter = ref<unknown>(null)
const orgOptions = ref<Awaited<ReturnType<typeof getOrganizationCascaderOptions>>>([])
const roleOptions = ref<{ label: string; value: string }[]>([])
const sortField = ref('updatedAt')
const sortOrder = ref<SortOrder>('desc')
const selection = ref<string[]>([])

const editDialogOpen = ref(false)
const deleteConfirmOpen = ref(false)
const createDrawerOpen = ref(false)
const editDrawerOpen = ref(false)
const feedbackDialogOpen = ref(false)
const feedbackDialogKind = ref<'success' | 'error'>('success')
const feedbackDialogMessage = ref('')
const editSaving = ref(false)
const createLoading = ref(false)
const editDrawerLoading = ref(false)
const createFormRef = ref<InstanceType<typeof UserFormFields> | null>(null)
const editDrawerFormRef = ref<InstanceType<typeof UserFormFields> | null>(null)
const createModel = useUserFormModel()
const editDrawerModel = useUserFormModel()
const editingDrawerUserId = ref<string | null>(null)
const editForm = reactive({
  id: '',
  displayName: '',
  email: '',
  status: 'active' as AdminUser['status']
})

const columns = computed<Column<AdminUser>[]>(() => [
  { field: 'username', header: 'Username', sortable: true },
  { field: 'displayName', header: 'Display name', sortable: true },
  { field: 'email', header: 'Email' },
  {
    field: 'orgId',
    header: 'Organization',
    render: (_v, row) => findOrganizationName(row.orgId)
  },
  { field: 'role', header: 'Role', sortable: true },
  { field: 'status', header: 'Status', sortable: true },
  {
    field: 'updatedAt',
    header: 'Updated',
    sortable: true,
    render: (value) => new Date(String(value)).toLocaleString()
  },
  { field: 'actions', header: 'Actions', width: '200px', align: 'right' }
])

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

const roleFilterOptions = computed(() => [
  { label: 'All roles', value: 'all' },
  ...roleOptions.value
])

async function loadFilters() {
  const [orgs, roles] = await Promise.all([
    getOrganizationCascaderOptions(),
    listAdminRoles()
  ])
  orgOptions.value = orgs
  roleOptions.value = roles.map((role) => ({ label: role.name, value: role.code }))
}

async function loadUsers() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    const orgId =
      Array.isArray(orgFilter.value) && orgFilter.value.length
        ? String(orgFilter.value[orgFilter.value.length - 1])
        : orgFilter.value
          ? String(orgFilter.value)
          : 'all'
    const result = await queryAdminUsers({
      search: search.value,
      status: statusFilter.value,
      role: roleFilter.value,
      orgId,
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
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load users'
  }
}

function resetFaults() {
  setForceListError(false)
  setForceEmptyList(false)
  void loadUsers()
}

function simulateEmpty() {
  setForceEmptyList(true)
  setForceListError(false)
  void loadUsers()
}

function simulateError() {
  setForceListError(true)
  setForceEmptyList(false)
  void loadUsers()
}

function showFeedback(kind: 'success' | 'error', message: string) {
  feedbackDialogKind.value = kind
  feedbackDialogMessage.value = message
  feedbackDialogOpen.value = true
}

function rolePermissionKeys(role: AdminUser['role']) {
  return permissionsForRole(role).map((item) => item.key)
}

function openCreateDrawer() {
  Object.assign(createModel, createEmptyUserModel())
  createDrawerOpen.value = true
}

function openEditDrawer(row: AdminUser) {
  editingDrawerUserId.value = row.id
  Object.assign(editDrawerModel, userToModel(row))
  editDrawerOpen.value = true
}

async function submitCreateDrawer() {
  createLoading.value = true
  setForceSubmitError(false)
  try {
    await createAdminUser({ ...createModel })
    createDrawerOpen.value = false
    showFeedback('success', 'User created successfully')
    await loadUsers()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user'
    createFormRef.value?.setFeedback('error', message)
    showFeedback('error', message)
  } finally {
    createLoading.value = false
  }
}

async function submitEditDrawer() {
  if (!editingDrawerUserId.value) return
  editDrawerLoading.value = true
  setForceSubmitError(false)
  try {
    await updateAdminUser(editingDrawerUserId.value, { ...editDrawerModel })
    editDrawerOpen.value = false
    showFeedback('success', 'User updated successfully')
    await loadUsers()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user'
    editDrawerFormRef.value?.setFeedback('error', message)
    showFeedback('error', message)
  } finally {
    editDrawerLoading.value = false
  }
}

async function resetPassword(row: AdminUser) {
  const result = await MessageBox.confirm(
    `Send a password reset link to ${row.email}?`,
    'Reset password',
    { severity: 'warning' }
  )
  if (result === 'confirm') {
    showFeedback('success', `Reset link queued for ${row.username}`)
  }
}

function openEdit(row: AdminUser) {
  editForm.id = row.id
  editForm.displayName = row.displayName
  editForm.email = row.email
  editForm.status = row.status
  editDialogOpen.value = true
}

async function saveEdit() {
  editSaving.value = true
  try {
    await updateAdminUser(editForm.id, {
      displayName: editForm.displayName,
      email: editForm.email,
      status: editForm.status
    })
    editDialogOpen.value = false
    showFeedback('success', 'Quick edit saved')
    await loadUsers()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Update failed'
    errorMessage.value = message
    showFeedback('error', message)
  } finally {
    editSaving.value = false
  }
}

async function confirmDelete() {
  if (!selection.value.length) return
  try {
    await deleteAdminUsers(selection.value)
    selection.value = []
    deleteConfirmOpen.value = false
    showFeedback('success', 'Selected users deleted')
    await loadUsers()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Delete failed'
    errorMessage.value = message
    showFeedback('error', message)
  }
}

function signOut() {
  logout()
  router.push('/login')
}

watch([page, pageSize, statusFilter, roleFilter, orgFilter], () => {
  void loadUsers()
})

watch([sortField, sortOrder], () => {
  void loadUsers()
})

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    void loadUsers()
  }, 300)
})

onMounted(async () => {
  await loadFilters()
  await loadUsers()
})
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Users">
      <template #extra>
        <div class="showcase-toolbar">
          <Tooltip content="Create user in form drawer">
            <Button severity="primary" label="Create user" @click="openCreateDrawer" />
          </Tooltip>
          <Button
            variant="outlined"
            label="Full create page"
            @click="router.push('/users/create')"
          />
          <Button
            variant="outlined"
            label="Delete selected"
            :disabled="!selection.length"
            @click="deleteConfirmOpen = true"
          />
          <Button variant="outlined" label="Simulate empty" @click="simulateEmpty" />
          <Button variant="outlined" label="Simulate error" @click="simulateError" />
          <Button variant="outlined" :label="t(LocaleKeys.button.refresh)" @click="resetFaults" />
          <Button variant="outlined" label="Sign out" @click="signOut" />
        </div>
      </template>
    </PageHeader>

    <Card>
      <div class="showcase-filters">
        <AutoComplete
          v-model="search"
          fluid
          placeholder="Search username…"
          @fetch-suggestions="
            (query, cb) => suggestUsernames(query).then((items) => cb(items))
          "
        />
        <Select
          v-model="statusFilter"
          :options="statusOptions"
          fluid
        />
        <Select
          v-model="roleFilter"
          :options="roleFilterOptions"
          fluid
        />
        <Cascader
          v-model="orgFilter"
          :options="orgOptions"
          placeholder="Filter by org"
        />
      </div>

      <Result
        v-if="phase === 'error'"
        status="error"
        title="Failed to load users"
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
            <Empty description="No users found">
              <Button
                severity="primary"
                label="Create user"
                @click="router.push('/users/create')"
              />
            </Empty>
          </template>
          <template #body-role="{ row }">
            <Popover :title="`${(row as AdminUser).role} permissions`" placement="bottom">
              <template #trigger>
                <Button
                  size="sm"
                  variant="outlined"
                  :label="String((row as AdminUser).role)"
                />
              </template>
              <ul class="users-page__perm-list">
                <li
                  v-for="key in rolePermissionKeys((row as AdminUser).role)"
                  :key="key"
                >
                  {{ key }}
                </li>
              </ul>
            </Popover>
          </template>
          <template #body-actions="{ row }">
            <div class="showcase-row-actions">
              <Tooltip content="Full edit in drawer">
                <Button
                  size="sm"
                  variant="outlined"
                  label="Edit"
                  @click="openEditDrawer(row as AdminUser)"
                />
              </Tooltip>
              <Tooltip content="Quick edit dialog">
                <Button
                  size="sm"
                  variant="outlined"
                  label="Quick"
                  @click="openEdit(row as AdminUser)"
                />
              </Tooltip>
              <Tooltip content="Reset password via MessageBox">
                <Button
                  size="sm"
                  variant="outlined"
                  label="Reset"
                  @click="resetPassword(row as AdminUser)"
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

    <Dialog v-model:visible="editDialogOpen" title="Quick edit user" size="md">
      <Form :model="editForm" label-position="top">
        <FormItem label="Display name" prop="displayName">
          <InputText v-model="editForm.displayName" fluid />
        </FormItem>
        <FormItem label="Email" prop="email">
          <InputText v-model="editForm.email" fluid type="email" />
        </FormItem>
        <FormItem label="Status" prop="status">
          <Select
            v-model="editForm.status"
            :options="[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]"
            fluid
          />
        </FormItem>
      </Form>
      <template #footer>
        <Button variant="outlined" label="Cancel" @click="editDialogOpen = false" />
        <Button severity="primary" label="Save" :loading="editSaving" @click="saveEdit" />
      </template>
    </Dialog>

    <Drawer
      v-model:visible="createDrawerOpen"
      title="Create user"
      placement="right"
      size="md"
    >
      <UserFormFields
        ref="createFormRef"
        :model="createModel"
        mode="create"
        :loading="createLoading"
        @submit="submitCreateDrawer"
      />
      <template #footer>
        <Button variant="outlined" label="Cancel" @click="createDrawerOpen = false" />
        <Button
          severity="primary"
          label="Create user"
          :loading="createLoading"
          @click="submitCreateDrawer"
        />
      </template>
    </Drawer>

    <Drawer
      v-model:visible="editDrawerOpen"
      title="Edit user"
      placement="right"
      size="md"
    >
      <UserFormFields
        ref="editDrawerFormRef"
        :model="editDrawerModel"
        mode="edit"
        username-readonly
        :loading="editDrawerLoading"
        submit-label="Save changes"
        @submit="submitEditDrawer"
      />
      <template #footer>
        <Button variant="outlined" label="Cancel" @click="editDrawerOpen = false" />
        <Button
          severity="primary"
          label="Save changes"
          :loading="editDrawerLoading"
          @click="submitEditDrawer"
        />
      </template>
    </Drawer>

    <ConfirmDialog
      v-model:visible="deleteConfirmOpen"
      icon="danger"
      title="Delete users"
      :message="`Delete ${selection.length} selected user(s)? This cannot be undone.`"
      confirm-label="Delete"
      @confirm="confirmDelete"
    />

    <Dialog
      v-model:visible="feedbackDialogOpen"
      :title="feedbackDialogKind === 'success' ? 'Success' : 'Error'"
      size="sm"
    >
      <p>{{ feedbackDialogMessage }}</p>
      <template #footer>
        <Button severity="primary" label="OK" @click="feedbackDialogOpen = false" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.showcase-filters {
  display: grid;
  grid-template-columns: 1.4fr repeat(3, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.showcase-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.showcase-row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.users-page__perm-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.875rem;
}

@media (max-width: 900px) {
  .showcase-filters {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
