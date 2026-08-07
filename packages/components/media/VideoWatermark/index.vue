<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoWatermarkProps, VideoWatermarkEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoWatermarkProps>(), {
  text: 'AMG-WebUI',
  opacity: 0.5,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoWatermarkEmits>()
const { t } = useLocale()
const local = ref(props.text ?? '')

watch(() => props.text, (v) => { local.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.watermarkText))
const previewStyle = computed(() => ({ opacity: String(props.opacity ?? 0.5) }))

function onText(e: Event) {
  const v = (e.target as HTMLInputElement).value
  local.value = v
  emit('update:text', v)
  emit('change', v)
  trackEmit({ component: 'VideoWatermark', type: 'change', trackId: props.trackId, telemetry: props.telemetry })
}

function resetText() {
  if (props.disabled || props.loading) return
  local.value = props.text ?? ''
  emit('update:text', local.value)
  trackEmit({ component: 'VideoWatermark', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-video-watermark', 'vp-video-watermark__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-watermark-title"
    data-component="VideoWatermark"
  >
    <header class="vp-video-watermark__header">
      <h3 id="vp-video-watermark-title" class="vp-video-watermark__title">{{ titleText }}</h3>
      <div class="vp-video-watermark__status" role="status" aria-live="polite">{{ local || t(LocaleKeys.industry.common.noData) }}</div>
    </header>
    <div v-if="loading" class="vp-video-watermark__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-watermark__body">
      <label class="vp-video-watermark__field">
        <span class="vp-video-watermark__label">{{ t(LocaleKeys.industry.video.watermarkText) }}</span>
        <input class="vp-video-watermark__input" :value="local" :disabled="disabled" @input="onText" />
      </label>
      <div class="vp-video-watermark__preview" :style="previewStyle" aria-hidden="true">{{ local }}</div>
      <div class="vp-video-watermark__toolbar">
        <button type="button" class="vp-video-watermark__btn" :disabled="disabled" @click="emit('change', local)">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
        <button type="button" class="vp-video-watermark__btn vp-video-watermark__btn--ghost" :disabled="disabled" @click="resetText">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
