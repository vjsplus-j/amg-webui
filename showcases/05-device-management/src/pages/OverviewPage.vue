<script setup lang="ts">
import { Card, PageHeader } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockIotOnlineSummary } from '@showcase/shared/mock-api/device-mgmt'

const router = useRouter()
const summary = mockIotOnlineSummary

const links = [
  { path: '/devices', label: 'Device list' },
  { path: '/online', label: 'Online status' },
  { path: '/groups', label: 'Groups' },
  { path: '/telemetry', label: 'Telemetry' },
  { path: '/alarms', label: 'Alarms' },
  { path: '/operations', label: 'Operations' }
]
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Device Management — Overview" />

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Online</p>
        <p class="showcase-stat__value">{{ summary.online }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Offline</p>
        <p class="showcase-stat__value">{{ summary.offline }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Sleep</p>
        <p class="showcase-stat__value">{{ summary.sleep }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Open alarms</p>
        <p class="showcase-stat__value">{{ summary.openAlarms }}</p>
      </div>
    </div>

    <Card title="Navigate">
      <div class="showcase-toolbar">
        <button
          v-for="item in links"
          :key="item.path"
          type="button"
          class="showcase-link"
          @click="router.push(item.path)"
        >
          {{ item.label }} →
        </button>
      </div>
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
</style>
