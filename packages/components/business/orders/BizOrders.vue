<script setup lang="ts">
import { computed, ref, watch, useAttrs } from 'vue'
import {
  Button,
  InputText,
  Select,
  DataTable,
  Card,
  Icon,
  Pagination,
  Empty,
  Message,
  Drawer
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizOrdersProps, BizOrdersEmits, BizOrder } from './types'
import { useOrdersFilter } from './composables/useOrdersFilter'
import { DEFAULT_BIZ_ACCESS, useBizAsync } from '../_shared'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BizOrdersProps>(), {
  orders: () => [],
  loading: false,
  error: null,
  title: undefined,
  access: undefined,
  page: 1,
  pageSize: 10,
  total: undefined,
  currency: '¥',
  selectable: true
})

const emit = defineEmits<BizOrdersEmits>()
const attrs = useAttrs()
const { t, locale } = useLocale()
const access = computed(() => ({
  ...DEFAULT_BIZ_ACCESS,
  refund: true,
  batch: true,
  ...props.access
}))

const usingAdapter = computed(() => Boolean(props.adapter))
const asyncApi = useBizAsync<BizOrder>({
  adapter: props.adapter ?? {
    async list() {
      return { list: props.orders ?? [], total: (props.orders ?? []).length }
    }
  },
  initialQuery: { page: props.page, pageSize: props.pageSize },
  immediate: Boolean(props.adapter)
})

const { keyword, status, filtered, stats } = useOrdersFilter(() =>
  usingAdapter.value ? asyncApi.list.value : (props.orders ?? [])
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
const tableTotal = computed(() =>
  usingAdapter.value ? asyncApi.total.value : (props.total ?? filtered.value.length)
)
const displayStats = computed(() =>
  usingAdapter.value
    ? {
        total: asyncApi.total.value,
        pending: asyncApi.list.value.filter((o) => o.status === 'pending').length,
        amount: asyncApi.list.value.reduce((s, o) => s + o.amount, 0)
      }
    : stats.value
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
        filters: { status: status.value }
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
        filters: { status: status.value }
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

const selection = ref<(string | number)[]>([])
const detailOpen = ref(false)
const detailOrder = ref<BizOrder | null>(null)

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.ordersTitle))

const statusOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allStatus') },
    { value: 'pending', label: t('biz.orders.pendingLabel') },
    { value: 'paid', label: t('biz.orders.paid') },
    { value: 'shipped', label: t('biz.orders.shipped') },
    { value: 'done', label: t('biz.orders.done') },
    { value: 'cancelled', label: t('biz.orders.cancelled') },
    { value: 'refunding', label: t('biz.orders.refunding') },
    { value: 'refunded', label: t('biz.orders.refunded') }
  ]
})

const columns = computed(() => {
  void locale.value
  return [
    { field: 'orderNo', header: t('biz.orders.orderNo'), sortable: true },
    { field: 'customer', header: t('biz.orders.customer') },
    { field: 'amount', header: t('biz.orders.amount') },
    { field: 'status', header: t('biz.status') },
    { field: 'createdAt', header: t('biz.orders.createdAt') },
    { field: 'actions', header: t(LocaleKeys.common.actions), width: '220px' }
  ]
})

function formatAmount(n: number) {
  return `${props.currency}${n.toFixed(2)}`
}

function statusText(value: string) {
  const hit = statusOptions.value.find((o) => o.value === value)
  return hit?.label ?? value
}

function openDetail(order: BizOrder) {
  if (!access.value.view) return
  detailOrder.value = order
  detailOpen.value = true
  emit('view', order)
}

function canCancel(order: BizOrder) {
  return order.status !== 'cancelled' && order.status !== 'done' && order.status !== 'refunded'
}

function canRefund(order: BizOrder) {
  return order.refundable !== false && (order.status === 'paid' || order.status === 'shipped' || order.status === 'done')
}

function onCancel(id: string) {
  emit('cancel', id)
}

function onRefund(id: string) {
  if (!access.value.refund) return
  emit('refund', id)
}

function onBatchCancel() {
  if (!access.value.batch || !selection.value.length) return
  emit(
    'batch-cancel',
    selection.value.map(String)
  )
  selection.value = []
}

function onRefresh() {
  if (usingAdapter.value) void asyncApi.load()
  emit('refresh')
}

function onPageChange(payload: { page: number; pageSize: number }) {
  currentPage.value = payload.page
  currentPageSize.value = payload.pageSize
}
</script>

