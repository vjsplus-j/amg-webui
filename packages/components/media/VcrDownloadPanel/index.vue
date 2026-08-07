<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrDownloadPanelProps, VcrDownloadPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrDownloadPanelProps>(), {
  items: () => [
    { id: 'dl1', name: 'clip-20260714-1000.mp4', progress: 100, status: 'done' },
    { id: 'dl2', name: 'clip-20260714-1030.mp4', progress: 45, status: 'running' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrDownloadPanelEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.queue))
const isEmpty = computed(() => !props.items?.length)

function download(id: string) {
  if (props.disabled || props.loading) return
  emit('download', id)
  trackEmit({ component: 'VcrDownloadPanel', type: 'download', trackId: props.trackId, telemetry: props.telemetry })
}

function cancel(id: string) {
  if (props.disabled || props.loading) return
  emit('cancel', id)
  trackEmit({ component: 'VcrDownloadPanel', type: 'cancel', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-vcr-download-panel', 'vp-vcr-download-panel__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-download-panel-title"
    data-component="VcrDownloadPanel"
  >
    <header class="vp-vcr-download-panel__header">
      <h3 id="vp-vcr-download-panel-title" class="vp-vcr-download-panel__title">{{ titleText }}</h3>
      <div class="vp-vcr-download-panel__status" role="status" aria-live="polite">{{ items?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-download-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-download-panel__body">
      <div class="vp-vcr-download-panel__toolbar">
        <button type="button" class="vp-vcr-download-panel__btn" :disabled="disabled || isEmpty" @click="items?.[0] && download(items[0].id)">
          {{ t(LocaleKeys.industry.vcr.download) }}
        </button>
        <button type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled || isEmpty" @click="items?.[0] && cancel(items[0].id)">
          {{ t(LocaleKeys.button.cancel) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-download-panel__empty" role="status">{{ t(LocaleKeys.industry.common.noQueue) }}</p>
      <ul v-else class="vp-vcr-download-panel__list" role="list">
        <li v-for="item in items" :key="item.id" class="vp-vcr-download-panel__item">
          <span>{{ item.name }}</span>
          <div class="vp-vcr-download-panel__progress"><div class="vp-vcr-download-panel__progress-bar" :style="{ width: item.progress + '%' }" /></div>
          <button type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled" @click="download(item.id)">
            {{ t(LocaleKeys.industry.vcr.download) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
