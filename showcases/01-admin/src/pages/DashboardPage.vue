<script setup lang="ts">
import { computed } from 'vue'
import { Card, DataTable, PageHeader } from 'amg-webui'
import type { Column } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockGbsDevices, mockSipStatus } from '@showcase/shared/mock-api/gb28181'

const router = useRouter()

const onlineCount = computed(
  () => mockGbsDevices.filter((d) => d.status === 'online').length
)

const recentDevices = computed(() =>
  mockGbsDevices.slice(0, 3).map((d) => ({
    ...d,
    lastHeartbeat: new Date(d.lastHeartbeat).toLocaleString()
  }))
)

const columns = computed<Column<(typeof recentDevices.value)[0]>[]>(() => [
  { field: 'name', header: 'Device' },
  { field: 'ip', header: 'IP' },
  { field: 'status', header: 'Status' },
  { field: 'channelCount', header: 'Channels' }
])
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Dashboard">
      <template #extra>
        <span class="showcase-status showcase-status--online">SIP running</span>
      </template>
    </PageHeader>

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Registered devices</p>
        <p class="showcase-stat__value">{{ mockSipStatus.registeredDevices }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Online now</p>
        <p class="showcase-stat__value">{{ onlineCount }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Active streams</p>
        <p class="showcase-stat__value">{{ mockSipStatus.activeStreams }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">SIP uptime</p>
        <p class="showcase-stat__value">{{ mockSipStatus.uptime }}</p>
      </div>
    </div>

    <div class="showcase-grid showcase-grid--2">
      <Card title="Quick actions">
        <div class="showcase-toolbar">
          <button type="button" class="showcase-link" @click="router.push('/devices')">
            Device list →
          </button>
          <button type="button" class="showcase-link" @click="router.push('/channels')">
            Channels →
          </button>
          <button type="button" class="showcase-link" @click="router.push('/users')">
            User admin →
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

    <Card title="Recent device activity">
      <DataTable
        :value="recentDevices"
        :columns="columns"
        row-key="id"
        :virtual="false"
      />
    </Card>
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
