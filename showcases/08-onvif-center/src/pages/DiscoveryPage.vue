<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockDiscoveredDevices } from '@showcase/shared/mock-api/onvif'
import type { OnvifDiscoveredDevice } from '@showcase/shared/mock-api/onvif'

const scanning = ref(false)
const devices = ref<OnvifDiscoveredDevice[]>([])

const columns: Column<OnvifDiscoveredDevice>[] = [
  { field: 'name', header: 'Name' },
  { field: 'ip', header: 'IP' },
  { field: 'manufacturer', header: 'Manufacturer' },
  { field: 'model', header: 'Model' },
  { field: 'xaddrs', header: 'XAddr' }
]

async function startDiscovery() {
  scanning.value = true
  devices.value = []
  await new Promise((r) => setTimeout(r, 1200))
  devices.value = [...mockDiscoveredDevices]
  scanning.value = false
}
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="ONVIF Discovery">
      <template #extra>
        <Button
          severity="primary"
          :label="scanning ? 'Scanning…' : 'Start WS-Discovery'"
          :loading="scanning"
          @click="startDiscovery"
        />
      </template>
    </PageHeader>

    <Card title="Probe results">
      <p v-if="!devices.length && !scanning" class="showcase-page__lead">
        Click Start to simulate WS-Discovery on the local subnet.
      </p>
      <DataTable
        v-else
        :value="devices"
        :columns="columns"
        row-key="id"
        :loading="scanning"
        :virtual="false"
      />
    </Card>
  </div>
</template>
