<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockGbsChannels } from '@showcase/shared/mock-api/gb28181'
import type { GbsChannel } from '@showcase/shared/mock-api/gb28181'

const columns = computed<Column<GbsChannel>[]>(() => [
  { field: 'name', header: 'Channel', sortable: true },
  { field: 'deviceId', header: 'Device ID' },
  { field: 'channelId', header: 'Channel ID' },
  { field: 'status', header: 'Status' },
  {
    field: 'ptz',
    header: 'PTZ',
    render: (v) => (v ? 'Yes' : 'No')
  },
  { field: 'resolution', header: 'Resolution' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="GB Channel List" />
    <Card>
      <DataTable
        :value="mockGbsChannels"
        :columns="columns"
        row-key="id"
        :virtual="false"
        striped
      />
    </Card>
  </div>
</template>
