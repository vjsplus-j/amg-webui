<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockIotDevices, mockIotOnlineSummary } from '@showcase/shared/mock-api/device-mgmt'
import type { IotDevice } from '@showcase/shared/mock-api/device-mgmt'

const summary = mockIotOnlineSummary

const rows = computed(() =>
  mockIotDevices.map((d) => ({
    ...d,
    lastSeen: new Date(d.lastSeen).toLocaleString()
  }))
)

const columns = computed<Column<IotDevice>[]>(() => [
  { field: 'name', header: 'Device', sortable: true },
  { field: 'group', header: 'Group' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'lastSeen', header: 'Last seen' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Online status" />

    <div class="showcase-grid showcase-grid--3">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Online</p>
        <p class="showcase-stat__value">{{ summary.online }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Offline</p>
        <p class="showcase-stat__value">{{ summary.offline }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Sleep</p>
        <p class="showcase-stat__value">{{ summary.sleep }}</p>
      </div>
    </div>

    <Card title="Live device status">
      <DataTable :value="rows" :columns="columns" row-key="id" :virtual="false" striped />
    </Card>
  </div>
</template>
