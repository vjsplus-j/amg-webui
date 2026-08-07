<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsStatusCardProps, GbsStatusCardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsStatusCardProps>(), {
  registered: true,
  deviceCount: 12,
  channelCount: 48,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsStatusCardEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.status))
const sipLabel = computed(() =>
  props.registered ? t(LocaleKeys.industry.gbs.registered) : t(LocaleKeys.industry.gbs.unregistered)
)

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({ component: 'GbsStatusCard', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

function copyStats() {
  trackEmit({ component: 'GbsStatusCard', type: 'copy', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-gbs-status-card', 'vp-gbs-status-card__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-status-card-title"
    data-component="GbsStatusCard"
  >
    <header class="vp-gbs-status-card__header">
      <h3 id="vp-gbs-status-card-title" class="vp-gbs-status-card__title">{{ titleText }}</h3>
      <div class="vp-gbs-status-card__status" role="status" aria-live="polite">
        <span :class="['vp-gbs-status-card__badge', registered ? 'vp-gbs-status-card__badge--on' : 'vp-gbs-status-card__badge--off']">
          {{ sipLabel }}
        </span>
      </div>
    </header>
    <div v-if="loading" class="vp-gbs-status-card__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-status-card__body">
      <div class="vp-gbs-status-card__stats">
        <div class="vp-gbs-status-card__stat">
          <span class="vp-gbs-status-card__label">{{ t(LocaleKeys.industry.gbs.deviceCount) }}</span>
          <span class="vp-gbs-status-card__stat-value">{{ deviceCount }}</span>
        </div>
        <div class="vp-gbs-status-card__stat">
          <span class="vp-gbs-status-card__label">{{ t(LocaleKeys.industry.gbs.channelCount) }}</span>
          <span class="vp-gbs-status-card__stat-value">{{ channelCount }}</span>
        </div>
      </div>
      <div class="vp-gbs-status-card__toolbar">
        <button type="button" class="vp-gbs-status-card__btn" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-gbs-status-card__btn vp-gbs-status-card__btn--ghost" :disabled="disabled" @click="copyStats">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
