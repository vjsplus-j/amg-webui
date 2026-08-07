<script setup lang="ts">
import { computed } from 'vue'
import { Card, PageHeader } from 'amg-webui'
import { mockVideoChannels } from '@showcase/shared/mock-api/video-surveillance'

const liveChannels = computed(() => mockVideoChannels.filter((c) => c.status === 'live'))
</script>

<template>
  <div class="showcase-page">
    <PageHeader title="Video grid">
      <template #extra>
        <span class="showcase-status showcase-status--online">{{ liveChannels.length }} live</span>
      </template>
    </PageHeader>

    <div class="showcase-video-grid">
      <div
        v-for="ch in mockVideoChannels"
        :key="ch.id"
        class="showcase-video-tile"
        :class="{ 'showcase-video-tile--offline': ch.status === 'offline' }"
      >
        <div class="showcase-video-tile__screen" aria-hidden="true" />
        <div class="showcase-video-tile__meta">
          <strong>{{ ch.name }}</strong>
          <span
            class="showcase-status"
            :class="{
              'showcase-status--online': ch.status === 'live',
              'showcase-status--pending': ch.status === 'idle',
              'showcase-status--offline': ch.status === 'offline'
            }"
          >
            {{ ch.status }}
          </span>
          <p>{{ ch.resolution }} · {{ ch.bitrate }}</p>
        </div>
      </div>
    </div>

    <Card title="All channels">
      <ul class="showcase-list">
        <li v-for="ch in mockVideoChannels" :key="ch.id">
          {{ ch.name }} ({{ ch.site }}) — {{ ch.codec }}
        </li>
      </ul>
    </Card>
  </div>
</template>

<style scoped>
.showcase-video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.showcase-video-tile {
  border-radius: var(--theme-radius-md, 8px);
  border: 1px solid var(--theme-border, #e2e8f0);
  background: var(--theme-surface, #fff);
  overflow: hidden;
}

.showcase-video-tile__screen {
  aspect-ratio: 16 / 9;
  background: linear-gradient(
    135deg,
    var(--theme-surface-muted, #1e293b) 0%,
    var(--theme-surface, #334155) 100%
  );
}

.showcase-video-tile--offline .showcase-video-tile__screen {
  opacity: 0.45;
}

.showcase-video-tile__meta {
  padding: 10px 12px;
  font-size: 0.8125rem;
  color: var(--theme-text-secondary, #64748b);
}

.showcase-video-tile__meta strong {
  display: block;
  color: var(--theme-text, #1f2937);
  margin-bottom: 4px;
}

.showcase-list {
  margin: 0;
  padding-inline-start: 20px;
  color: var(--theme-text-secondary, #64748b);
}
</style>
