<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import { Button, Card, Icon, Avatar, Empty, Tag } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Dialog, Message } from '@amg-webui/overlay'
import { DataTable, Pagination } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizUsersProps, BizUsersEmits, BizUser, BizUserCreate } from './types'
import { useUsersTable } from './composables/useUsersTable'
import { DEFAULT_BIZ_ACCESS, useBizAsync } from '../_shared'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizUsersProps>(), {
  users: () => [],
  loading: false,
  error: null,
  title: undefined,
  roles: undefined,
  permissionOptions: undefined,
  access: undefined,
  page: 1,
  pageSize: 10,
  total: undefined
})

const emit = defineEmits<BizUsersEmits>()
const attrs = useAttrs()
const { t, locale } = useLocale()

const access = computed(() => ({ ...DEFAULT_BIZ_ACCESS, ...props.access }))

const usingAdapter = computed(() => Boolean(props.adapter))
const fallbackAdapter = {
  async list() {
    return { list: props.users ?? [], total: (props.users ?? []).length }
  }
}
const asyncApi = useBizAsync<BizUser, BizUserCreate, BizUser>({
  adapter: () => props.adapter ?? fallbackAdapter,
  initialQuery: { page: props.page, pageSize: props.pageSize },
  immediate: Boolean(props.adapter),
  keywordDebounceMs: 300,
  cache: { max: 32, ttlMs: 30_000 },
  getItemId: (item) => item.id
})

const { keyword, role, filtered } = useUsersTable(() =>
  usingAdapter.value ? asyncApi.list.value : (props.users ?? [])
)

/** Host-owned paging: parent already sliced `users` and set `total`. */
const hostOwnsPaging = computed(() => !usingAdapter.value && props.total != null)

const localPage = ref(props.page ?? 1)
const localPageSize = ref(props.pageSize ?? 10)
watch(
  () => props.page,
  (v) => {
    if (v != null) localPage.value = v
  }
)
watch(
  () => props.pageSize,
  (v) => {
    if (v != null) localPageSize.value = v
  }
)

const tableRows = computed(() => {
  if (usingAdapter.value) return asyncApi.list.value
  if (hostOwnsPaging.value) return filtered.value
  const start = (localPage.value - 1) * localPageSize.value
  return filtered.value.slice(start, start + localPageSize.value)
})
const tableLoading = computed(() => (usingAdapter.value ? asyncApi.loading.value : props.loading))
const tableError = computed(() => (usingAdapter.value ? asyncApi.error.value : props.error))
const mutationError = computed(() =>
  usingAdapter.value ? asyncApi.mutation.value.error : null
)
const tableTotal = computed(() =>
  usingAdapter.value ? asyncApi.total.value : (props.total ?? filtered.value.length)
)
const currentPage = computed({
  get: () => (usingAdapter.value ? asyncApi.page.value : localPage.value),
  set: (v: number) => {
    localPage.value = v
    if (usingAdapter.value) asyncApi.setPage(v)
    else {
      emit('update:page', v)
      emit('page-change', {
        page: v,
        pageSize: localPageSize.value,
        keyword: keyword.value,
        filters: { role: role.value }
      })
    }
  }
})
const currentPageSize = computed({
  get: () => (usingAdapter.value ? asyncApi.pageSize.value : localPageSize.value),
  set: (v: number) => {
    localPageSize.value = v
    localPage.value = 1
    if (usingAdapter.value) asyncApi.setPageSize(v)
    else {
      emit('update:pageSize', v)
      emit('page-change', {
        page: 1,
        pageSize: v,
        keyword: keyword.value,
        filters: { role: role.value }
      })
    }
  }
})

watch(keyword, (v) => {
  if (usingAdapter.value) asyncApi.setKeyword(v)
})
watch(role, (v) => {
  if (usingAdapter.value) asyncApi.setFilter('role', v)
})

const showEdit = ref(false)
const showDetail = ref(false)
const editing = ref<BizUser | null>(null)
const viewing = ref<BizUser | null>(null)
const formError = ref('')
const form = ref({
  name: '',
  email: '',
  phone: '',
  role: '',
  status: 'active' as string,
  avatar: '',
  permissions: [] as string[]
})

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.usersTitle))

const roleOptions = computed(() => {
  void locale.value
  if (props.roles) return props.roles
  return [
    { value: '', label: t('biz.allRoles') },
    { value: 'admin', label: t('biz.roleAdmin') },
    { value: 'ops', label: t('biz.roleOps') },
    { value: 'dev', label: t('biz.roleDev') }
  ]
})

const permissionOptions = computed(() => {
  void locale.value
  if (props.permissionOptions?.length) return props.permissionOptions
  return [
    { value: 'users:read', label: t('biz.users.permRead') },
    { value: 'users:write', label: t('biz.users.permWrite') },
    { value: 'orders:read', label: t('biz.users.permOrders') },
    { value: 'settings:write', label: t('biz.users.permSettings') }
  ]
})

