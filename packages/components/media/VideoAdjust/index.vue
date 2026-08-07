<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoAdjustProps, VideoAdjustEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoAdjustProps>(), {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoAdjustEmits>()
const { t } = useLocale()
const b = ref(props.brightness ?? 100)
const c = ref(props.contrast ?? 100)
const s = ref(props.saturation ?? 100)

watch(() => props.brightness, (v) => { b.value = v ?? 100 })
watch(() => props.contrast, (v) => { c.value = v ?? 100 })
watch(() => props.saturation, (v) => { s.value = v ?? 100 })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.brightness))

function emitChange() {
  emit('change', { brightness: b.value, contrast: c.value, saturation: s.value })
  trackEmit({ component: 'VideoAdjust', type: 'change', trackId: props.trackId, telemetry: props.telemetry })
}

function patch(field: 'brightness' | 'contrast' | 'saturation', e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  if (field === 'brightness') { b.value = v; emit('update:brightness', v) }
  if (field === 'contrast') { c.value = v; emit('update:contrast', v) }
  if (field === 'saturation') { s.value = v; emit('update:saturation', v) }
  emitChange()
}

function resetAdjust() {
  if (props.disabled || props.loading) return
  b.value = 100
  c.value = 100
  s.value = 100
  emit('update:brightness', 100)
  emit('update:contrast', 100)
  emit('update:saturation', 100)
  emitChange()
  trackEmit({ component: 'VideoAdjust', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-video-adjust', 'vp-video-adjust__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-adjust-title"
    data-component="VideoAdjust"
  >
    <header class="vp-video-adjust__header">
      <h3 id="vp-video-adjust-title" class="vp-video-adjust__title">{{ titleText }}</h3>
      <div class="vp-video-adjust__status" role="status" aria-live="polite">{{ b }} / {{ c }} / {{ s }}</div>
    </header>
    <div v-if="loading" class="vp-video-adjust__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-adjust__body">
      <label class="vp-video-adjust__control">
        <span class="vp-video-adjust__label">{{ t(LocaleKeys.industry.video.brightness) }}</span>
        <input class="vp-video-adjust__range" type="range" min="0" max="200" :value="b" :disabled="disabled" @input="patch('brightness', $event)" />
      </label>
      <label class="vp-video-adjust__control">
        <span class="vp-video-adjust__label">{{ t(LocaleKeys.industry.video.contrast) }}</span>
        <input class="vp-video-adjust__range" type="range" min="0" max="200" :value="c" :disabled="disabled" @input="patch('contrast', $event)" />
      </label>
      <label class="vp-video-adjust__control">
        <span class="vp-video-adjust__label">{{ t(LocaleKeys.industry.video.saturation) }}</span>
        <input class="vp-video-adjust__range" type="range" min="0" max="200" :value="s" :disabled="disabled" @input="patch('saturation', $event)" />
      </label>
      <div class="vp-video-adjust__toolbar">
        <button type="button" class="vp-video-adjust__btn" :disabled="disabled" @click="emitChange">{{ t(LocaleKeys.button.confirm) }}</button>
        <button type="button" class="vp-video-adjust__btn vp-video-adjust__btn--ghost" :disabled="disabled" @click="resetAdjust">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
