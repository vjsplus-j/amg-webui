<script setup lang="ts">
import { Card, PageHeader } from 'amg-webui'
import { useRouter } from 'vue-router'
import { mockVideoOverview } from '@showcase/shared/mock-api/video-surveillance'

const router = useRouter()
const overview = mockVideoOverview

const links = [
  { path: '/devices', label: 'Device tree' },
  { path: '/grid', label: 'Video grid' },
  { path: '/player', label: 'Player' },
  { path: '/stream', label: 'Stream info' },
  { path: '/ptz', label: 'PTZ' },
  { path: '/snapshot', label: 'Snapshot' },
  { path: '/recording', label: 'Recording' },
  { path: '/alarms', label: 'Alarms' }
]
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Video Surveillance — Overview" />

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">Live channels</p>
        <p class="showcase-stat__value">{{ overview.liveChannels }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Offline</p>
        <p class="showcase-stat__value">{{ overview.offlineChannels }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">New alarms</p>
        <p class="showcase-stat__value">{{ overview.newAlarms }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Recording</p>
        <p class="showcase-stat__value">{{ overview.activeRecordings }}</p>
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
