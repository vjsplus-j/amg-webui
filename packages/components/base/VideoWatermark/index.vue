<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoWatermarkProps, VideoWatermarkEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoWatermarkProps>(), { text: 'AMG-WebUI', opacity: 0.5, disabled: false })
const emit = defineEmits<VideoWatermarkEmits>()
const { t } = useLocale()
const local = ref(props.text)
watch(() => props.text, v => { local.value = v ?? '' })
function onInput(e: Event) { const v = (e.target as HTMLInputElement).value; local.value = v; emit('update:text', v); emit('change', v) }
</script>
<template>
  <div :class="['vp-video-watermark', props.class]" :style="style" data-component="VideoWatermark">
    <label class="vp-video-watermark__muted">{{ t('industry.video.watermarkText') }}
      <input class="vp-video-watermark__input" type="text" :value="local" :disabled="disabled" @input="onInput" />
    </label>
    <div class="vp-video-watermark__preview" :style="{ opacity: String(opacity) }">
      <slot><span>{{ local }}</span></slot>
    </div>
  </div>
</template>