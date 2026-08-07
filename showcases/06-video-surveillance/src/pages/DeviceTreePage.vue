<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { mockVideoTree } from '@showcase/shared/mock-api/video-surveillance'
import type { VideoTreeNode } from '@showcase/shared/mock-api/video-surveillance'

const rows = computed(() => mockVideoTree)

const columns = computed<Column<VideoTreeNode>[]>(() => [
  { field: 'label', header: 'Node', sortable: true },
  { field: 'type', header: 'Type' },
  { field: 'children', header: 'Children', render: (v) => (v != null ? String(v) : '—') },
  { field: 'status', header: 'Status', sortable: true }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Device tree" />

    <Card title="Site hierarchy (flattened mock)">
      <DataTable :value="rows" :columns="columns" row-key="id" :virtual="false" striped />
    </Card>
  </div>
</template>
