<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrStorageDashboardProps, VcrStorageDashboardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrStorageDashboardProps>(), {
  volumes: () => [
    { id: 'v1', name: 'RAID-01', used: 7200, total: 10000 },
    { id: 'v2', name: 'RAID-02', used: 3100, total: 8000 }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrStorageDashboardEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.storage))
const isEmpty = computed(() => !props.volumes?.length)

function pct(used: number, total: number) {
  return total ? Math.round((used / total) * 100) : 0
}

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({ component: 'VcrStorageDashboard', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

function exportStats() {
  trackEmit({ component: 'VcrStorageDashboard', type: 'export', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-storage-dashboard', 'vp-vcr-storage-dashboard__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-storage-dashboard-title"
    data-component="VcrStorageDashboard"
  >
    <header class="vp-vcr-storage-dashboard__header">
      <h3 id="vp-vcr-storage-dashboard-title" class="vp-vcr-storage-dashboard__title">{{ titleText }}</h3>
      <div class="vp-vcr-storage-dashboard__status" role="status" aria-live="polite">{{ volumes?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-storage-dashboard__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-storage-dashboard__body">
      <div class="vp-vcr-storage-dashboard__toolbar">
        <button type="button" class="vp-vcr-storage-dashboard__btn" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-vcr-storage-dashboard__btn vp-vcr-storage-dashboard__btn--ghost" :disabled="disabled" @click="exportStats">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-storage-dashboard__empty" role="status">{{ t(LocaleKeys.industry.common.noData) }}</p>
      <div v-else class="vp-vcr-storage-dashboard__stats">
        <div v-for="vol in volumes" :key="vol.id" class="vp-vcr-storage-dashboard__stat">
          <span class="vp-vcr-storage-dashboard__label">{{ vol.name }}</span>
          <span class="vp-vcr-storage-dashboard__stat-value">{{ pct(vol.used, vol.total) }}%</span>
          <div class="vp-vcr-storage-dashboard__progress"><div class="vp-vcr-storage-dashboard__progress-bar" :style="{ width: pct(vol.used, vol.total) + '%' }" /></div>
          <span class="vp-vcr-storage-dashboard__muted">{{ t(LocaleKeys.industry.vcr.used) }} / {{ t(LocaleKeys.industry.vcr.total) }}</span>
        </div>
      </div>
      <slot />
    </div>
  </section>
</template>
