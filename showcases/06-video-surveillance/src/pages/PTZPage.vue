<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, PageHeader } from 'amg-webui'

const lastAction = ref('—')

const directions = [
  { label: 'Up', action: 'tilt-up' },
  { label: 'Down', action: 'tilt-down' },
  { label: 'Left', action: 'pan-left' },
  { label: 'Right', action: 'pan-right' },
  { label: 'Zoom +', action: 'zoom-in' },
  { label: 'Zoom −', action: 'zoom-out' }
]

function send(action: string) {
  lastAction.value = action
}
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="PTZ control">
      <template #extra>
        <span class="showcase-status showcase-status--online">Gate PTZ</span>
      </template>
    </PageHeader>

    <div class="showcase-grid showcase-grid--2">
      <Card title="Pan / tilt / zoom">
        <div class="showcase-ptz-pad">
          <Button
            v-for="d in directions"
            :key="d.action"
            variant="outlined"
            :label="d.label"
            @click="send(d.action)"
          />
        </div>
        <p class="showcase-meta">Last command: {{ lastAction }}</p>
      </Card>

      <Card title="Presets">
        <div class="showcase-toolbar">
          <Button variant="outlined" label="Preset 1 — Entry" @click="send('preset-1')" />
          <Button variant="outlined" label="Preset 2 — Gate" @click="send('preset-2')" />
          <Button variant="outlined" label="Home" @click="send('home')" />
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.showcase-ptz-pad {
  display: grid;
  grid-template-columns: repeat(3, minmax(80px, 1fr));
  gap: 8px;
}

.showcase-meta {
  margin: 12px 0 0;
  font-size: 0.8125rem;
  color: var(--theme-text-secondary, #64748b);
}
</style>
