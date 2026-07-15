<script setup lang="ts">
import { computed } from 'vue'
import { Button, InputText, Select, DataTable, Card, Icon } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizOrdersProps, BizOrdersEmits, BizOrder } from './types'
import { useOrdersFilter } from './composables/useOrdersFilter'
import './style.scss'

const props = withDefaults(defineProps<BizOrdersProps>(), {
  loading: false,
  title: undefined
})

const emit = defineEmits<BizOrdersEmits>()
const { t, locale } = useLocale()
const { keyword, status, filtered, stats } = useOrdersFilter(() => props.orders)

const displayTitle = computed(() => props.title ?? t(LocaleKeys.biz.ordersTitle))

const statusOptions = computed(() => {
  void locale.value
  return [
    { value: '', label: t('biz.allStatus') },
    { value: 'pending', label: t('biz.orders.pendingLabel') },
    { value: 'paid', label: t('biz.orders.paid') },
    { value: 'shipped', label: t('biz.orders.shipped') },
    { value: 'done', label: t('biz.orders.done') },
    { value: 'cancelled', label: t('biz.orders.cancelled') }
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
    { field: 'actions', header: t(LocaleKeys.common.actions), width: '160px' }
  ]
})

function formatAmount(n: number) {
  return `¥${n.toFixed(2)}`
}

function statusText(value: string) {
  const hit = statusOptions.value.find((o) => o.value === value)
  return hit?.label ?? value
}
</script>

<template>
  <div class="biz-orders">
    <header class="ln-page-hero">
      <p class="ln-page-eyebrow">Business · Orders</p>
      <h1 class="ln-page-title">{{ displayTitle }}</h1>
    </header>

    <div class="theme-kit-stats biz-orders__stats">
      <div>
        <div class="theme-kit-stat-value">{{ stats.total }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.total') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ stats.pending }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.pendingLabel') }}</div>
      </div>
      <div>
        <div class="theme-kit-stat-value">{{ formatAmount(stats.amount) }}</div>
        <div class="theme-kit-stat-label">{{ t('biz.orders.revenue') }}</div>
      </div>
    </div>

    <Card class="biz-orders__toolbar">
      <InputText v-model="keyword" :placeholder="t('biz.orders.search')" class="biz-orders__search" />
      <Select v-model="status" :options="statusOptions" :placeholder="t('biz.status')" />
      <Button severity="secondary" variant="outlined" @click="emit('refresh')">
        <Icon name="RefreshCw" size="sm" /> {{ t(LocaleKeys.button.refresh) }}
      </Button>
    </Card>

    <Card>
      <DataTable :value="filtered" :columns="columns" :loading="loading">
        <template #body-amount="{ row }">
          {{ formatAmount((row as BizOrder).amount) }}
        </template>
        <template #body-status="{ row }">
          {{ statusText((row as BizOrder).status) }}
        </template>
        <template #body-actions="{ row }">
          <div class="biz-orders__actions">
            <Button size="sm" variant="text" @click="emit('view', row as BizOrder)">
              {{ t('biz.orders.detail') }}
            </Button>
            <Button
              size="sm"
              variant="text"
              severity="danger"
              :disabled="(row as BizOrder).status === 'cancelled' || (row as BizOrder).status === 'done'"
              @click="emit('cancel', (row as BizOrder).id)"
            >
              {{ t(LocaleKeys.button.cancel) }}
            </Button>
          </div>
        </template>
      </DataTable>
    </Card>
  </div>
</template>
