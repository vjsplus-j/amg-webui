<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoAdjustProps, VideoAdjustEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoAdjustProps>(), { brightness: 100, contrast: 100, saturation: 100, disabled: false })
const emit = defineEmits<VideoAdjustEmits>()
const { t } = useLocale()
const b = ref(props.brightness), c = ref(props.contrast), s = ref(props.saturation)
watch(() => props.brightness, v => { b.value = v ?? 100 })
watch(() => props.contrast, v => { c.value = v ?? 100 })
watch(() => props.saturation, v => { s.value = v ?? 100 })
const filterStyle = { filter: `brightness(${b.value}%) contrast(${c.value}%) saturate(${s.value}%)` }
function emitAll() { emit('change', { brightness: b.value, contrast: c.value, saturation: s.value }) }
function onB(e: Event) { b.value = Number((e.target as HTMLInputElement).value); emit('update:brightness', b.value); emitAll() }
function onC(e: Event) { c.value = Number((e.target as HTMLInputElement).value); emit('update:contrast', c.value); emitAll() }
function onS(e: Event) { s.value = Number((e.target as HTMLInputElement).value); emit('update:saturation', s.value); emitAll() }
</script>
<template>
  <div :class="['vp-video-adjust', props.class]" :style="style" data-component="VideoAdjust">
    <label class="vp-video-adjust__control vp-video-adjust__muted"><span>{{ t('industry.video.brightness') }}</span><input class="vp-video-adjust__range" type="range" min="50" max="150" :value="b" :disabled="disabled" @input="onB" /></label>
    <label class="vp-video-adjust__control vp-video-adjust__muted"><span>{{ t('industry.video.contrast') }}</span><input class="vp-video-adjust__range" type="range" min="50" max="150" :value="c" :disabled="disabled" @input="onC" /></label>
    <label class="vp-video-adjust__control vp-video-adjust__muted"><span>{{ t('industry.video.saturation') }}</span><input class="vp-video-adjust__range" type="range" min="0" max="200" :value="s" :disabled="disabled" @input="onS" /></label>
    <div class="vp-video-adjust__preview" :style="filterStyle"><slot /></div>
  </div>
</template>