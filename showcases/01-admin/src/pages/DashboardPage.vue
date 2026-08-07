<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Card, DataTable, Skeleton } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRouter } from 'vue-router'
import AdminPageChrome from '../components/AdminPageChrome.vue'
import { queryAdminAudit } from '../mock/admin-audit'
import { listAdminUsers } from '../mock/admin-users'
import { queryAdminRoles } from '../mock/admin-roles'

const router = useRouter()
const loading = ref(true)

const stats = ref({
  users: 0,
  roles: 0,
  auditEvents: 0,
  activeUsers: 0
})

const recentAudit = ref<
  { id: string; actor: string; action: string; createdAt: string }[]
>([])

const columns = computed<Column<(typeof recentAudit.value)[0]>[]>(() => [
  { field: 'createdAt', header: 'Time', render: (v) => new Date(String(v)).toLocaleString() },
  { field: 'actor', header: 'Actor' },
  { field: 'action', header: 'Action' }
])

onMounted(async () => {
  loading.value = true
  try {
    const [users, rolesResult, auditRows] = await Promise.all([
      listAdminUsers(),
      queryAdminRoles({ page: 1, pageSize: 1 }),
      queryAdminAudit()
    ])
    stats.value = {
      users: users.length,
      roles: rolesResult.total,
      auditEvents: auditRows.length,
      activeUsers: users.filter((u) => u.status === 'active').length
    }
    recentAudit.value = auditRows.slice(0, 5).map((row) => ({
      id: row.id,
      actor: row.actor,
      action: row.action,
      createdAt: row.createdAt
    }))
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="showcase-page">
    <AdminPageChrome title="Dashboard" />

    <template v-if="loading">
      <div class="showcase-grid showcase-grid--4">
        <Card v-for="n in 4" :key="n" title=" ">
          <Skeleton :rows="2" variant="text" />
        </Card>
      </div>
      <Card title=" ">
        <Skeleton variant="card-table" :rows="4" />
      </Card>
    </template>

    <template v-else>
      <div class="showcase-grid showcase-grid--4">
        <div class="showcase-stat">
          <p class="showcase-stat__label">Total users</p>
          <p class="showcase-stat__value">{{ stats.users }}</p>
        </div>
        <div class="showcase-stat">
          <p class="showcase-stat__label">Active users</p>
          <p class="showcase-stat__value">{{ stats.activeUsers }}</p>
        </div>
        <div class="showcase-stat">
          <p class="showcase-stat__label">Roles</p>
          <p class="showcase-stat__value">{{ stats.roles }}</p>
        </div>
        <div class="showcase-stat">
          <p class="showcase-stat__label">Recent audit events</p>
          <p class="showcase-stat__value">{{ stats.auditEvents }}</p>
        </div>
      </div>

      <div class="showcase-grid showcase-grid--2">
        <Card title="Quick actions">
          <div class="showcase-toolbar">
            <button type="button" class="showcase-link" @click="router.push('/users')">
              User list →
            </button>
            <button type="button" class="showcase-link" @click="router.push('/users/create')">
              Create user →
            </button>
            <button type="button" class="showcase-link" @click="router.push('/audit')">
              Audit log →
            </button>
            <button type="button" class="showcase-link" @click="router.push('/settings')">
              Settings →
            </button>
          </div>
        </Card>

        <Card title="System">
          <ul class="showcase-settings-list">
            <li>Session timeout: 30 min</li>
            <li>Audit log retention: 90 days</li>
            <li>Default locale: zh-CN</li>
          </ul>
          <button type="button" class="showcase-link" @click="router.push('/settings')">
            Open settings →
          </button>
        </Card>
      </div>

      <Card title="Recent audit activity">
        <DataTable
          :value="recentAudit"
          :columns="columns"
          row-key="id"
          :virtual="false"
        />
      </Card>
    </template>
  </div>
</template>

<style scoped>
.showcase-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}

.showcase-settings-list {
  margin: 0 0 12px;
  padding-inline-start: 20px;
  color: var(--theme-text-secondary, #64748b);
}
</style>
