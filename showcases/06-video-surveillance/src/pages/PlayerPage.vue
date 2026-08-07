<script setup lang="ts">
import { ref } from 'vue'
import { Button, Card, PageHeader, Select } from 'amg-webui'
import { mockVideoChannels } from '@showcase/shared/mock-api/video-surveillance'

const selected = ref('ch1')
const playing = ref(true)

const channelOptions = mockVideoChannels.map((c) => ({
  label: `${c.name} (${c.status})`,
  value: c.id
}))

const current = () => mockVideoChannels.find((c) => c.id === selected.value)
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Player">
      <template #extra>
        <Select v-model="selected" :options="channelOptions" />
        <Button
          severity="primary"
          :label="playing ? 'Pause' : 'Play'"
          @click="playing = !playing"
        />
      </template>
    </PageHeader>

    <Card :title="current()?.name ?? 'Channel'">
      <div class="showcase-player" :class="{ 'showcase-player--paused': !playing }">
        <span v-if="playing" class="showcase-player__live">LIVE</span>
        <span v-else class="showcase-player__live showcase-player__live--paused">PAUSED</span>
      </div>
      <p class="showcase-player-meta">
        {{ current()?.resolution }} · {{ current()?.codec }} · {{ current()?.bitrate }}
      </p>
    </Card>
  </div>
</template>

<style scoped>
.showcase-player {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: var(--theme-radius-md, 8px);
  background: linear-gradient(
    160deg,
    var(--theme-surface-muted, #0f172a) 0%,
    var(--theme-surface, #1e293b) 100%
  );
  border: 1px solid var(--theme-border, #334155);
}

.showcase-player--paused {
  filter: grayscale(0.6);
}

.showcase-player__live {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: color-mix(in srgb, var(--theme-danger, #dc2626) 85%, transparent);
  color: #fff;
}

.showcase-player__live--paused {
  background: color-mix(in srgb, var(--theme-warning, #d97706) 85%, transparent);
}

.showcase-player-meta {
  margin: 12px 0 0;
  font-size: 0.875rem;
  color: var(--theme-text-secondary, #64748b);
}
</style>
