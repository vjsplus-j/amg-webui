<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import { Button, Card, Icon, Empty, Tag } from '@amg-webui/core'
import { InputText, Select } from '@amg-webui/form'
import { Dialog, Message } from '@amg-webui/overlay'
import { DataTable, Pagination } from '@amg-webui/data'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type {
  BizTenantsProps,
  BizTenantsEmits,
  BizTenant,
  BizTenantCreate,
  BizTenantPlan,
  BizTenantStatus
} from './types'
import { useTenantsFilter } from './composables/useTenantsFilter'
import { DEFAULT_BIZ_ACCESS, useBizAsync } from '../_shared'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizTenantsProps>(), {
  tenants: () => [],
  loading: false,
  error: null,
  title: undefined,
  access: undefined,
  page: 1,
  pageSize: 10,
  total: undefined,
  activeTenantId: null
})

const emit = defineEmits<BizTenantsEmits>()
const attrs = useAttrs()
const { t, locale } = useLocale()

const access = computed(() => ({
  ...DEFAULT_BIZ_ACCESS,
  switch: true,
  suspend: true,
  activate: true,
  ...props.access
}))

const usingAdapter = computed(() => Boolean(props.adapter))
const fallbackAdapter = {
  async list() {
    return { list: props.tenants ?? [], total: (props.tenants ?? []).length }
  }
}
const asyncApi = useBizAsync<BizTenant, BizTenantCreate, BizTenant>({
  adapter: () => props.adapter ?? fallbackAdapter,
  initialQuery: { page: props.page, pageSize: props.pageSize },
  immediate: Boolean(props.adapter),
  keywordDebounceMs: 300,
  cache: { max: 32, ttlMs: 30_000 },
  getItemId: (item) => item.id
})

const { keyword, status, plan, filtered, stats } = useTenantsFilter(() =>
  usingAdapter.value ? asyncApi.list.value : (props.tenants ?? [])
)

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

const displayStats = computed(() => {
  if (usingAdapter.value) {
    const list = asyncApi.list.value
    return {
      total: asyncApi.total.value,
      active: list.filter((row) => row.status === 'active').length,
      trial: list.filter((row) => row.status === 'trial').length,
      suspended: list.filter((row) => row.status === 'suspended').length
    }
  }
  return stats.value
})

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
        filters: { status: status.value, plan: plan.value }
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
        filters: { status: status.value, plan: plan.value }
      })
    }
  }
})

watch(keyword, (v) => {
  if (usingAdapter.value) asyncApi.setKeyword(v)
})
watch(status, (v) => {
  if (usingAdapter.value) asyncApi.setFilter('status', v)
})
watch(plan, (v) => {
  if (usingAdapter.value) asyncApi.setFilter('plan', v)
})

const localActiveId = ref<string | null>(props.activeTenantId ?? null)
watch(
  () => props.activeTenantId,
  (v) => {
    localActiveId.value = v ?? null
  }
)

const allRows = computed(() =>
  usingAdapter.value ? asyncApi.list.value : (props.tenants ?? [])
)

const activeTenant = computed(() => {
  const id = localActiveId.value
  if (!id) return null
  return allRows.value.find((row) => row.id === id) ?? null
})

const showEdit = ref(false)
const showDetail = ref(false)
const editing = ref<BizTenant | null>(null)
const viewing = ref<BizTenant | null>(null)
const formError = ref('')
const form = ref({
  name: '',
  slug: '',
  plan: 'pro' as BizTenantPlan,
  status: 'trial' as BizTenantStatus,
  members: 1,
  region: '',
  domain: ''
})

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.tenantsTitle))

const statusOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allStatus') },
    { value: 'active', label: t('biz.tenants.statusActive') },
    { value: 'trial', label: t('biz.tenants.statusTrial') },
    { value: 'suspended', label: t('biz.tenants.statusSuspended') },
    { value: 'archived', label: t('biz.tenants.statusArchived') }
  ]
})

const planOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.tenants.allPlans') },
    { value: 'free', label: t('biz.tenants.planFree') },
    { value: 'pro', label: t('biz.tenants.planPro') },
    { value: 'enterprise', label: t('biz.tenants.planEnterprise') }
  ]
})

