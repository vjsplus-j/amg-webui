<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrDownloadPanelProps, VcrDownloadPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrDownloadPanelProps>(), {
  items: () => [
    { id: 'dl1', name: 'clip-20260714-1000.mp4', progress: 100, status: 'done' },
    { id: 'dl2', name: 'clip-20260714-1030.mp4', progress: 45, status: 'running' },
    { id: 'dl3', name: 'clip-20260714-1100.mp4', progress: 0, status: 'pending' },
  ],
  disabled: false
})
const emit = defineEmits<VcrDownloadPanelEmits>()
const { t } = useLocale()
const statusKey = (s: string) => s === 'done' ? t('industry.vcr.done') : s === 'running' ? t('industry.vcr.running') : t('industry.vcr.pending')
</script>
<template>
  <div :class="['vp-vcr-download-panel', 'vp-vcr-download-panel__panel', props.class]" :style="style" data-component="VcrDownloadPanel">
    <h3 class="vp-vcr-download-panel__title">{{ t('industry.vcr.queue') }}</h3>
    <ul class="vp-vcr-download-panel__list">
      <li v-for="item in items" :key="item.id" class="vp-vcr-download-panel__item">
        <div style="flex:1;min-width:0">
          <div>{{ item.name }}</div>
          <div class="vp-vcr-download-panel__progress"><div class="vp-vcr-download-panel__progress-bar" :style="{ width: item.progress + '%' }" /></div>
        </div>
        <span class="vp-vcr-download-panel__badge">{{ statusKey(item.status) }}</span>
        <button v-if="item.status === 'pending'" type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled" @click="emit('download', item.id)">{{ t('industry.vcr.download') }}</button>
        <button v-else-if="item.status === 'running'" type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled" @click="emit('cancel', item.id)">{{ t('button.cancel') }}</button>
      </li>
    </ul>
  </div>
</template>