#!/usr/bin/env node
/** Part 3: remaining video controls + ONVIF + GBS + VCR */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BASE = path.join(ROOT, 'packages/components/base')

function write(comp, files) {
  const dir = path.join(BASE, comp)
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, name), content, 'utf8')
  }
  console.log(`✓ ${comp}`)
}

const S = (pfx) => `.${pfx} {
  color: var(--text-primary); font-size: var(--font-size-md); line-height: var(--line-height-body);
  &__title { margin: 0 0 var(--spacing-sm); font-size: var(--font-size-lg); font-weight: 600; }
  &__body { display: flex; flex-direction: column; gap: var(--spacing-md); }
  &__panel { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); }
  &__muted { color: var(--text-secondary); font-size: var(--font-size-sm); }
  &__toolbar { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; }
  &__btn { appearance: none; border: 1px solid transparent; background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-radius: var(--theme-btn-radius, var(--border-radius-md)); height: var(--height-md, 2.25rem); padding: 0 var(--spacing-lg); cursor: pointer; font-size: var(--font-size-sm); }
  &__btn:disabled { opacity: 0.55; cursor: not-allowed; }
  &__btn--ghost { background: transparent; border-color: var(--ds-border, var(--border-color)); color: var(--text-primary); }
  &__input, &__select { flex: 1; min-width: 6rem; height: var(--height-md, 2.25rem); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-input-radius, var(--border-radius-md)); padding: 0 var(--spacing-md); background: var(--surface-0, var(--surface-1)); color: var(--text-primary); font-size: var(--font-size-sm); }
  &__range { flex: 1; accent-color: var(--primary-500); }
  &__table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
  &__table th, &__table td { border: 1px solid var(--ds-border, var(--border-color)); padding: var(--spacing-sm) var(--spacing-md); text-align: left; }
  &__table th { background: var(--surface-2, var(--surface-1)); font-weight: 600; }
  &__badge { display: inline-block; padding: 0 var(--spacing-sm); border-radius: var(--border-radius-sm, var(--border-radius-md)); font-size: var(--font-size-xs); }
  &__badge--on { background: var(--primary-100, var(--primary-500)); color: var(--primary-700, var(--primary-500)); }
  &__badge--off { background: var(--surface-2, var(--surface-1)); color: var(--text-secondary); }
  &__progress { height: var(--spacing-sm); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); overflow: hidden; }
  &__progress-bar { height: 100%; background: var(--primary-500); }
  &__list { list-style: none; margin: 0; padding: 0; max-height: 12rem; overflow: auto; }
  &__log { font-family: var(--font-family-mono, monospace); font-size: var(--font-size-xs); padding: var(--spacing-xs) 0; border-bottom: 1px solid var(--ds-border, var(--border-color)); }
  &__grid-schedule { display: grid; grid-template-columns: repeat(24, 1fr); gap: 1px; }
  &__slot { aspect-ratio: 1; background: var(--surface-2, var(--surface-1)); border: none; cursor: pointer; padding: 0; }
  &__slot--on { background: var(--primary-400, var(--primary-500)); opacity: 0.7; }
  &__modal { position: fixed; inset: 0; background: color-mix(in srgb, var(--surface-0, var(--surface-1)) 40%, transparent); display: flex; align-items: center; justify-content: center; z-index: 100; }
  &__dialog { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); max-width: 24rem; width: 90%; }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

// VideoWatermark
write('VideoWatermark', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VideoWatermarkProps extends BaseProps { text?: string; opacity?: number; disabled?: boolean }
export interface VideoWatermarkEmits { (e: 'update:text', v: string): void; (e: 'change', v: string): void }
`,
  'index.vue': `<script setup lang="ts">
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
</template>`,
  'style.scss': S('vp-video-watermark') + `.vp-video-watermark__preview { padding: var(--spacing-lg); background: var(--surface-2, var(--surface-1)); text-align: center; font-size: var(--font-size-lg); color: var(--text-secondary); border-radius: var(--border-radius-sm, var(--border-radius-md)); }`,
})

