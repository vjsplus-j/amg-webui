<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockOnvifDevices } from '@showcase/shared/mock-api/onvif'
import type { OnvifDevice } from '@showcase/shared/mock-api/onvif'

const rows = computed(() =>
  mockOnvifDevices.map((d) => ({
    ...d,
    lastSeen: new Date(d.lastSeen).toLocaleString()
  }))
)

const columns = computed<Column<OnvifDevice>[]>(() => [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'ip', header: 'IP' },
  { field: 'username', header: 'Username' },
  { field: 'profiles', header: 'Profiles' },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'firmware', header: 'Firmware' },
  { field: 'lastSeen', header: 'Last seen' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="ONVIF Device List" />
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