function roleLabel(code: string) {
  const map: Record<string, string> = {
    admin: t('biz.roleAdmin'),
    ops: t('biz.roleOps'),
    dev: t('biz.roleDev')
  }
  return map[code] ?? code
}

const columns = computed(() => {
  void locale.value
  return [
    { field: 'avatar', header: t('biz.users.avatar'), width: '64px' },
    { field: 'name', header: t('biz.colName'), sortable: true },
    { field: 'email', header: t(LocaleKeys.auth.email), sortable: true },
    { field: 'phone', header: t(LocaleKeys.auth.phone) },
    { field: 'role', header: t('biz.role') },
    { field: 'permissions', header: t('biz.users.permissions') },
    { field: 'status', header: t('biz.status') },
    { field: 'actions', header: t(LocaleKeys.common.actions), width: '200px' }
  ]
})

const formRoles = computed(() => roleOptions.value.filter((r) => r.value))

function openCreate() {
  if (!access.value.create) return
  editing.value = null
  formError.value = ''
  form.value = {
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    avatar: '',
    permissions: []
  }
  showEdit.value = true
}

function openEdit(user: BizUser) {
  if (!access.value.update) return
  editing.value = user
  formError.value = ''
  form.value = {
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    role: user.role,
    status: user.status,
    avatar: user.avatar ?? '',
    permissions: [...(user.permissions ?? [])]
  }
  showEdit.value = true
}

function openDetail(user: BizUser) {
  if (!access.value.view) return
  viewing.value = user
  showDetail.value = true
  emit('view', user)
}

function togglePerm(code: string) {
  const set = new Set(form.value.permissions)
  if (set.has(code)) set.delete(code)
  else set.add(code)
  form.value.permissions = [...set]
}

function validateForm(): boolean {
  formError.value = ''
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.role) {
    formError.value = t('biz.users.formRequired')
    return false
  }
  return true
}

async function save() {
  if (!validateForm()) return
  const payload = {
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim() || undefined,
    role: form.value.role,
    status: form.value.status,
    avatar: form.value.avatar.trim() || undefined,
    permissions: [...form.value.permissions]
  }
  if (editing.value) {
    const next = { ...editing.value, ...payload }
    if (usingAdapter.value && props.adapter?.update) {
      await asyncApi.update(next, { optimistic: next })
      if (asyncApi.mutation.value.error) return
    }
    emit('update', next)
  } else {
    if (usingAdapter.value && props.adapter?.create) {
      await asyncApi.create(payload)
      if (asyncApi.mutation.value.error) return
    }
    emit('create', payload)
  }
  showEdit.value = false
}

async function onDelete(id: BizUser['id']) {
  if (!access.value.delete) return
  if (usingAdapter.value && props.adapter?.remove) {
    await asyncApi.remove(id, { optimistic: true })
    if (asyncApi.mutation.value.error) return
  }
  emit('delete', id)
}

function onRefresh() {
  if (usingAdapter.value) {
    asyncApi.invalidateCache()
    void asyncApi.load({ force: true })
  }
  emit('refresh')
}

function onPageChange(payload: { page: number; pageSize: number }) {
  if (usingAdapter.value) {
    asyncApi.setPagination(payload)
    return
  }
  const pageChanged = payload.page !== localPage.value
  const sizeChanged = payload.pageSize !== localPageSize.value
  if (!pageChanged && !sizeChanged) return
  localPage.value = payload.page
  localPageSize.value = payload.pageSize
  if (pageChanged) emit('update:page', payload.page)
  if (sizeChanged) emit('update:pageSize', payload.pageSize)
  emit('page-change', {
    page: payload.page,
    pageSize: payload.pageSize,
    keyword: keyword.value,
    filters: { role: role.value }
  })
}
</script>