// VideoSnapshot
write('VideoSnapshot', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VideoSnapshotProps extends BaseProps { videoRef?: HTMLVideoElement | null; disabled?: boolean }
export interface VideoSnapshotEmits { (e: 'capture', dataUrl: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoSnapshotProps, VideoSnapshotEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoSnapshotProps>(), { disabled: false })
const emit = defineEmits<VideoSnapshotEmits>()
const { t } = useLocale()
const preview = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
function capture() {
  if (props.disabled) return
  const v = props.videoRef
  const c = canvasRef.value
  if (!v || !c || !v.videoWidth) return
  c.width = v.videoWidth; c.height = v.videoHeight
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.drawImage(v, 0, 0)
  preview.value = c.toDataURL('image/png')
  emit('capture', preview.value)
}
</script>
<template>
  <div :class="['vp-video-snapshot', props.class]" :style="style" data-component="VideoSnapshot">
    <button type="button" class="vp-video-snapshot__btn" :disabled="disabled" @click="capture">{{ t('industry.video.capture') }}</button>
    <canvas ref="canvasRef" class="vp-video-snapshot__canvas" aria-hidden="true" />
    <img v-if="preview" class="vp-video-snapshot__preview" :src="preview" :alt="t('industry.video.snapshot')" />
  </div>
</template>`,
  'style.scss': S('vp-video-snapshot') + `.vp-video-snapshot__canvas { display: none; } .vp-video-snapshot__preview { max-width: 100%; border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--border-radius-sm, var(--border-radius-md)); margin-top: var(--spacing-md); }`,
})

// VideoVolume
write('VideoVolume', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VideoVolumeProps extends BaseProps { modelValue?: number; muted?: boolean; disabled?: boolean }
export interface VideoVolumeEmits { (e: 'update:modelValue', v: number): void; (e: 'update:muted', v: boolean): void; (e: 'change', v: number): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoVolumeProps, VideoVolumeEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoVolumeProps>(), { modelValue: 1, muted: false, disabled: false })
const emit = defineEmits<VideoVolumeEmits>()
const { t } = useLocale()
const vol = ref(props.modelValue)
const isMuted = ref(props.muted)
watch(() => props.modelValue, v => { vol.value = v ?? 1 })
watch(() => props.muted, v => { isMuted.value = !!v })
const muteLabel = computed(() => isMuted.value ? t('industry.video.unmute') : t('industry.video.mute'))
function onVol(e: Event) { const v = Number((e.target as HTMLInputElement).value); vol.value = v; emit('update:modelValue', v); emit('change', v) }
function toggleMute() { isMuted.value = !isMuted.value; emit('update:muted', isMuted.value) }
</script>
<template>
  <div :class="['vp-video-volume', props.class]" :style="style" data-component="VideoVolume">
    <button type="button" class="vp-video-volume__btn vp-video-volume__btn--ghost" :disabled="disabled" @click="toggleMute">{{ muteLabel }}</button>
    <label class="vp-video-volume__muted">{{ t('industry.video.volume') }}
      <input class="vp-video-volume__range" type="range" min="0" max="1" step="0.05" :value="vol" :disabled="disabled || isMuted" @input="onVol" />
    </label>
  </div>
</template>`,
  'style.scss': S('vp-video-volume'),
})

// VideoAdjust
write('VideoAdjust', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VideoAdjustProps extends BaseProps { brightness?: number; contrast?: number; saturation?: number; disabled?: boolean }
export interface VideoAdjustEmits { (e: 'update:brightness', v: number): void; (e: 'update:contrast', v: number): void; (e: 'update:saturation', v: number): void; (e: 'change', payload: { brightness: number; contrast: number; saturation: number }): void }
`,
  'index.vue': `<script setup lang="ts">
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
const filterStyle = { filter: \`brightness(\${b.value}%) contrast(\${c.value}%) saturate(\${s.value}%)\` }
function emitAll() { emit('change', { brightness: b.value, contrast: c.value, saturation: s.value }) }
function onB(e: Event) { b.value = Number((e.target as HTMLInputElement).value); emit('update:brightness', b.value); emitAll() }
function onC(e: Event) { c.value = Number((e.target as HTMLInputElement).value); emit('update:contrast', c.value); emitAll() }
function onS(e: Event) { s.value = Number((e.target as HTMLInputElement).value); emit('update:saturation', s.value); emitAll() }
</script>
<template>
  <div :class="['vp-video-adjust', props.class]" :style="style" data-component="VideoAdjust">
    <label class="vp-video-adjust__muted">{{ t('industry.video.brightness') }}<input class="vp-video-adjust__range" type="range" min="50" max="150" :value="b" :disabled="disabled" @input="onB" /></label>
    <label class="vp-video-adjust__muted">{{ t('industry.video.contrast') }}<input class="vp-video-adjust__range" type="range" min="50" max="150" :value="c" :disabled="disabled" @input="onC" /></label>
    <label class="vp-video-adjust__muted">{{ t('industry.video.saturation') }}<input class="vp-video-adjust__range" type="range" min="0" max="200" :value="s" :disabled="disabled" @input="onS" /></label>
    <div class="vp-video-adjust__preview" :style="filterStyle"><slot /></div>
  </div>
</template>`,
  'style.scss': S('vp-video-adjust') + `.vp-video-adjust__preview { min-height: 4rem; background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); display: flex; align-items: center; justify-content: center; }`,
})

