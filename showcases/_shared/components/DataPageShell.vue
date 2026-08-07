<script setup lang="ts">
import {
  Button,
  Card,
  DataTable,
  Empty,
  InputText,
  PageHeader,
  Pagination,
  Result,
  Select
} from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { FetchPhase } from '../mock-api/types'

defineProps<{
  title: string
  phase: FetchPhase
  errorMessage?: string
  columns: Column[]
  rows: unknown[]
  rowKey?: string
  total: number
  page: number
  pageSize: number
  search: string
  statusFilter: string
  statusOptions: { label: string; value: string }[]
  emptyDescription: string
  searchPlaceholder?: string
  showCreate?: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:statusFilter': [value: string]
  'update:page': [value: number]
  'update:pageSize': [value: number]
  refresh: []
  create: []
  simulateEmpty: []
  simulateError: []
}>()

const { t } = useLocale()
</script>

<template>
  <div class="showcase-page">
    <PageHeader :title="title">
      <template #extra>
        <div class="showcase-toolbar">
          <Button
            v-if="showCreate !== false"
            severity="primary"
            label="Add"
            @click="emit('create')"
          />
          <Button
            variant="outlined"
            label="Simulate empty"
            @click="emit('simulateEmpty')"
          />
          <Button
            variant="outlined"
            label="Simulate error"
            @click="emit('simulateError')"
          />
          <Button
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            @click="emit('refresh')"
          />
        </div>
      </template>
    </PageHeader>

    <Card>
      <div class="showcase-filters">
        <InputText
          :model-value="search"
          fluid
          :placeholder="searchPlaceholder ?? 'Search…'"
          @update:model-value="emit('update:search', $event)"
        />
        <Select
          :model-value="statusFilter"
          :options="statusOptions"
          fluid
          @update:model-value="emit('update:statusFilter', String($event))"
        />
      </div>

      <Result
        v-if="phase === 'error'"
        status="error"
        title="Failed to load"
        :sub-title="errorMessage"
      >
        <template #extra>
          <Button severity="primary" label="Retry" @click="emit('refresh')" />
        </template>
      </Result>

      <template v-else>
        <DataTable
          :value="rows"
          :columns="columns"
          :loading="phase === 'loading'"
          :virtual="false"
          :row-key="rowKey ?? 'id'"
          striped
        >
          <template #empty>
            <Empty :description="emptyDescription">
              <Button
                v-if="showCreate !== false"
                severity="primary"
                label="Add"
                @click="emit('create')"
              />
            </Empty>
          </template>
          <slot />
        </DataTable>

        <div v-if="phase === 'ready' && total > 0" class="showcase-pagination">
          <Pagination
            :total="total"
            :page="page"
            :page-size="pageSize"
            @update:page="emit('update:page', $event)"
            @update:page-size="emit('update:pageSize', $event)"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.showcase-filters {
  display: grid;
  grid-template-columns: 1fr minmax(140px, 200px);
  gap: 12px;
  margin-bottom: 16px;
}

.showcase-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .showcase-filters {
    grid-template-columns: 1fr;
  }
}
</style>