<template>
  <div class="biz-users" v-bind="attrs">
    <header class="biz-users__hero ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <slot name="toolbar">
      <Card class="biz-users__toolbar">
        <slot name="filters">
          <InputText v-model="keyword" :placeholder="t('biz.searchUser')" class="biz-users__search" />
          <Select v-model="role" :options="roleOptions" :placeholder="t('biz.role')" class="biz-users__role" />
        </slot>
        <Button
          v-if="access.refresh !== false"
          severity="secondary"
          variant="outlined"
          @click="onRefresh"
        >
          <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
        </Button>
        <Button
          v-if="access.create"
          severity="primary"
          variant="solid"
          @click="openCreate"
        >
          <Icon name="Plus" size="sm" /> {{ t('biz.newUser') }}
        </Button>
        <slot name="actions" />
      </Card>
    </slot>

    <Message v-if="tableError" severity="danger" :closable="false">
      <slot name="error" :error="tableError">{{ tableError }}</slot>
    </Message>
    <Message v-if="mutationError" severity="danger" :closable="false">
      <slot name="mutation-error" :error="mutationError">{{ mutationError }}</slot>
    </Message>

    <Card>
      <slot v-if="tableLoading" name="loading">
        <DataTable :value="[]" :columns="columns" :loading="true" />
      </slot>
      <slot name="empty" v-else-if="tableRows.length === 0">
        <Empty :description="t('biz.users.empty')" />
      </slot>
      <slot v-else name="table" :rows="tableRows">
        <DataTable :value="tableRows" :columns="columns" :loading="false">
          <template #body-avatar="{ row }">
            <Avatar
              :label="(row as BizUser).name"
              :image="(row as BizUser).avatar"
              size="sm"
              shape="circle"
            />
          </template>
          <template #body-role="{ row }">
            {{ roleLabel((row as BizUser).role) }}
          </template>
          <template #body-permissions="{ row }">
            <div class="biz-users__perms">
              <Tag
                v-for="p in (row as BizUser).permissions ?? []"
                :key="p"
                size="sm"
                severity="secondary"
              >
                {{ p }}
              </Tag>
            </div>
          </template>
          <template #body-status="{ row }">
            {{
              (row as BizUser).status === 'active'
                ? t('biz.users.statusActive')
                : t('biz.users.statusDisabled')
            }}
          </template>
          <template #body-actions="{ row }">
            <div class="biz-users__actions">
              <Button
                v-if="access.view"
                size="sm"
                variant="text"
                @click="openDetail(row as BizUser)"
              >
                {{ t('biz.users.viewDetail') }}
              </Button>
              <Button
                v-if="access.update"
                size="sm"
                variant="text"
                @click="openEdit(row as BizUser)"
              >
                {{ t(LocaleKeys.button.edit) }}
              </Button>
              <Button
                v-if="access.delete"
                size="sm"
                variant="text"
                severity="danger"
                @click="onDelete((row as BizUser).id)"
              >
                {{ t(LocaleKeys.button.delete) }}
              </Button>
            </div>
          </template>
        </DataTable>
        <Pagination
          class="biz-users__pager"
          :page="currentPage"
          :page-size="currentPageSize"
          :total="tableTotal"
          @change="onPageChange"
        />
      </slot>
    </Card>

    <Dialog
      v-model:visible="showDetail"
      :header="t('biz.users.detailTitle')"
      modal
    >
      <slot name="detail" :user="viewing">
        <div v-if="viewing" class="biz-users__detail">
          <Avatar :label="viewing.name" :image="viewing.avatar" size="lg" shape="circle" />
          <p><strong>{{ t('biz.name') }}:</strong> {{ viewing.name }}</p>
          <p><strong>{{ t(LocaleKeys.auth.email) }}:</strong> {{ viewing.email }}</p>
          <p><strong>{{ t(LocaleKeys.auth.phone) }}:</strong> {{ viewing.phone || '—' }}</p>
          <p><strong>{{ t('biz.role') }}:</strong> {{ roleLabel(viewing.role) }}</p>
          <p><strong>{{ t('biz.users.permissions') }}:</strong></p>
          <div class="biz-users__perms">
            <Tag v-for="p in viewing.permissions ?? []" :key="p" size="sm">{{ p }}</Tag>
            <span v-if="!(viewing.permissions ?? []).length">—</span>
          </div>
        </div>
      </slot>
    </Dialog>

    <Dialog
      v-model:visible="showEdit"
      :header="editing ? t('biz.editUser') : t('biz.createUser')"
      modal
    >
      <Message v-if="formError" severity="danger" :closable="false">{{ formError }}</Message>
      <div class="biz-users__form">
        <InputText v-model="form.name" :placeholder="t('biz.name')" fluid />
        <InputText v-model="form.email" :placeholder="t(LocaleKeys.auth.email)" fluid />
        <InputText v-model="form.phone" :placeholder="t(LocaleKeys.auth.phone)" fluid />
        <InputText v-model="form.avatar" :placeholder="t('biz.users.avatarUrl')" fluid />
        <Select v-model="form.role" :options="formRoles" :placeholder="t('biz.role')" fluid />
        <Select
          v-model="form.status"
          :options="[
            { value: 'active', label: t('biz.users.statusActive') },
            { value: 'disabled', label: t('biz.users.statusDisabled') }
          ]"
          fluid
        />
        <div class="biz-users__perm-edit">
          <span>{{ t('biz.users.permissions') }}</span>
          <div class="biz-users__perms">
            <Button
              v-for="opt in permissionOptions"
              :key="opt.value"
              size="sm"
              :variant="form.permissions.includes(opt.value) ? 'solid' : 'outlined'"
              @click="togglePerm(opt.value)"
            >
              {{ opt.label }}
            </Button>
          </div>
        </div>
      </div>
      <template #footer>
        <Button variant="outlined" @click="showEdit = false">{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button severity="primary" variant="solid" @click="save">{{ t(LocaleKeys.button.save) }}</Button>
      </template>
    </Dialog>
  </div>
</template>
