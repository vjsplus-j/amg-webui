#!/usr/bin/env node
/** Part 2: Video, ONVIF, GBS, VCR industry components */
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

const panelScss = (pfx) => `.${pfx} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  &__title { margin: 0 0 var(--spacing-sm); font-size: var(--font-size-lg); font-weight: 600; }
  &__body { display: flex; flex-direction: column; gap: var(--spacing-md); min-width: 0; }
  &__panel { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); }
  &__muted { color: var(--text-secondary); font-size: var(--font-size-sm); }
  &__toolbar { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; }
  &__btn, &__action { appearance: none; border: 1px solid transparent; background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-radius: var(--theme-btn-radius, var(--border-radius-md)); height: var(--height-md, 2.25rem); padding: 0 var(--spacing-lg); cursor: pointer; font-size: var(--font-size-sm); }
  &__btn:disabled { opacity: 0.55; cursor: not-allowed; }
  &__btn--ghost { background: transparent; border-color: var(--ds-border, var(--border-color)); color: var(--text-primary); }
  &__input, &__select { flex: 1; min-width: 6rem; height: var(--height-md, 2.25rem); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-input-radius, var(--border-radius-md)); padding: 0 var(--spacing-md); background: var(--surface-0, var(--surface-1)); color: var(--text-primary); font-size: var(--font-size-sm); }
  &__range { flex: 1; accent-color: var(--primary-500); }
  &__table { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
  &__table th, &__table td { border: 1px solid var(--ds-border, var(--border-color)); padding: var(--spacing-sm) var(--spacing-md); text-align: left; }
  &__table th { background: var(--surface-2, var(--surface-1)); font-weight: 600; }
  &__badge { display: inline-block; padding: 0 var(--spacing-sm); border-radius: var(--border-radius-sm, var(--border-radius-md)); font-size: var(--font-size-xs); background: var(--surface-2, var(--surface-1)); }
  &__badge--on { background: var(--primary-100, var(--primary-500)); color: var(--primary-700, var(--primary-500)); }
  &__progress { height: var(--spacing-sm); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); overflow: hidden; }
  &__progress-bar { height: 100%; background: var(--primary-500); transition: width var(--transition-normal, 0.2s); }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

// VideoPlayer
write('VideoPlayer', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'

export interface VideoPlayerProps extends BaseProps {
  src?: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  disabled?: boolean
}

export interface VideoPlayerEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'timeupdate', currentTime: number): void
  (e: 'volumechange', volume: number): void
  (e: 'fullscreen', active: boolean): void
}
`,
  'index.vue': `<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VideoPlayerProps, VideoPlayerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoPlayerProps>(), { autoplay: false, loop: false, muted: false, disabled: false })
const emit = defineEmits<VideoPlayerEmits>()
const { t } = useLocale()
const videoRef = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const progress = ref(0)
const volume = ref(1)
const duration = ref(0)
const isFs = ref(false)

const playLabel = computed(() => (playing.value ? t('industry.video.pause') : t('industry.video.play')))
const fsLabel = computed(() => (isFs.value ? t('industry.video.exitFullscreen') : t('industry.video.fullscreen')))

function togglePlay() {
  const v = videoRef.value
  if (!v || props.disabled) return
  if (v.paused) { v.play(); playing.value = true; emit('play') }
  else { v.pause(); playing.value = false; emit('pause') }
}
function onTimeUpdate() {
  const v = videoRef.value
  if (!v || !v.duration) return
  progress.value = (v.currentTime / v.duration) * 100
  emit('timeupdate', v.currentTime)
}
function onLoaded() { duration.value = videoRef.value?.duration ?? 0 }
function onSeek(e: Event) {
  const v = videoRef.value
  if (!v || !v.duration) return
  v.currentTime = (Number((e.target as HTMLInputElement).value) / 100) * v.duration
}
function onVolume(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  volume.value = val
  if (videoRef.value) videoRef.value.volume = val
  emit('volumechange', val)
}
function toggleFs() {
  const el = videoRef.value?.parentElement
  if (!el) return
  if (!document.fullscreenElement) { el.requestFullscreen?.(); isFs.value = true }
  else { document.exitFullscreen?.(); isFs.value = false }
  emit('fullscreen', isFs.value)
}
function onFsChange() { isFs.value = !!document.fullscreenElement }

onMounted(() => document.addEventListener('fullscreenchange', onFsChange))
onBeforeUnmount(() => document.removeEventListener('fullscreenchange', onFsChange))
watch(() => props.src, () => { playing.value = false; progress.value = 0 })
</script>

<template>
  <div :class="['vp-video-player', { 'vp-video-player--disabled': disabled }, props.class]" :style="style" data-component="VideoPlayer">
    <div class="vp-video-player__viewport">
      <video ref="videoRef" class="vp-video-player__video" :src="src" :poster="poster" :autoplay="autoplay" :loop="loop" :muted="muted" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @play="playing = true" @pause="playing = false" />
      <slot name="poster" />
    </div>
    <div class="vp-video-player__toolbar">
      <button type="button" class="vp-video-player__btn" :disabled="disabled" @click="togglePlay">{{ playLabel }}</button>
      <label class="vp-video-player__muted">{{ t('industry.video.progress') }}
        <input class="vp-video-player__range" type="range" min="0" max="100" :value="progress" :disabled="disabled" @input="onSeek" />
      </label>
      <label class="vp-video-player__muted">{{ t('industry.video.volume') }}
        <input class="vp-video-player__range" type="range" min="0" max="1" step="0.05" :value="volume" :disabled="disabled" @input="onVolume" />
      </label>
      <button type="button" class="vp-video-player__btn vp-video-player__btn--ghost" :disabled="disabled" @click="toggleFs">{{ fsLabel }}</button>
    </div>
    <slot />
  </div>
</template>
`,
  'style.scss': panelScss('vp-video-player') + `
.vp-video-player__viewport { position: relative; background: var(--surface-2, var(--surface-1)); border-radius: var(--theme-card-radius, var(--border-radius-md)); overflow: hidden; aspect-ratio: 16/9; }
.vp-video-player__video { width: 100%; height: 100%; object-fit: contain; display: block; }
`,
})