<template>
  <div class="biz-orders" v-bind="attrs">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">{{ t(LocaleKeys.nav.biz) }}</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <div class="theme-kit-stats biz-orders__stats">
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.total }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.total') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ displayStats.pending }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.pendingLabel') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ formatAmount(displayStats.amount) }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.revenue') }}</div>
      </div>
    </div>

    <slot name="toolbar">
      <Card class="biz-orders__toolbar">
        <slot name="filters">
          <InputText v-model="keyword" :placeholder="t('biz.orders.search')" class="biz-orders__search" />
          <Select v-model="status" :options="statusOptions" :placeholder="t('biz.status')" />
        </slot>
        <Button v-if="access.refresh !== false" severity="secondary" variant="outlined" @click="onRefresh">
          <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
        </Button>
        <Button
          v-if="access.batch && selectable"
          severity="danger"
          variant="outlined"
          :disabled="!selection.length"
          @click="onBatchCancel"
        >
          {{ t('biz.orders.batchCancel') }} ({{ selection.length }})
        </Button>
        <slot name="actions" />
      </Card>
    </slot>

    <Message v-if="tableError" severity="danger" :closable="false">
      <slot name="error" :error="tableError">{{ tableError }}</slot>
    </Message>

    <Card>
      <slot v-if="tableLoading" name="loading">
        <DataTable :value="[]" :columns="columns" :loading="true" />
      </slot>
      <slot name="empty" v-else-if="tableRows.length === 0">
        <Empty :description="t('biz.orders.empty')" />
      </slot>
      <slot v-else name="table" :rows="tableRows">
        <DataTable
          v-model:selection="selection"
          :value="tableRows"
          :columns="columns"
          :loading="false"
          :selection-mode="selectable ? 'multiple' : undefined"
          data-key="id"
        >
          <template #body-amount="{ row }">
            {{ formatAmount((row as BizOrder).amount) }}
          </template>
          <template #body-status="{ row }">
            {{ statusText((row as BizOrder).status) }}
          </template>
          <template #body-actions="{ row }">
            <div class="biz-orders__actions">
              <Button v-if="access.view" size="sm" variant="text" @click="openDetail(row as BizOrder)">
                {{ t('biz.orders.detail') }}
              </Button>
              <Button
                v-if="access.refund && canRefund(row as BizOrder)"
                size="sm"
                variant="text"
                @click="onRefund((row as BizOrder).id)"
              >
                {{ t('biz.orders.refund') }}
              </Button>
              <Button
                v-if="access.delete && canCancel(row as BizOrder)"
                size="sm"
                variant="text"
                severity="danger"
                @click="onCancel((row as BizOrder).id)"
              >
                {{ t(LocaleKeys.button.cancel) }}
              </Button>
            </div>
          </template>
        </DataTable>
        <Pagination
          class="biz-orders__pager"
          :page="currentPage"
          :page-size="currentPageSize"
          :total="tableTotal"
          @change="onPageChange"
        />
      </slot>
    </Card>

    <Drawer v-model:visible="detailOpen" :header="t('biz.orders.detail')" position="right">
      <slot name="detail" :order="detailOrder">
        <div v-if="detailOrder" class="biz-orders__detail">
          <p><strong>{{ t('biz.orders.orderNo') }}:</strong> {{ detailOrder.orderNo }}</p>
          <p><strong>{{ t('biz.orders.customer') }}:</strong> {{ detailOrder.customer }}</p>
          <p><strong>{{ t('biz.orders.amount') }}:</strong> {{ formatAmount(detailOrder.amount) }}</p>
          <p><strong>{{ t('biz.status') }}:</strong> {{ statusText(detailOrder.status) }}</p>
          <p v-if="detailOrder.remark"><strong>{{ t('biz.orders.remark') }}:</strong> {{ detailOrder.remark }}</p>
          <h3>{{ t('biz.orders.timeline') }}</h3>
          <ul class="biz-orders__timeline">
            <li v-for="(item, i) in detailOrder.timeline ?? []" :key="i">
              <span>{{ item.at }}</span> — {{ item.label }}
            </li>
            <li v-if="!(detailOrder.timeline ?? []).length">
              {{ detailOrder.createdAt }} — {{ t('biz.orders.createdAt') }}
            </li>
          </ul>
          <div class="biz-orders__actions">
            <Button
              v-if="access.refund && canRefund(detailOrder)"
              severity="primary"
              variant="outlined"
              @click="onRefund(detailOrder.id)"
            >
              {{ t('biz.orders.afterSales') }}
            </Button>
          </div>
        </div>
      </slot>
    </Drawer>
  </div>
</template>
