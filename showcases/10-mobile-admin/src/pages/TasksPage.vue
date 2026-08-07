<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button, Empty, PageHeader } from '@amg-webui/core'
import { MockCrudAdapter, createSeed } from '@showcase/shared/mock-api/adapter'
import type { FetchPhase, MockRecord } from '@showcase/shared/mock-api/types'

const phase = ref<FetchPhase>('idle')
const rows = ref<MockRecord[]>([])

const adapter = new MockCrudAdapter({ seed: createSeed('Mobile Task') })

async function loadRows() {
  phase.value = 'loading'
  try {
    const data = await adapter.list()
    rows.value = data
    phase.value = data.length ? 'ready' : 'empty'
  } catch {
    rows.value = []
    phase.value = 'error'
  }
}

onMounted(loadRows)
</script>

<template>
  <div class="showcase-page showcase-page--mobile">
    <PageHeader title="Tasks">
      <template #extra>
        <Button size="sm" variant="outlined" label="Refresh" @click="loadRows" />
      </template>
    </PageHeader>

    <Empty v-if="phase === 'empty'" description="No tasks" />
    <p v-else-if="phase === 'loading'" class="showcase-page__lead">Loading…</p>

    <div v-else class="showcase-mobile-cards">
      <article v-for="row in rows" :key="row.id" class="showcase-mobile-card">
        <div class="showcase-mobile-card__row">
          <strong>{{ row.name }}</strong>
          <span
            class="showcase-status"
            :class="
              row.status === 'active'
                ? 'showcase-status--online'
                : 'showcase-status--offline'
            "
          >
            {{ row.status }}
          </span>
        </div>
        <p class="showcase-mobile-card__meta">
          Updated {{ new Date(row.updatedAt).toLocaleString() }}
        </p>
        <div class="showcase-toolbar">
          <Button size="sm" variant="outlined" label="Open" />
          <Button size="sm" severity="danger" variant="outlined" label="Archive" />
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.showcase-page--mobile {
  padding-inline: 12px;
}

.showcase-mobile-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.showcase-mobile-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
