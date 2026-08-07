<script setup lang="ts">
import { Card, PageHeader } from '@amg-webui/core'
import { mockSipStatus } from '@showcase/shared/mock-api/gb28181'
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="SIP Signaling Status" />

    <div class="showcase-grid showcase-grid--2">
      <div class="showcase-panel">
        <h3 class="showcase-panel__title">Local SIP identity</h3>
        <dl class="showcase-dl">
          <dt>Local ID</dt>
          <dd>{{ mockSipStatus.localId }}</dd>
          <dt>Domain</dt>
          <dd>{{ mockSipStatus.domain }}</dd>
          <dt>Listen</dt>
          <dd>{{ mockSipStatus.listenIp }}:{{ mockSipStatus.listenPort }}</dd>
          <dt>Transport</dt>
          <dd>{{ mockSipStatus.transport }}</dd>
        </dl>
      </div>

      <div class="showcase-panel">
        <h3 class="showcase-panel__title">Runtime metrics</h3>
        <dl class="showcase-dl">
          <dt>Registered devices</dt>
          <dd>{{ mockSipStatus.registeredDevices }}</dd>
          <dt>Active streams</dt>
          <dd>{{ mockSipStatus.activeStreams }}</dd>
          <dt>Uptime</dt>
          <dd>{{ mockSipStatus.uptime }}</dd>
        </dl>
      </div>
    </div>

    <Card title="Signaling log (mock)">
      <pre class="showcase-log">REGISTER 34020000001320000001 → 200 OK
INVITE 34020000001320000001/01 → 200 OK (SDP)
MESSAGE Keepalive ← 34020000001320000002
REGISTER 34020000001320000004 → timeout
      </pre>
    </Card>
  </div>
</template>

<style scoped>
.showcase-dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  margin: 0;
}

.showcase-dl dt {
  color: var(--theme-text-secondary, #64748b);
  font-size: 0.875rem;
}

.showcase-dl dd {
  margin: 0;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}

.showcase-log {
  margin: 0;
  padding: 12px;
  border-radius: 6px;
  background: var(--theme-surface-muted, #f8fafc);
  font-size: 0.8125rem;
  line-height: 1.6;
  overflow-x: auto;
}
</style>