// AudioTalk
write('AudioTalk', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface AudioTalkProps extends BaseProps { active?: boolean; disabled?: boolean }
export interface AudioTalkEmits { (e: 'update:active', v: boolean): void; (e: 'start'): void; (e: 'stop'): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { AudioTalkProps, AudioTalkEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<AudioTalkProps>(), { active: false, disabled: false })
const emit = defineEmits<AudioTalkEmits>()
const { t } = useLocale()
const talking = ref(props.active)
watch(() => props.active, v => { talking.value = !!v })
const label = computed(() => talking.value ? t('industry.audioTalk.talking') : t('industry.audioTalk.idle'))
function toggle() {
  if (props.disabled) return
  talking.value = !talking.value
  emit('update:active', talking.value)
  if (talking.value) emit('start'); else emit('stop')
}
</script>
<template>
  <div :class="['vp-audio-talk', { 'vp-audio-talk--active': talking }, props.class]" :style="style" data-component="AudioTalk">
    <span class="vp-audio-talk__badge" :class="talking ? 'vp-audio-talk__badge--on' : 'vp-audio-talk__badge--off'">{{ label }}</span>
    <button type="button" class="vp-audio-talk__btn" :disabled="disabled" @click="toggle">{{ talking ? t('industry.audioTalk.stop') : t('industry.audioTalk.start') }}</button>
  </div>
</template>`,
  'style.scss': S('vp-audio-talk') + `.vp-audio-talk--active .vp-audio-talk__btn { background: var(--primary-600, var(--primary-500)); }`,
})

// VideoPreview upgrade
write('VideoPreview', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VideoPreviewProps extends BaseProps { src?: string | File | Blob | null; poster?: string; controls?: boolean; autoplay?: boolean; loop?: boolean; muted?: boolean }
export interface VideoPreviewEmits { (e: 'play'): void; (e: 'pause'): void; (e: 'error'): void; (e: 'fullscreen', active: boolean): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoPreviewProps, VideoPreviewEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VideoPreviewProps>(), { src: null, poster: '', controls: true, autoplay: false, loop: false, muted: false })
const emit = defineEmits<VideoPreviewEmits>()
const { t } = useLocale()
const url = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
const isFs = ref(false)
const fsLabel = computed(() => isFs.value ? t('industry.video.exitFullscreen') : t('industry.video.fullscreen'))
watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  if (typeof val === 'string') url.value = val
  else url.value = URL.createObjectURL(val)
}, { immediate: true })
function toggleFs() {
  const el = videoRef.value?.parentElement
  if (!el) return
  if (!document.fullscreenElement) { el.requestFullscreen?.(); isFs.value = true }
  else { document.exitFullscreen?.(); isFs.value = false }
  emit('fullscreen', isFs.value)
}
onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })
</script>
<template>
  <div :class="['vp-video-preview', props.class]" :style="style" data-component="VideoPreview">
    <div class="vp-video-preview__wrap">
      <video v-if="url" ref="videoRef" class="vp-video-preview__video" :src="url" :poster="poster" :controls="controls" :autoplay="autoplay" :loop="loop" :muted="muted" @play="emit('play')" @pause="emit('pause')" @error="emit('error')" />
      <p v-else class="vp-video-preview__muted">{{ t('industry.video.noSignal') }}</p>
    </div>
    <button v-if="url" type="button" class="vp-video-preview__btn" @click="toggleFs">{{ fsLabel }}</button>
    <slot />
  </div>
</template>`,
  'style.scss': S('vp-video-preview') + `.vp-video-preview__wrap { background: var(--surface-2, var(--surface-1)); border-radius: var(--theme-card-radius, var(--border-radius-md)); overflow: hidden; } .vp-video-preview__video { width: 100%; display: block; }`,
})

console.log('Part 3a done (video controls)')
