<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrStorageDashboardProps, VcrStorageDashboardEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrStorageDashboardProps>(), {
  volumes: () => [
    { id: 'v1', name: 'RAID-01', used: 7200, total: 10000 },
    { id: 'v2', name: 'RAID-02', used: 3100, total: 8000 },
  ],
  disabled: false
})
const emit = defineEmits<VcrStorageDashboardEmits>()
const { t } = useLocale()
function pct(v: { used: number; total: number }) { return v.total ? Math.round((v.used / v.total) * 100) : 0 }
</script>
<template>
  <div :class="['vp-vcr-storage-dashboard', 'vp-vcr-storage-dashboard__panel', props.class]" :style="style" data-component="VcrStorageDashboard">
    <div class="vp-vcr-storage-dashboard__toolbar">
      <h3 class="vp-vcr-storage-dashboard__title">{{ t('industry.vcr.storage') }}</h3>
      <button type="button" class="vp-vcr-storage-dashboard__btn vp-vcr-storage-dashboard__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <ul class="vp-vcr-storage-dashboard__list">
      <li v-for="v in volumes" :key="v.id" class="vp-vcr-storage-dashboard__item" style="flex-direction:column;align-items:stretch">
        <div class="vp-vcr-storage-dashboard__toolbar" style="justify-content:space-between">
          <span>{{ v.name }}</span>
          <span class="vp-vcr-storage-dashboard__muted">{{ t('industry.vcr.used') }} {{ v.used }}GB / {{ t('industry.vcr.total') }} {{ v.total }}GB ({{ pct(v) }}%)</span>
        </div>
        <div class="vp-vcr-storage-dashboard__progress"><div class="vp-vcr-storage-dashboard__progress-bar" :style="{ width: pct(v) + '%' }" /></div>
      </li>
    </ul>
  </div>
</template>