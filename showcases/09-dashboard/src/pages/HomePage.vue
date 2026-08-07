<script setup lang="ts">
import { computed } from 'vue'
import { Button, Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import {
  mockChartSeries,
  mockKpis,
  mockRecentOrders
} from '@showcase/shared/mock-api/dashboard'
import type { DashboardOrder } from '@showcase/shared/mock-api/dashboard'

const chartBars = computed(() => mockChartSeries[0]?.values ?? [])

const orderColumns = computed<Column<DashboardOrder>[]>(() => [
  { field: 'id', header: 'Order ID' },
  { field: 'customer', header: 'Customer', sortable: true },
  { field: 'product', header: 'Product' },
  {
    field: 'amount',
    header: 'Amount',
    render: (v) => `¥${Number(v).toLocaleString()}`
  },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'date', header: 'Date' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Analytics Dashboard">
      <template #extra>
        <Button severity="primary" label="Export report" />
      </template>
    </PageHeader>

    <div class="showcase-grid showcase-grid--4">
      <div
        v-for="kpi in mockKpis"
        :key="kpi.id"
        class="showcase-stat"
      >
        <p class="showcase-stat__label">{{ kpi.label }}</p>
        <p class="showcase-stat__value">{{ kpi.value }}</p>
        <p
          class="showcase-stat__delta"
          :class="{
            'showcase-stat__delta--up': kpi.trend === 'up',
            'showcase-stat__delta--down': kpi.trend === 'down'
          }"
        >
          {{ kpi.delta }}
        </p>
      </div>
    </div>

    <div class="showcase-grid showcase-grid--2">
      <Card title="Revenue trend (placeholder)">
        <div class="showcase-chart-placeholder" aria-hidden="true">
          <div
            v-for="(h, i) in chartBars"
            :key="i"
            class="showcase-chart-bar"
            :style="{ height: `${h}%` }"
          />
        </div>
      </Card>

      <Card title="Channel mix (placeholder)">
        <div class="showcase-chart-placeholder showcase-chart-placeholder--pie">
          <div class="showcase-pie-ring" />
          <ul class="showcase-legend">
            <li>Direct 42%</li>
            <li>Organic 31%</li>
            <li>Paid 27%</li>
          </ul>
        </div>
      </Card>
    </div>

    <Card title="Recent orders">
      <DataTable
        :value="mockRecentOrders"
        :columns="orderColumns"
        row-key="id"
        :virtual="false"
        striped
      />
    </Card>
  </div>
</template>

<style scoped>
.showcase-chart-placeholder--pie {
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.showcase-pie-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--theme-primary, #2563eb) 0 42%,
    var(--theme-success, #16a34a) 42% 73%,
    var(--theme-warning, #d97706) 73% 100%
  );
  mask: radial-gradient(farthest-side, transparent 58%, #000 59%);
}

.showcase-legend {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--theme-text-secondary, #64748b);
}
</style>
