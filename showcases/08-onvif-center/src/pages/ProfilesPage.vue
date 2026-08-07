<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockOnvifProfiles } from '@showcase/shared/mock-api/onvif'
import type { OnvifProfile } from '@showcase/shared/mock-api/onvif'

const columns = computed<Column<OnvifProfile>[]>(() => [
  { field: 'name', header: 'Profile', sortable: true },
  { field: 'deviceId', header: 'Device ID' },
  { field: 'token', header: 'Token' },
  { field: 'codec', header: 'Codec' },
  { field: 'resolution', header: 'Resolution' },
  { field: 'fps', header: 'FPS' },
  { field: 'bitrate', header: 'Bitrate' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Media Profiles" />
    <Card>
      <DataTable
        :value="mockOnvifProfiles"
        :columns="columns"
        row-key="id"
        :virtual="false"
        striped
      />
    </Card>
  </div>
</template>
