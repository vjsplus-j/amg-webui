<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Button,
  Card,
  DataTable,
  PageHeader,
  Popover,
  Tooltip
} from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { listAdminPermissions, type AdminPermission } from '../mock/admin-permissions'

const { t } = useLocale()

const loading = ref(false)
const rows = ref<AdminPermission[]>([])

const columns = computed<Column<AdminPermission>[]>(() => [
  { field: 'key', header: 'Key', sortable: true },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'module', header: 'Module', sortable: true },
  { field: 'risk', header: 'Risk', sortable: true, width: '100px' },
  {
    field: 'updatedAt',
    header: 'Updated',
    render: (value) => new Date(String(value)).toLocaleString()
  },
  { field: 'actions', header: 'Detail', width: '120px', align: 'right' }
])

function riskTooltip(level: AdminPermission['risk']) {
  switch (level) {
    case 'high':
      return 'High risk — grants destructive or privileged actions'
    case 'medium':
      return 'Medium risk — sensitive read or configuration access'
    default:
      return 'Low risk — read-only or limited scope'
  }
}

async function loadPermissions() {
  loading.value = true
  try {
    rows.value = await listAdminPermissions()
  } finally {
    loading.value = false
  }
}

onMounted(loadPermissions)
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Permissions">
      <template #extra>
        <Button
          variant="outlined"
          :label="t(LocaleKeys.button.refresh)"
          @click="loadPermissions"
        />
      </template>
    </PageHeader>

    <Card>
      <DataTable
        :value="rows"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :virtual="false"
      >
        <template #body-key="{ row }">
          <Tooltip :content="(row as AdminPermission).description">
            <code class="permissions-page__code">{{ (row as AdminPermission).key }}</code>
          </Tooltip>
        </template>

        <template #body-risk="{ row }">
          <Tooltip :content="riskTooltip((row as AdminPermission).risk)">
            <span
              class="permissions-page__risk"
              :class="`permissions-page__risk--${(row as AdminPermission).risk}`"
            >
              {{ (row as AdminPermission).risk }}
            </span>
          </Tooltip>
        </template>

        <template #body-actions="{ row }">
          <Popover :title="(row as AdminPermission).name" placement="left">
            <template #trigger>
              <Button size="sm" variant="outlined" label="Details" />
            </template>
            <div class="permissions-page__detail">
              <p><strong>Key:</strong> {{ (row as AdminPermission).key }}</p>
              <p><strong>Module:</strong> {{ (row as AdminPermission).module }}</p>
              <p><strong>Risk:</strong> {{ (row as AdminPermission).risk }}</p>
              <p>{{ (row as AdminPermission).description }}</p>
              <p class="permissions-page__detail-meta">
                Updated {{ new Date((row as AdminPermission).updatedAt).toLocaleString() }}
              </p>
            </div>
          </Popover>
        </template>
      </DataTable>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.permissions-page__code {
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}

.permissions-page__risk {
  text-transform: capitalize;
  font-size: 0.875rem;
  font-weight: 500;
}

.permissions-page__risk--low {
  color: var(--theme-success, #16a34a);
}

.permissions-page__risk--medium {
  color: var(--theme-warning, #d97706);
}

.permissions-page__risk--high {
  color: var(--theme-danger, #dc2626);
}

.permissions-page__detail {
  display: grid;
  gap: 8px;
  max-width: 280px;
  font-size: 0.875rem;
}

.permissions-page__detail-meta {
  margin: 0;
  color: var(--theme-text-secondary, #64748b);
  font-size: 0.8125rem;
}
</style>
