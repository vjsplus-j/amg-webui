<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card, DataTable, Descriptions, DescriptionsItem, PageHeader, Result } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRoute, useRouter } from 'vue-router'
import { getEcomOrderDetail } from '@showcase/shared/mock-api/ecommerce'
import type { EcomOrderLine } from '@showcase/shared/mock-api/ecommerce'

const route = useRoute()
const router = useRouter()

const orderId = computed(() => String(route.params.id))
const detail = computed(() => getEcomOrderDetail(orderId.value))

const lineColumns = computed<Column<EcomOrderLine>[]>(() => [
  { field: 'sku', header: 'SKU' },
  { field: 'name', header: 'Product' },
  { field: 'qty', header: 'Qty' },
  { field: 'price', header: 'Unit', render: (v) => `¥${Number(v)}` }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader :title="`Order ${orderId}`">
      <template #extra>
        <Button variant="outlined" label="Back to orders" @click="router.push('/orders')" />
      </template>
    </PageHeader>

    <Result v-if="!detail" status="404" title="Order not found" sub-title="No mock data for this order ID." />

    <template v-else>
      <Card title="Order summary">
        <Descriptions :column="2">
          <DescriptionsItem label="Customer">{{ detail.customer }}</DescriptionsItem>
          <DescriptionsItem label="Status">
            <span
              class="showcase-status"
              :class="{
                'showcase-status--online': detail.status === 'shipped' || detail.status === 'paid',
                'showcase-status--pending': detail.status === 'pending',
                'showcase-status--offline': detail.status === 'cancelled'
              }"
            >
              {{ detail.status }}
            </span>
          </DescriptionsItem>
          <DescriptionsItem label="Placed">{{ new Date(detail.placedAt).toLocaleString() }}</DescriptionsItem>
          <DescriptionsItem label="Total">¥{{ detail.total.toLocaleString() }}</DescriptionsItem>
          <DescriptionsItem label="Shipping">{{ detail.shippingAddress }}</DescriptionsItem>
          <DescriptionsItem label="Payment">{{ detail.payment }}</DescriptionsItem>
        </Descriptions>
      </Card>

      <Card title="Line items">
        <DataTable
          :value="detail.lines"
          :columns="lineColumns"
          row-key="sku"
          :virtual="false"
        />
      </Card>
    </template>
  </div>
</template>