// SplitVideoWall
write('SplitVideoWall', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export type WallLayout = 1 | 4 | 9
export interface SplitVideoWallProps extends BaseProps { layout?: WallLayout; selected?: number; disabled?: boolean }
export interface SplitVideoWallEmits {
  (e: 'update:selected', index: number): void
  (e: 'select', index: number): void
  (e: 'layout-change', layout: WallLayout): void
}
`,
  'index.vue': `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { SplitVideoWallProps, SplitVideoWallEmits, WallLayout } from './types'
import './style.scss'

const props = withDefaults(defineProps<SplitVideoWallProps>(), { layout: 4, selected: 0, disabled: false })
const emit = defineEmits<SplitVideoWallEmits>()
const { t } = useLocale()
const count = computed(() => props.layout)
const cells = computed(() => Array.from({ length: count.value }, (_, i) => i))
function setLayout(l: WallLayout) { emit('layout-change', l) }
function selectCell(i: number) { if (props.disabled) return; emit('update:selected', i); emit('select', i) }
</script>

<template>
  <div :class="['vp-split-video-wall', props.class]" :style="style" data-component="SplitVideoWall">
    <div class="vp-split-video-wall__toolbar">
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 1 }" :disabled="disabled" @click="setLayout(1)">{{ t('industry.video.layout1') }}</button>
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 4 }" :disabled="disabled" @click="setLayout(4)">{{ t('industry.video.layout4') }}</button>
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 9 }" :disabled="disabled" @click="setLayout(9)">{{ t('industry.video.layout9') }}</button>
    </div>
    <div :class="['vp-split-video-wall__grid', 'vp-split-video-wall__grid--' + layout]">
      <button v-for="i in cells" :key="i" type="button" :class="['vp-split-video-wall__cell', { 'vp-split-video-wall__cell--active': selected === i }]" :disabled="disabled" :aria-label="t('industry.video.cell') + ' ' + (i + 1)" @click="selectCell(i)">
        <slot :name="'cell-' + i" :index="i"><span class="vp-split-video-wall__muted">{{ t('industry.video.noSignal') }}</span></slot>
      </button>
    </div>
  </div>
