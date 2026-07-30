<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoVolumeProps, VideoVolumeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoVolumeProps>(), {
  modelValue: 1,
  muted: false,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoVolumeEmits>()
const { t } = useLocale()
const vol = ref(props.modelValue ?? 1)

watch(() => props.modelValue, (v) => { vol.value = v ?? 1 })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.volume))
const statusLabel = computed(() => (props.muted ? t(LocaleKeys.industry.video.mute) : String(Math.round(vol.value * 100))))

function onVolume(e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  vol.value = v
  emit('update:modelValue', v)
  emit('change', v)
  trackEmit({ component: 'VideoVolume', type: 'change', trackId: props.trackId, telemetry: props.telemetry })
}

function toggleMute() {
  if (props.disabled || props.loading) return
  emit('update:muted', !props.muted)
  trackEmit({ component: 'VideoVolume', type: 'mute', trackId: props.trackId, telemetry: props.telemetry })
}

function resetVolume() {
  if (props.disabled || props.loading) return
  vol.value = 1
  emit('update:modelValue', 1)
  emit('change', 1)
  trackEmit({ component: 'VideoVolume', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-video-volume', 'vp-video-volume__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-volume-title"
    data-component="VideoVolume"
  >
    <header class="vp-video-volume__header">
      <h3 id="vp-video-volume-title" class="vp-video-volume__title">{{ titleText }}</h3>
      <div class="vp-video-volume__status" role="status" aria-live="polite">{{ statusLabel }}</div>
    </header>
    <div v-if="loading" class="vp-video-volume__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-volume__body">
      <input
        class="vp-video-volume__range"
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="vol"
        :disabled="disabled || muted"
        :aria-label="t(LocaleKeys.industry.video.volume)"
        @input="onVolume"
      />
      <div class="vp-video-volume__toolbar">
        <button type="button" class="vp-video-volume__btn" :disabled="disabled" :aria-pressed="muted" @click="toggleMute">
          {{ muted ? t(LocaleKeys.industry.video.unmute) : t(LocaleKeys.industry.video.mute) }}
        </button>
        <button type="button" class="vp-video-volume__btn vp-video-volume__btn--ghost" :disabled="disabled" @click="resetVolume">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