const formStatusOptions = computed(() => statusOptions.value.filter((o) => o.value))
const formPlanOptions = computed(() => planOptions.value.filter((o) => o.value))

function statusLabel(code: string) {
  const map: Record<string, string> = {
    active: t('biz.tenants.statusActive'),
    trial: t('biz.tenants.statusTrial'),
    suspended: t('biz.tenants.statusSuspended'),
    archived: t('biz.tenants.statusArchived')
  }
  return map[code] ?? code
}

function planLabel(code: string) {
  const map: Record<string, string> = {
    free: t('biz.tenants.planFree'),
    pro: t('biz.tenants.planPro'),
    enterprise: t('biz.tenants.planEnterprise')
  }
  return map[code] ?? code
}

function statusSeverity(code: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
  if (code === 'active') return 'success'
  if (code === 'trial') return 'info'
  if (code === 'suspended') return 'warning'
  if (code === 'archived') return 'secondary'
  return 'secondary'
}

const columns = computed(() => {
  void locale.value
  return [
    { field: 'name', header: t('biz.tenants.name'), sortable: true },
    { field: 'slug', header: t('biz.tenants.slug') },
    { field: 'plan', header: t('biz.tenants.plan') },
    { field: 'status', header: t('biz.tenants.status') },
    { field: 'members', header: t('biz.tenants.members'), width: '6rem' },
    { field: 'region', header: t('biz.tenants.region') },
    { field: 'createdAt', header: t('biz.tenants.createdAt') },
    { field: 'actions', header: t(LocaleKeys.common.actions), width: '260px' }
  ]
})

function openCreate() {
  if (!access.value.create) return
  editing.value = null
  formError.value = ''
  form.value = {
    name: '',
    slug: '',
    plan: 'pro',
    status: 'trial',
    members: 1,
    region: '',
    domain: ''
  }
  showEdit.value = true
}

function openEdit(tenant: BizTenant) {
  if (!access.value.update) return
  editing.value = tenant
  formError.value = ''
  form.value = {
    name: tenant.name,
    slug: tenant.slug,
    plan: tenant.plan,
    status: tenant.status,
    members: tenant.members,
    region: tenant.region ?? '',
    domain: tenant.domain ?? ''
  }
  showEdit.value = true
}

function openDetail(tenant: BizTenant) {
  if (!access.value.view) return
  viewing.value = tenant
  showDetail.value = true
  emit('view', tenant)
}

function validateForm(): boolean {
  formError.value = ''
  if (!form.value.name.trim() || !form.value.slug.trim()) {
    formError.value = t('biz.tenants.formRequired')
    return false
  }
  return true
}

async function save() {
  if (!validateForm()) return
  const payload: BizTenantCreate = {
    name: form.value.name.trim(),
    slug: form.value.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    plan: form.value.plan,
    status: form.value.status,
    members: Number(form.value.members) || 0,
    region: form.value.region.trim() || undefined,
    domain: form.value.domain.trim() || undefined
  }
  if (editing.value) {
    const next: BizTenant = {
      ...editing.value,
      ...payload,
      usage: editing.value.usage
    }
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

async function onDelete(id: string) {
  if (!access.value.delete) return
  if (usingAdapter.value && props.adapter?.remove) {
    await asyncApi.remove(id, { optimistic: true })
    if (asyncApi.mutation.value.error) return
  }
  if (localActiveId.value === id) {
    localActiveId.value = null
    emit('update:activeTenantId', null)
  }
  emit('delete', id)
}

function onSwitch(tenant: BizTenant) {
  if (!access.value.switch) return
  if (tenant.status === 'suspended' || tenant.status === 'archived') return
  localActiveId.value = tenant.id
  emit('update:activeTenantId', tenant.id)
  emit('switch', tenant)
}

async function onSuspend(tenant: BizTenant) {
  if (!access.value.suspend) return
  const next: BizTenant = { ...tenant, status: 'suspended' }
  if (usingAdapter.value && props.adapter?.update) {
    await asyncApi.update(next, { optimistic: next })
    if (asyncApi.mutation.value.error) return
  }
  emit('suspend', tenant.id)
  emit('update', next)
}

async function onActivate(tenant: BizTenant) {
  if (!access.value.activate) return
  const next: BizTenant = { ...tenant, status: 'active' }
  if (usingAdapter.value && props.adapter?.update) {
    await asyncApi.update(next, { optimistic: next })
    if (asyncApi.mutation.value.error) return
  }
  emit('activate', tenant.id)
  emit('update', next)
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
    filters: { status: status.value, plan: plan.value }
  })
}
</script>