</template>
`,
  'style.scss': panelScss('vp-split-video-wall') + `
.vp-split-video-wall__grid { display: grid; gap: var(--spacing-sm); min-height: 12rem; }
.vp-split-video-wall__grid--1 { grid-template-columns: 1fr; }
.vp-split-video-wall__grid--4 { grid-template-columns: 1fr 1fr; }
.vp-split-video-wall__grid--9 { grid-template-columns: 1fr 1fr 1fr; }
.vp-split-video-wall__cell { background: var(--surface-2, var(--surface-1)); border: 2px solid var(--ds-border, var(--border-color)); border-radius: var(--border-radius-sm, var(--border-radius-md)); min-height: 5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: var(--spacing-sm); }
.vp-split-video-wall__cell--active { border-color: var(--primary-500); box-shadow: 0 0 0 1px var(--primary-500); }
.vp-split-video-wall__btn--active { background: var(--primary-600, var(--primary-500)); }
`,
})

// PTZControl
write('PTZControl', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export type PtzCommand = 'up' | 'down' | 'left' | 'right' | 'zoomIn' | 'zoomOut' | 'stop'
export interface PTZControlProps extends BaseProps { disabled?: boolean }
export interface PTZControlEmits { (e: 'command', cmd: PtzCommand): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { PTZControlProps, PTZControlEmits, PtzCommand } from './types'
import './style.scss'

const props = withDefaults(defineProps<PTZControlProps>(), { disabled: false })
const emit = defineEmits<PTZControlEmits>()
const { t } = useLocale()
function send(cmd: PtzCommand) { if (!props.disabled) emit('command', cmd) }
</script>

<template>
  <div :class="['vp-ptz-control', props.class]" :style="style" data-component="PTZControl">
    <div class="vp-ptz-control__pad">
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" :aria-label="t('industry.ptz.up')" @click="send('up')">▲</button>
      <div class="vp-ptz-control__row">
        <button type="button" class="vp-ptz-control__btn" :disabled="disabled" :aria-label="t('industry.ptz.left')" @click="send('left')">◀</button>
        <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--stop" :disabled="disabled" :aria-label="t('industry.ptz.stop')" @click="send('stop')">■</button>
        <button type="button" class="vp-ptz-control__btn" :disabled="disabled" :aria-label="t('industry.ptz.right')" @click="send('right')">▶</button>
      </div>
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" :aria-label="t('industry.ptz.down')" @click="send('down')">▼</button>
    </div>
    <div class="vp-ptz-control__toolbar">
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomIn')">{{ t('industry.ptz.zoomIn') }}</button>
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomOut')">{{ t('industry.ptz.zoomOut') }}</button>
    </div>
  </div>
</template>
`,
  'style.scss': panelScss('vp-ptz-control') + `
.vp-ptz-control__pad { display: flex; flex-direction: column; align-items: center; gap: var(--spacing-xs); }
.vp-ptz-control__row { display: flex; gap: var(--spacing-xs); }
.vp-ptz-control__btn { width: var(--height-md, 2.25rem); height: var(--height-md, 2.25rem); min-width: var(--height-md, 2.25rem); padding: 0; display: inline-flex; align-items: center; justify-content: center; }
.vp-ptz-control__btn--stop { background: var(--surface-2, var(--surface-1)); color: var(--text-primary); border: 1px solid var(--ds-border, var(--border-color)); }
`,
})

console.log('Part 2a done (VideoPlayer, SplitVideoWall, PTZControl)')
