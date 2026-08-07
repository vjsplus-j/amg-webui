<script setup lang="ts">
import { computed } from 'vue'
import { Card, PageHeader } from '@amg-webui/core'
import { Message } from '@amg-webui/overlay'
import { useRouter } from 'vue-router'
import {
  mockGbsDevices,
  mockGbsChannels,
  mockSipStatus
} from '@showcase/shared/mock-api/gb28181'

const router = useRouter()

const onlineDevices = computed(
  () => mockGbsDevices.filter((d) => d.status === 'online').length
)
const streamingChannels = computed(
  () => mockGbsChannels.filter((c) => c.status === 'streaming').length
)
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="GB28181 Center — Overview" />

    <Message severity="info" :closable="false">
      Mock SIP gateway at {{ mockSipStatus.listenIp }}:{{ mockSipStatus.listenPort }}
      ({{ mockSipStatus.transport }})
    </Message>

    <div class="showcase-grid showcase-grid--4">
      <div class="showcase-stat">
        <p class="showcase-stat__label">SIP Local ID</p>
        <p class="showcase-stat__value showcase-stat__value--sm">{{ mockSipStatus.localId }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Registered</p>
        <p class="showcase-stat__value">{{ mockSipStatus.registeredDevices }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Online devices</p>
        <p class="showcase-stat__value">{{ onlineDevices }}</p>
      </div>
      <div class="showcase-stat">
        <p class="showcase-stat__label">Live streams</p>
        <p class="showcase-stat__value">{{ streamingChannels }}</p>
      </div>
    </div>

    <div class="showcase-grid showcase-grid--2">
      <Card title="Navigate">
        <div class="showcase-toolbar">
          <button type="button" class="showcase-link" @click="router.push('/devices')">
            Device list →
          </button>
          <button type="button" class="showcase-link" @click="router.push('/channels')">
            Channel list →
          </button>
          <button type="button" class="showcase-link" @click="router.push('/sip')">
            SIP status →
          </button>
        </div>
      </Card>

      <Card title="Recent alerts">
        <ul class="showcase-list">
          <li>NVR-West-02 heartbeat timeout (18:12)</li>
          <li>IPC-Parking-03 registration in progress</li>
          <li>Gate-A stream started on channel 1</li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.showcase-stat__value--sm {
  font-size: 0.875rem;
  word-break: break-all;
}

.showcase-link {
  padding: 0;
  border: 0;
  background: none;
  color: var(--theme-primary, #2563eb);
  cursor: pointer;
  font: inherit;
}

.showcase-list {
  margin: 0;
  padding-inline-start: 20px;
  color: var(--theme-text-secondary, #64748b);
}
</style>