<template>
  <div class="biz-tenants" v-bind="attrs">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <Card>
      <div class="biz-tenants__context">
        <Tag
          v-if="activeTenant"
          size="sm"
          severity="success"
          :label="`${t('biz.tenants.currentBadge')}: ${activeTenant.name}`"
        />
        <span v-else class="biz-tenants__context-meta">{{ t('biz.tenants.contextEmpty') }}</span>
        <div v-if="activeTenant" class="biz-tenants__context-meta">
          <code>{{ activeTenant.slug }}</code>
          <span>{{ planLabel(activeTenant.plan) }}</span>
          <span v-if="activeTenant.domain">{{ activeTenant.domain }}</span>
          <span>
            {{ t('biz.tenants.usageUsers') }} {{ activeTenant.usage?.users ?? 0 }} ·
            {{ t('biz.tenants.usageOrders') }} {{ activeTenant.usage?.orders ?? 0 }}
          </span>
        </div>
      </div>
    </Card>

    <div class="theme-kit-stats">
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.total }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.tenants.total') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.active }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.tenants.activeCount') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.trial }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.tenants.trialCount') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.suspended }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.tenants.suspendedCount') }}</div>
      </div>
    </div>

    <slot name="toolbar">
      <Card class="biz-tenants__toolbar">
        <slot name="filters">
          <InputText
            v-model="keyword"
            :placeholder="t('biz.tenants.search')"
            class="biz-tenants__search"
          />
          <Select
            v-model="status"
            :options="statusOptions"
            :placeholder="t('biz.status')"
            class="biz-tenants__filter"
          />
          <Select
            v-model="plan"
            :options="planOptions"
            :placeholder="t('biz.tenants.plan')"
            class="biz-tenants__filter"
          />
        </slot>
        <Button
          v-if="access.refresh !== false"
          severity="secondary"
          variant="outlined"
          @click="onRefresh"
        >
          <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
        </Button>
        <Button v-if="access.create" severity="primary" variant="solid" @click="openCreate">
          <Icon name="Plus" size="sm" /> {{ t('biz.tenants.new') }}
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
        <Empty :description="t('biz.tenants.empty')" />
      </slot>
      <slot v-else name="table" :rows="tableRows">
        <DataTable :value="tableRows" :columns="columns" :loading="false">
          <template #body-name="{ row }">
            <span>
              {{ (row as BizTenant).name }}
              <Tag
                v-if="localActiveId === (row as BizTenant).id"
                size="sm"
                severity="success"
                :label="t('biz.tenants.currentBadge')"
              />
            </span>
          </template>
          <template #body-plan="{ row }">
            {{ planLabel((row as BizTenant).plan) }}
          </template>
          <template #body-status="{ row }">
            <Tag
              size="sm"
              :severity="statusSeverity((row as BizTenant).status)"
              :label="statusLabel((row as BizTenant).status)"
            />
          </template>
          <template #body-actions="{ row }">
            <div class="biz-tenants__actions">
              <Button
                v-if="access.view !== false"
                size="sm"
                variant="text"
                @click="openDetail(row as BizTenant)"
              >
                {{ t('biz.tenants.detail') }}
              </Button>
              <Button
                v-if="access.switch"
                size="sm"
                variant="outlined"
                :disabled="
                  (row as BizTenant).status === 'suspended' ||
                  (row as BizTenant).status === 'archived' ||
                  localActiveId === (row as BizTenant).id
                "
                @click="onSwitch(row as BizTenant)"
              >
                {{ t('biz.tenants.switch') }}
              </Button>
              <Button
                v-if="access.update"
                size="sm"
                variant="text"
                @click="openEdit(row as BizTenant)"
              >
                {{ t(LocaleKeys.button.edit) }}
              </Button>
              <Button
                v-if="access.suspend && (row as BizTenant).status !== 'suspended'"
                size="sm"
                severity="warning"
                variant="text"
                @click="onSuspend(row as BizTenant)"
              >
                {{ t('biz.tenants.suspend') }}
              </Button>
              <Button
                v-if="access.activate && (row as BizTenant).status === 'suspended'"
                size="sm"
                severity="success"
                variant="text"
                @click="onActivate(row as BizTenant)"
              >
                {{ t('biz.tenants.activate') }}
              </Button>
              <Button
                v-if="access.delete"
                size="sm"
                severity="danger"
                variant="text"
                @click="onDelete((row as BizTenant).id)"
              >
                {{ t(LocaleKeys.button.delete) }}
              </Button>
            </div>
          </template>
        </DataTable>
      </slot>
      <Pagination
        v-if="tableTotal > 0"
        class="biz-tenants__pager"
        :page="currentPage"
        :page-size="currentPageSize"
        :total="tableTotal"
        @change="onPageChange"
      />
    </Card>

    <Dialog
      v-model:visible="showEdit"
      :title="editing ? t('biz.tenants.edit') : t('biz.tenants.new')"
      :dismissible="true"
    >
      <div class="biz-tenants__form">
        <Message v-if="formError" severity="danger" :closable="false">{{ formError }}</Message>
        <InputText v-model="form.name" :placeholder="t('biz.tenants.name')" />
        <InputText v-model="form.slug" :placeholder="t('biz.tenants.slug')" />
        <Select v-model="form.plan" :options="formPlanOptions" :placeholder="t('biz.tenants.plan')" />
        <Select
          v-model="form.status"
          :options="formStatusOptions"
          :placeholder="t('biz.tenants.status')"
        />
        <InputText v-model="form.region" :placeholder="t('biz.tenants.region')" />
        <InputText v-model="form.domain" :placeholder="t('biz.tenants.domain')" />
      </div>
      <template #footer>
        <Button variant="outlined" @click="showEdit = false">{{ t(LocaleKeys.button.cancel) }}</Button>
        <Button severity="primary" @click="save">{{ t(LocaleKeys.button.save) }}</Button>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showDetail"
      :title="t('biz.tenants.detail')"
      :dismissible="true"
    >
      <div v-if="viewing" class="biz-tenants__detail">
        <p>
          <strong>{{ viewing.name }}</strong>
          <code> {{ viewing.slug }}</code>
        </p>
        <p>{{ planLabel(viewing.plan) }} · {{ statusLabel(viewing.status) }}</p>
        <p v-if="viewing.domain">{{ viewing.domain }}</p>
        <p v-if="viewing.region">{{ viewing.region }}</p>
        <div class="biz-tenants__isolation">
          <div>
            <strong>{{ viewing.usage?.users ?? 0 }}</strong>
            <span>{{ t('biz.tenants.usageUsers') }}</span>
          </div>
          <div>
            <strong>{{ viewing.usage?.orders ?? 0 }}</strong>
            <span>{{ t('biz.tenants.usageOrders') }}</span>
          </div>
          <div>
            <strong>{{ viewing.usage?.storageGb ?? 0 }}</strong>
            <span>{{ t('biz.tenants.usageStorage') }}</span>
          </div>
          <div>
            <strong>{{ viewing.members }}</strong>
            <span>{{ t('biz.tenants.members') }}</span>
          </div>
        </div>
        <p class="biz-tenants__context-meta">{{ t('biz.tenants.isolation') }}</p>
      </div>
      <template #footer>
        <Button
          v-if="viewing && access.switch"
          severity="primary"
          :disabled="
            !viewing ||
            viewing.status === 'suspended' ||
            viewing.status === 'archived' ||
            localActiveId === viewing.id
          "
          @click="viewing && onSwitch(viewing)"
        >
          {{ t('biz.tenants.switch') }}
        </Button>
        <Button variant="outlined" @click="showDetail = false">{{ t(LocaleKeys.common.close) }}</Button>
      </template>
    </Dialog>
  </div>
</template>
