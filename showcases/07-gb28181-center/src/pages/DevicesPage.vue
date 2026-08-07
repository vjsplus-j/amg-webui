<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockGbsDevices } from '@showcase/shared/mock-api/gb28181'
import type { GbsDevice } from '@showcase/shared/mock-api/gb28181'

const rows = computed(() =>
  mockGbsDevices.map((d) => ({
    ...d,
    lastHeartbeat: new Date(d.lastHeartbeat).toLocaleString()
  }))
)

const columns = computed<Column<GbsDevice>[]>(() => [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'deviceId', header: 'Device ID' },
  { field: 'ip', header: 'IP' },
  { field: 'manufacturer', header: 'Vendor' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'channelCount', header: 'Channels' },
  { field: 'lastHeartbeat', header: 'Last heartbeat' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="GB Device List" />
    <Card>
      <DataTable
        :value="rows"
        :columns="columns"
        row-key="id"
        :virtual="false"
        striped
      />
    </Card>
  </div>
</template>
