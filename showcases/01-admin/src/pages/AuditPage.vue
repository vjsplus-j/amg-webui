<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Button,
  Card,
  DataTable,
  Empty,
  Loading,
  Result
} from 'amg-webui'
import type { Column } from 'amg-webui'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import AdminPageChrome from '../components/AdminPageChrome.vue'
import {
  queryAdminAudit,
  setForceAuditEmpty,
  setForceAuditError,
  type AdminAuditEntry
} from '../mock/admin-audit'

type FetchPhase = 'idle' | 'loading' | 'ready' | 'error'

const { t } = useLocale()

const phase = ref<FetchPhase>('idle')
const errorMessage = ref('')
const rows = ref<AdminAuditEntry[]>([])

const columns = computed<Column<AdminAuditEntry>[]>(() => [
  { field: 'createdAt', header: 'Time', render: (v) => new Date(String(v)).toLocaleString() },
  { field: 'actor', header: 'Actor', sortable: true },
  { field: 'action', header: 'Action', sortable: true },
  { field: 'resource', header: 'Resource' },
  { field: 'ip', header: 'IP', width: '120px' },
  { field: 'result', header: 'Result', width: '100px' }
])

async function loadAudit() {
  phase.value = 'loading'
  errorMessage.value = ''
  try {
    rows.value = await queryAdminAudit()
    phase.value = 'ready'
  } catch (error) {
    phase.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load audit log'
  }
}

function simulateEmpty() {
  setForceAuditEmpty(true)
  setForceAuditError(false)
  void loadAudit()
}

function simulateError() {
  setForceAuditError(true)
  setForceAuditEmpty(false)
  void loadAudit()
}

function resetSimulation() {
  setForceAuditEmpty(false)
  setForceAuditError(false)
  void loadAudit()
}

onMounted(loadAudit)
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome title="Audit log">
      <template #extra>
        <div class="showcase-toolbar">
          <Button variant="outlined" label="Simulate empty" @click="simulateEmpty" />
          <Button variant="outlined" label="Simulate error" @click="simulateError" />
          <Button variant="outlined" label="Reset" @click="resetSimulation" />
          <Button
            variant="outlined"
            :label="t(LocaleKeys.button.refresh)"
            @click="loadAudit"
          />
        </div>
      </template>
    </AdminPageChrome>

    <Card>
      <Loading v-if="phase === 'loading'" :fullscreen="false" text="Loading audit events…" />

      <Result
        v-if="phase === 'error'"
        status="error"
        title="Failed to load audit log"
        :sub-title="errorMessage"
      >
        <template #extra>
          <Button severity="primary" label="Retry" @click="loadAudit" />
        </template>
      </Result>

      <DataTable
        v-else
        :value="rows"
        :columns="columns"
        :loading="phase === 'loading'"
        row-key="id"
        :virtual="false"
        striped
      >
        <template #empty>
          <Empty description="No audit events recorded for the selected window.">
            <Button severity="primary" label="Refresh" @click="loadAudit" />
          </Empty>
        </template>
        <template #body-result="{ row }">
          <span
            class="audit-page__result"
            :class="{
              'audit-page__result--success': (row as AdminAuditEntry).result === 'success',
              'audit-page__result--failure': (row as AdminAuditEntry).result === 'failure'
            }"
          >
            {{ (row as AdminAuditEntry).result }}
          </span>
        </template>
      </DataTable>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.audit-page__result {
  text-transform: capitalize;
  font-weight: 600;
}

.audit-page__result--success {
  color: var(--theme-success, #16a34a);
}

.audit-page__result--failure {
  color: var(--theme-danger, #dc2626);
}
</style>
