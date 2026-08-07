<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrTimelinePlayerProps, VcrTimelinePlayerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrTimelinePlayerProps>(), {
  currentTime: 0,
  duration: 3600,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrTimelinePlayerEmits>()
const { t } = useLocale()
const pos = ref(props.currentTime ?? 0)
let tickTimer: ReturnType<typeof setInterval> | null = null

watch(() => props.currentTime, (v) => { pos.value = v ?? 0 })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.timeline))
const timeLabel = computed(() => `${pos.value} / ${props.duration ?? 0}`)

function onScrub(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  pos.value = v
  emit('update:currentTime', v)
  emit('seek', v)
  trackEmit({ component: 'VcrTimelinePlayer', type: 'seek', trackId: props.trackId, telemetry: props.telemetry })
}

function playTick() {
  if (props.disabled || props.loading) return
  if (tickTimer) clearInterval(tickTimer)
  tickTimer = setInterval(() => {
    if (pos.value < (props.duration ?? 0)) {
      pos.value += 1
      emit('update:currentTime', pos.value)
    }
  }, 1000)
  trackEmit({ component: 'VcrTimelinePlayer', type: 'play', trackId: props.trackId, telemetry: props.telemetry })
}

function stopTick() {
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = null
  }
  trackEmit({ component: 'VcrTimelinePlayer', type: 'pause', trackId: props.trackId, telemetry: props.telemetry })
}

onUnmounted(stopTick)
</script>

<template>
  <section
    :class="['vp-vcr-timeline-player', 'vp-vcr-timeline-player__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-timeline-player-title"
    data-component="VcrTimelinePlayer"
  >
    <header class="vp-vcr-timeline-player__header">
      <h3 id="vp-vcr-timeline-player-title" class="vp-vcr-timeline-player__title">{{ titleText }}</h3>
      <div class="vp-vcr-timeline-player__status" role="status" aria-live="polite">{{ timeLabel }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-timeline-player__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-timeline-player__body">
      <input
        class="vp-vcr-timeline-player__scrubber vp-vcr-timeline-player__timeline"
        type="range"
        :min="0"
        :max="duration"
        :value="pos"
        :disabled="disabled"
        :aria-label="t(LocaleKeys.industry.vcr.currentTime)"
        @input="onScrub"
      />
      <div class="vp-vcr-timeline-player__toolbar">
        <button type="button" class="vp-vcr-timeline-player__btn" :disabled="disabled" @click="playTick">
          {{ t(LocaleKeys.industry.video.play) }}
        </button>
        <button type="button" class="vp-vcr-timeline-player__btn vp-vcr-timeline-player__btn--ghost" :disabled="disabled" @click="stopTick">
          {{ t(LocaleKeys.industry.video.pause) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
