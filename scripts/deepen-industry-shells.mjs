/**
 * Deepen industry/video/vcr/onvif/gbs shell components to maturity beta (≥40).
 * Usage: node scripts/deepen-industry-shells.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const baseDir = resolve(root, 'packages/components/base')

const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase()

function expandStyle(prefix, extra = '') {
  return `.${prefix} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  box-sizing: border-box;

  &__panel {
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    padding: var(--theme-card-pad, var(--spacing-md));
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    width: 100%;
    min-width: 0;
  }

  &__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  &__title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  &__status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 0;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
  }

  &__label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    font-weight: 500;
  }

  &__muted {
    margin: 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  &__error {
    margin: 0;
    color: var(--text-danger, var(--primary-500));
    font-size: var(--font-size-sm);
  }

  &__empty {
    margin: 0;
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    background: var(--surface-2, var(--surface-1));
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    border: 1px dashed var(--ds-border, var(--border-color));
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  &__btn {
    appearance: none;
    border: 1px solid transparent;
    background: var(--primary-500);
    color: var(--surface-0, var(--surface-1));
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-lg);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: opacity var(--transition-normal, 0.15s ease);

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:focus-visible {
      outline: 2px solid var(--ds-focus-ring, var(--primary-500));
      outline-offset: 2px;
    }
  }

  &__btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &__btn--ghost {
    background: transparent;
    border-color: var(--ds-border, var(--border-color));
    color: var(--text-primary);
  }

  &__btn--danger {
    background: transparent;
    border-color: var(--ds-border, var(--border-color));
    color: var(--text-danger, var(--primary-500));
  }

  &__btn--active {
    background: var(--primary-600, var(--primary-500));
    border-color: var(--primary-600, var(--primary-500));
  }

  &__input,
  &__select {
    width: 100%;
    height: var(--height-md, 2.25rem);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-input-radius, var(--border-radius-md));
    padding: 0 var(--spacing-md);
    background: var(--surface-0, var(--surface-1));
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    box-sizing: border-box;
  }

  &__range,
  &__scrubber {
    width: 100%;
    accent-color: var(--primary-500);
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  &__table th,
  &__table td {
    border: 1px solid var(--ds-border, var(--border-color));
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
  }

  &__table th {
    background: var(--surface-2, var(--surface-1));
    font-weight: 600;
  }

  &__table tbody tr {
    cursor: pointer;
    transition: background var(--transition-normal, 0.15s ease);

    &:hover {
      background: var(--surface-2, var(--surface-1));
    }
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-height: 16rem;
    overflow: auto;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--ds-border, var(--border-color));
  }

  &__log {
    font-family: var(--font-family-mono, monospace);
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) 0;
    border-bottom: 1px solid var(--ds-border, var(--border-color));
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
  }

  &__badge {
    display: inline-block;
    padding: 0 var(--spacing-sm);
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    font-size: var(--font-size-xs);
    font-weight: 500;
  }

  &__badge--on {
    background: var(--primary-100, var(--primary-500));
    color: var(--primary-700, var(--primary-500));
  }

  &__badge--off {
    background: var(--surface-2, var(--surface-1));
    color: var(--text-secondary);
  }

  &__progress {
    height: var(--spacing-sm);
    background: var(--surface-2, var(--surface-1));
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    overflow: hidden;
    flex: 1;
    min-width: 6rem;
  }

  &__progress-bar {
    height: 100%;
    background: var(--primary-500);
    transition: width var(--transition-normal, 0.15s ease);
  }

  &__grid-schedule {
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    gap: 1px;
  }

  &__slot {
    aspect-ratio: 1;
    background: var(--surface-2, var(--surface-1));
    border: none;
    cursor: pointer;
    padding: 0;
    border-radius: var(--border-radius-sm, var(--border-radius-md));

    &--on {
      background: var(--primary-400, var(--primary-500));
      opacity: 0.75;
    }
  }

  &__modal {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--surface-0, var(--surface-1)) 40%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  &__dialog {
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    padding: var(--theme-card-pad, var(--spacing-md));
    max-width: 28rem;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
    gap: var(--spacing-md);
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  &__stat-value {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
  }

  &__preview {
    min-height: 4rem;
    background: var(--surface-2, var(--surface-1));
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--surface-2, var(--surface-1));
    border-radius: var(--border-radius-sm, var(--border-radius-md));
    overflow: hidden;
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__speeds {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  &__timeline {
    width: 100%;
  }

  &__canvas {
    display: none;
  }

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }

  &--active {
    .${prefix}__badge--on {
      box-shadow: 0 0 0 1px var(--primary-500);
    }
  }
${extra}
}
`
}

const COMPONENTS = [
  'AudioTalk',
  'GbsAlarmModal',
  'GbsCascadePanel',
  'GbsSignMonitor',
  'GbsStatusCard',
  'GbsTimeSync',
  'OnvifAlarmPanel',
  'OnvifChannelManage',
  'OnvifDeviceList',
  'OnvifRecordPlan',
  'OnvifSettingPanel',
  'OnvifUrlForm',
  'VcrBackupTask',
  'VcrClipCut',
  'VcrDownloadPanel',
  'VcrMarkPoint',
  'VcrSearchPanel',
  'VcrSpeedControl',
  'VcrStorageDashboard',
  'VcrTimelinePlayer',
  'VideoAdjust',
  'VideoPreview',
  'VideoSnapshot',
  'VideoVolume',
  'VideoWatermark'
]

function genTypes(name, extraTypes, propLines, emitLines) {
  return `import type { BaseProps } from '@amg-webui/types'
${extraTypes ? `${extraTypes}\n` : ''}export interface ${name}Props extends BaseProps {
${propLines.map((l) => `  ${l}`).join('\n')}
}

export interface ${name}Emits {
${emitLines.map((l) => `  ${l}`).join('\n')}
}
`
}

const typesFiles = {
  AudioTalk: genTypes(
    'AudioTalk',
    '',
    ['active?: boolean', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:active', v: boolean): void", "(e: 'start'): void", "(e: 'stop'): void"]
  ),
  GbsAlarmModal: genTypes(
    'GbsAlarmModal',
    '',
    ['open?: boolean', 'title?: string', 'description?: string', 'disabled?: boolean', 'loading?: boolean'],
    ["(e: 'update:open', v: boolean): void", "(e: 'acknowledge'): void", "(e: 'close'): void"]
  ),
  GbsCascadePanel: genTypes(
    'GbsCascadePanel',
    '',
    ['upstream?: string', 'downstream?: string', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:upstream', v: string): void", "(e: 'update:downstream', v: string): void", "(e: 'save'): void"]
  ),
  GbsSignMonitor: genTypes(
    'GbsSignMonitor',
    `export interface GbsSignEntry {
  id: string
  type: string
  message: string
  time: string
}
`,
    ['logs?: GbsSignEntry[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'refresh'): void"]
  ),
  GbsStatusCard: genTypes(
    'GbsStatusCard',
    '',
    [
      'registered?: boolean',
      'deviceCount?: number',
      'channelCount?: number',
      'disabled?: boolean',
      'loading?: boolean',
      'title?: string'
    ],
    ["(e: 'refresh'): void"]
  ),
  GbsTimeSync: genTypes(
    'GbsTimeSync',
    '',
    ['server?: string', 'disabled?: boolean', 'syncing?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'sync'): void", "(e: 'update:server', v: string): void"]
  ),
  OnvifAlarmPanel: genTypes(
    'OnvifAlarmPanel',
    `export interface OnvifAlarm {
  id: string
  type: string
  time: string
}
`,
    ['alarms?: OnvifAlarm[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'acknowledge', id: string): void"]
  ),
  OnvifChannelManage: genTypes(
    'OnvifChannelManage',
    `export interface OnvifChannel {
  id: string
  name: string
}
`,
    ['channels?: OnvifChannel[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'add', name: string): void", "(e: 'remove', id: string): void"]
  ),
  OnvifDeviceList: genTypes(
    'OnvifDeviceList',
    `import type { OnvifDevice } from '../OnvifSearch/types'
`,
    ['devices?: OnvifDevice[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'select', device: OnvifDevice): void"]
  ),
  OnvifRecordPlan: genTypes(
    'OnvifRecordPlan',
    '',
    ['slots?: boolean[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:slots', v: boolean[]): void", "(e: 'toggle', index: number, on: boolean): void"]
  ),
  OnvifSettingPanel: genTypes(
    'OnvifSettingPanel',
    `export interface OnvifSettings {
  username: string
  password: string
  port: number
}
`,
    ['modelValue?: OnvifSettings', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:modelValue', v: OnvifSettings): void", "(e: 'submit', v: OnvifSettings): void"]
  ),
  OnvifUrlForm: genTypes(
    'OnvifUrlForm',
    '',
    ['modelValue?: string', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:modelValue', v: string): void", "(e: 'test', url: string): void", "(e: 'invalid'): void"]
  ),
  VcrBackupTask: genTypes(
    'VcrBackupTask',
    `export interface VcrBackupTaskItem {
  id: string
  name: string
  progress: number
  status: 'pending' | 'running' | 'done'
}
`,
    ['tasks?: VcrBackupTaskItem[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'start', id: string): void"]
  ),
  VcrClipCut: genTypes(
    'VcrClipCut',
    '',
    ['start?: number', 'end?: number', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    [
      "(e: 'update:start', v: number): void",
      "(e: 'update:end', v: number): void",
      "(e: 'cut', range: { start: number; end: number }): void"
    ]
  ),
  VcrDownloadPanel: genTypes(
    'VcrDownloadPanel',
    `export interface VcrDownloadItem {
  id: string
  name: string
  progress: number
  status: 'pending' | 'running' | 'done'
}
`,
    ['items?: VcrDownloadItem[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'download', id: string): void", "(e: 'cancel', id: string): void"]
  ),
  VcrMarkPoint: genTypes(
    'VcrMarkPoint',
    `export interface VcrMark {
  id: string
  time: number
  label: string
}
`,
    ['marks?: VcrMark[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    [
      "(e: 'add', mark: Omit<VcrMark, 'id'>): void",
      "(e: 'select', id: string): void",
      "(e: 'remove', id: string): void"
    ]
  ),
  VcrSearchPanel: genTypes(
    'VcrSearchPanel',
    '',
    ['date?: string', 'device?: string', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:date', v: string): void", "(e: 'update:device', v: string): void", "(e: 'search'): void"]
  ),
  VcrSpeedControl: genTypes(
    'VcrSpeedControl',
    `export type VcrSpeed = 0.5 | 1 | 2 | 4 | 8
`,
    ['modelValue?: VcrSpeed', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:modelValue', v: VcrSpeed): void", "(e: 'change', v: VcrSpeed): void"]
  ),
  VcrStorageDashboard: genTypes(
    'VcrStorageDashboard',
    `export interface VcrStorageVolume {
  id: string
  name: string
  used: number
  total: number
}
`,
    ['volumes?: VcrStorageVolume[]', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'refresh'): void"]
  ),
  VcrTimelinePlayer: genTypes(
    'VcrTimelinePlayer',
    '',
    ['currentTime?: number', 'duration?: number', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:currentTime', v: number): void", "(e: 'seek', v: number): void"]
  ),
  VideoAdjust: genTypes(
    'VideoAdjust',
    '',
    [
      'brightness?: number',
      'contrast?: number',
      'saturation?: number',
      'disabled?: boolean',
      'loading?: boolean',
      'title?: string'
    ],
    [
      "(e: 'update:brightness', v: number): void",
      "(e: 'update:contrast', v: number): void",
      "(e: 'update:saturation', v: number): void",
      "(e: 'change', payload: { brightness: number; contrast: number; saturation: number }): void"
    ]
  ),
  VideoPreview: genTypes(
    'VideoPreview',
    '',
    [
      'src?: string | File | Blob | null',
      'poster?: string',
      'controls?: boolean',
      'autoplay?: boolean',
      'loop?: boolean',
      'muted?: boolean',
      'loading?: boolean',
      'title?: string'
    ],
    ["(e: 'play'): void", "(e: 'pause'): void", "(e: 'error'): void", "(e: 'fullscreen', active: boolean): void"]
  ),
  VideoSnapshot: genTypes(
    'VideoSnapshot',
    '',
    ['videoRef?: HTMLVideoElement | null', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'capture', dataUrl: string): void"]
  ),
  VideoVolume: genTypes(
    'VideoVolume',
    '',
    ['modelValue?: number', 'muted?: boolean', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:modelValue', v: number): void", "(e: 'update:muted', v: boolean): void", "(e: 'change', v: number): void"]
  ),
  VideoWatermark: genTypes(
    'VideoWatermark',
    '',
    ['text?: string', 'opacity?: number', 'disabled?: boolean', 'loading?: boolean', 'title?: string'],
    ["(e: 'update:text', v: string): void", "(e: 'change', v: string): void"]
  )
}

const vueFiles = {
  AudioTalk: `<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { AudioTalkProps, AudioTalkEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AudioTalkProps>(), {
  active: false,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<AudioTalkEmits>()
const { t } = useLocale()

const talking = ref(props.active)
const pulseTimer = ref<ReturnType<typeof setInterval> | null>(null)

watch(
  () => props.active,
  (v) => {
    talking.value = !!v
  }
)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.audioTalk.start))
const statusLabel = computed(() =>
  talking.value ? t(LocaleKeys.industry.audioTalk.talking) : t(LocaleKeys.industry.audioTalk.idle)
)

function clearPulse() {
  if (pulseTimer.value) {
    clearInterval(pulseTimer.value)
    pulseTimer.value = null
  }
}

function toggle() {
  if (props.disabled || props.loading) return
  talking.value = !talking.value
  emit('update:active', talking.value)
  if (talking.value) {
    emit('start')
    clearPulse()
    pulseTimer.value = setInterval(() => {}, 1000)
  } else {
    emit('stop')
    clearPulse()
  }
  trackEmit({
    component: 'AudioTalk',
    type: talking.value ? 'start' : 'stop',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

function reset() {
  if (props.disabled || props.loading) return
  talking.value = false
  clearPulse()
  emit('update:active', false)
  emit('stop')
  trackEmit({ component: 'AudioTalk', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

onUnmounted(clearPulse)
</script>

<template>
  <section
    :class="['vp-audio-talk', 'vp-audio-talk__panel', { 'vp-audio-talk--active': talking, 'vp-audio-talk--disabled': disabled }, props.class]"
    :style="style"
    role="region"
    :aria-labelledby="'vp-audio-talk-title'"
    data-component="AudioTalk"
  >
    <header class="vp-audio-talk__header">
      <h3 id="vp-audio-talk-title" class="vp-audio-talk__title">{{ titleText }}</h3>
      <div class="vp-audio-talk__status" role="status" aria-live="polite">
        <span
          :class="['vp-audio-talk__badge', talking ? 'vp-audio-talk__badge--on' : 'vp-audio-talk__badge--off']"
        >
          {{ statusLabel }}
        </span>
      </div>
    </header>

    <div v-if="loading" class="vp-audio-talk__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>

    <div v-else class="vp-audio-talk__body">
      <div class="vp-audio-talk__toolbar">
        <button
          type="button"
          class="vp-audio-talk__btn"
          :disabled="disabled"
          :aria-pressed="talking"
          @click="toggle"
        >
          {{ talking ? t(LocaleKeys.industry.audioTalk.stop) : t(LocaleKeys.industry.audioTalk.start) }}
        </button>
        <button type="button" class="vp-audio-talk__btn vp-audio-talk__btn--ghost" :disabled="disabled" @click="reset">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  GbsAlarmModal: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsAlarmModalProps, GbsAlarmModalEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsAlarmModalProps>(), {
  open: false,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsAlarmModalEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.alarmTitle))
const descText = computed(() => props.description ?? t(LocaleKeys.industry.gbs.alarmDesc))

function close() {
  emit('update:open', false)
  emit('close')
  trackEmit({ component: 'GbsAlarmModal', type: 'close', trackId: props.trackId, telemetry: props.telemetry })
}

function ack() {
  if (props.disabled || props.loading) return
  emit('acknowledge')
  trackEmit({ component: 'GbsAlarmModal', type: 'acknowledge', trackId: props.trackId, telemetry: props.telemetry })
  close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="vp-gbs-alarm-modal__modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'vp-gbs-alarm-modal-title'"
      data-component="GbsAlarmModal"
      @click.self="close"
      @keydown.esc="close"
    >
      <div :class="['vp-gbs-alarm-modal__dialog', props.class]" :style="style">
        <header class="vp-gbs-alarm-modal__header">
          <h3 id="vp-gbs-alarm-modal-title" class="vp-gbs-alarm-modal__title">{{ titleText }}</h3>
          <span class="vp-gbs-alarm-modal__badge vp-gbs-alarm-modal__badge--on" role="status">
            {{ t(LocaleKeys.industry.onvif.alarm) }}
          </span>
        </header>
        <p class="vp-gbs-alarm-modal__muted">{{ descText }}</p>
        <div v-if="loading" class="vp-gbs-alarm-modal__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
        <div class="vp-gbs-alarm-modal__toolbar">
          <button type="button" class="vp-gbs-alarm-modal__btn" :disabled="disabled || loading" @click="ack">
            {{ t(LocaleKeys.industry.gbs.acknowledge) }}
          </button>
          <button type="button" class="vp-gbs-alarm-modal__btn vp-gbs-alarm-modal__btn--ghost" @click="close">
            {{ t(LocaleKeys.common.close) }}
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
`,

  GbsCascadePanel: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsCascadePanelProps, GbsCascadePanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsCascadePanelProps>(), {
  upstream: '34020000001110000001',
  downstream: '34020000001320000002',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsCascadePanelEmits>()
const { t } = useLocale()
const up = ref(props.upstream ?? '')
const down = ref(props.downstream ?? '')

watch(() => props.upstream, (v) => { up.value = v ?? '' })
watch(() => props.downstream, (v) => { down.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.cascade))
const statusText = computed(() => \`\${t(LocaleKeys.industry.gbs.upstream)} / \${t(LocaleKeys.industry.gbs.downstream)}\`)

function onUpstream(e: Event) {
  const v = (e.target as HTMLInputElement).value
  up.value = v
  emit('update:upstream', v)
}

function onDownstream(e: Event) {
  const v = (e.target as HTMLInputElement).value
  down.value = v
  emit('update:downstream', v)
}

function save() {
  if (props.disabled || props.loading) return
  emit('save')
  trackEmit({ component: 'GbsCascadePanel', type: 'save', trackId: props.trackId, telemetry: props.telemetry })
}

function reset() {
  if (props.disabled || props.loading) return
  up.value = props.upstream ?? ''
  down.value = props.downstream ?? ''
  trackEmit({ component: 'GbsCascadePanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-gbs-cascade-panel', 'vp-gbs-cascade-panel__panel', { 'vp-gbs-cascade-panel--disabled': disabled }, props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-cascade-panel-title"
    data-component="GbsCascadePanel"
  >
    <header class="vp-gbs-cascade-panel__header">
      <h3 id="vp-gbs-cascade-panel-title" class="vp-gbs-cascade-panel__title">{{ titleText }}</h3>
      <div class="vp-gbs-cascade-panel__status" role="status" aria-live="polite">{{ statusText }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-cascade-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-cascade-panel__body">
      <label class="vp-gbs-cascade-panel__field">
        <span class="vp-gbs-cascade-panel__label">{{ t(LocaleKeys.industry.gbs.upstream) }}</span>
        <input class="vp-gbs-cascade-panel__input" :value="up" :disabled="disabled" @input="onUpstream" />
      </label>
      <label class="vp-gbs-cascade-panel__field">
        <span class="vp-gbs-cascade-panel__label">{{ t(LocaleKeys.industry.gbs.downstream) }}</span>
        <input class="vp-gbs-cascade-panel__input" :value="down" :disabled="disabled" @input="onDownstream" />
      </label>
      <div class="vp-gbs-cascade-panel__toolbar">
        <button type="button" class="vp-gbs-cascade-panel__btn" :disabled="disabled" @click="save">
          {{ t(LocaleKeys.button.save) }}
        </button>
        <button type="button" class="vp-gbs-cascade-panel__btn vp-gbs-cascade-panel__btn--ghost" :disabled="disabled" @click="reset">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  GbsSignMonitor: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsSignMonitorProps, GbsSignMonitorEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsSignMonitorProps>(), {
  logs: () => [
    { id: '1', type: 'REGISTER', message: 'SIP/2.0 200 OK', time: '10:00:01' },
    { id: '2', type: 'KEEPALIVE', message: 'MESSAGE sip:...', time: '10:00:31' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsSignMonitorEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.signLog))
const countLabel = computed(() => String(props.logs?.length ?? 0))
const isEmpty = computed(() => !props.logs?.length)

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({ component: 'GbsSignMonitor', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

function clearView() {
  trackEmit({ component: 'GbsSignMonitor', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-gbs-sign-monitor', 'vp-gbs-sign-monitor__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-sign-monitor-title"
    data-component="GbsSignMonitor"
  >
    <header class="vp-gbs-sign-monitor__header">
      <h3 id="vp-gbs-sign-monitor-title" class="vp-gbs-sign-monitor__title">{{ titleText }}</h3>
      <div class="vp-gbs-sign-monitor__status" role="status" aria-live="polite">{{ countLabel }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-sign-monitor__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-sign-monitor__body">
      <div class="vp-gbs-sign-monitor__toolbar">
        <button type="button" class="vp-gbs-sign-monitor__btn" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-gbs-sign-monitor__btn vp-gbs-sign-monitor__btn--ghost" :disabled="disabled" @click="clearView">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-gbs-sign-monitor__empty" role="status">{{ t(LocaleKeys.industry.common.noLogs) }}</p>
      <ul v-else class="vp-gbs-sign-monitor__list" role="log" aria-live="polite">
        <li v-for="row in logs" :key="row.id" class="vp-gbs-sign-monitor__log">
          <span class="vp-gbs-sign-monitor__badge vp-gbs-sign-monitor__badge--on">{{ row.type }}</span>
          <span>{{ row.message }}</span>
          <span class="vp-gbs-sign-monitor__muted">{{ row.time }}</span>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
`,

  GbsStatusCard: `<script setup lang="ts">
import { computed } from 'vue'
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
`,

  GbsTimeSync: `<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsTimeSyncProps, GbsTimeSyncEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsTimeSyncProps>(), {
  server: 'ntp.pool.org',
  disabled: false,
  syncing: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsTimeSyncEmits>()
const { t } = useLocale()
const srv = ref(props.server ?? '')
let syncTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.server, (v) => { srv.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.timeSync))
const statusLabel = computed(() =>
  props.syncing || props.loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.industry.gbs.syncNow)
)

function onServer(e: Event) {
  const v = (e.target as HTMLInputElement).value
  srv.value = v
  emit('update:server', v)
}

function syncNow() {
  if (props.disabled || props.loading || props.syncing) return
  emit('sync')
  trackEmit({ component: 'GbsTimeSync', type: 'sync', trackId: props.trackId, telemetry: props.telemetry })
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => { syncTimer = null }, 800)
}

function resetServer() {
  if (props.disabled || props.loading) return
  srv.value = props.server ?? ''
  trackEmit({ component: 'GbsTimeSync', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

onUnmounted(() => {
  if (syncTimer) clearTimeout(syncTimer)
})
</script>

<template>
  <section
    :class="['vp-gbs-time-sync', 'vp-gbs-time-sync__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-time-sync-title"
    data-component="GbsTimeSync"
  >
    <header class="vp-gbs-time-sync__header">
      <h3 id="vp-gbs-time-sync-title" class="vp-gbs-time-sync__title">{{ titleText }}</h3>
      <div class="vp-gbs-time-sync__status" role="status" aria-live="polite">{{ statusLabel }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-time-sync__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-time-sync__body">
      <label class="vp-gbs-time-sync__field">
        <span class="vp-gbs-time-sync__label">{{ t(LocaleKeys.industry.gbs.sipDomain) }}</span>
        <input class="vp-gbs-time-sync__input" :value="srv" :disabled="disabled || syncing" @input="onServer" />
      </label>
      <div class="vp-gbs-time-sync__toolbar">
        <button type="button" class="vp-gbs-time-sync__btn" :disabled="disabled || syncing" @click="syncNow">
          {{ t(LocaleKeys.industry.gbs.syncNow) }}
        </button>
        <button type="button" class="vp-gbs-time-sync__btn vp-gbs-time-sync__btn--ghost" :disabled="disabled" @click="resetServer">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  OnvifAlarmPanel: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifAlarmPanelProps, OnvifAlarmPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifAlarmPanelProps>(), {
  alarms: () => [
    { id: 'a1', type: 'motion', time: '2026-07-14 10:00:00' },
    { id: 'a2', type: 'tamper', time: '2026-07-14 09:30:00' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifAlarmPanelEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.alarm))
const isEmpty = computed(() => !props.alarms?.length)

function ackAll() {
  if (props.disabled || props.loading || isEmpty.value) return
  for (const row of props.alarms ?? []) emit('acknowledge', row.id)
  trackEmit({ component: 'OnvifAlarmPanel', type: 'ack-all', trackId: props.trackId, telemetry: props.telemetry })
}

function ackOne(id: string) {
  if (props.disabled || props.loading) return
  emit('acknowledge', id)
  trackEmit({ component: 'OnvifAlarmPanel', type: 'acknowledge', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-alarm-panel', 'vp-onvif-alarm-panel__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-alarm-panel-title"
    data-component="OnvifAlarmPanel"
  >
    <header class="vp-onvif-alarm-panel__header">
      <h3 id="vp-onvif-alarm-panel-title" class="vp-onvif-alarm-panel__title">{{ titleText }}</h3>
      <div class="vp-onvif-alarm-panel__status" role="status" aria-live="polite">{{ alarms?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-alarm-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-alarm-panel__body">
      <div class="vp-onvif-alarm-panel__toolbar">
        <button type="button" class="vp-onvif-alarm-panel__btn" :disabled="disabled || isEmpty" @click="ackAll">
          {{ t(LocaleKeys.industry.gbs.acknowledge) }}
        </button>
        <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="ackAll">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-onvif-alarm-panel__empty" role="status">{{ t(LocaleKeys.industry.common.noAlarms) }}</p>
      <ul v-else class="vp-onvif-alarm-panel__list" role="list">
        <li v-for="row in alarms" :key="row.id" class="vp-onvif-alarm-panel__item">
          <span class="vp-onvif-alarm-panel__badge vp-onvif-alarm-panel__badge--on">{{ row.type }}</span>
          <span>{{ row.time }}</span>
          <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="ackOne(row.id)">
            {{ t(LocaleKeys.industry.gbs.acknowledge) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
`,

  OnvifChannelManage: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifChannelManageProps, OnvifChannelManageEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifChannelManageProps>(), {
  channels: () => [{ id: 'ch1', name: 'Channel-01' }, { id: 'ch2', name: 'Channel-02' }],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifChannelManageEmits>()
const { t } = useLocale()
const draft = ref('')

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.channel))
const isEmpty = computed(() => !props.channels?.length)

function addChannel() {
  if (props.disabled || props.loading || !draft.value.trim()) return
  emit('add', draft.value.trim())
  draft.value = ''
  trackEmit({ component: 'OnvifChannelManage', type: 'add', trackId: props.trackId, telemetry: props.telemetry })
}

function removeChannel(id: string) {
  if (props.disabled || props.loading) return
  emit('remove', id)
  trackEmit({ component: 'OnvifChannelManage', type: 'remove', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-channel-manage', 'vp-onvif-channel-manage__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-channel-manage-title"
    data-component="OnvifChannelManage"
  >
    <header class="vp-onvif-channel-manage__header">
      <h3 id="vp-onvif-channel-manage-title" class="vp-onvif-channel-manage__title">{{ titleText }}</h3>
      <div class="vp-onvif-channel-manage__status" role="status" aria-live="polite">{{ channels?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-channel-manage__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-channel-manage__body">
      <label class="vp-onvif-channel-manage__field">
        <span class="vp-onvif-channel-manage__label">{{ t(LocaleKeys.industry.onvif.channelName) }}</span>
        <input v-model="draft" class="vp-onvif-channel-manage__input" :disabled="disabled" />
      </label>
      <div class="vp-onvif-channel-manage__toolbar">
        <button type="button" class="vp-onvif-channel-manage__btn" :disabled="disabled || !draft.trim()" @click="addChannel">
          {{ t(LocaleKeys.industry.onvif.addChannel) }}
        </button>
        <button type="button" class="vp-onvif-channel-manage__btn vp-onvif-channel-manage__btn--ghost" :disabled="disabled" @click="draft = ''">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-onvif-channel-manage__empty" role="status">{{ t(LocaleKeys.industry.common.noChannels) }}</p>
      <ul v-else class="vp-onvif-channel-manage__list" role="list">
        <li v-for="ch in channels" :key="ch.id" class="vp-onvif-channel-manage__item">
          <span>{{ ch.name }}</span>
          <button type="button" class="vp-onvif-channel-manage__btn vp-onvif-channel-manage__btn--danger" :disabled="disabled" @click="removeChannel(ch.id)">
            {{ t(LocaleKeys.industry.onvif.removeChannel) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
`,

  OnvifDeviceList: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifDeviceListProps, OnvifDeviceListEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifDeviceListProps>(), {
  devices: () => [
    { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true },
    { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true },
    { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifDeviceListEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.devices))
const isEmpty = computed(() => !props.devices?.length)

function selectDevice(device: (typeof props.devices)[number]) {
  if (props.disabled || props.loading) return
  emit('select', device)
  trackEmit({ component: 'OnvifDeviceList', type: 'select', trackId: props.trackId, telemetry: props.telemetry })
}

function refreshList() {
  trackEmit({ component: 'OnvifDeviceList', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-device-list', 'vp-onvif-device-list__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-device-list-title"
    data-component="OnvifDeviceList"
  >
    <header class="vp-onvif-device-list__header">
      <h3 id="vp-onvif-device-list-title" class="vp-onvif-device-list__title">{{ titleText }}</h3>
      <div class="vp-onvif-device-list__status" role="status" aria-live="polite">{{ devices?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-device-list__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-device-list__body">
      <div class="vp-onvif-device-list__toolbar">
        <button type="button" class="vp-onvif-device-list__btn" :disabled="disabled" @click="refreshList">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-onvif-device-list__btn vp-onvif-device-list__btn--ghost" :disabled="disabled" @click="refreshList">
          {{ t(LocaleKeys.industry.onvif.discover) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-onvif-device-list__empty" role="status">{{ t(LocaleKeys.industry.onvif.noDevices) }}</p>
      <table v-else class="vp-onvif-device-list__table" role="grid">
        <thead>
          <tr>
            <th scope="col">{{ t(LocaleKeys.industry.onvif.deviceName) }}</th>
            <th scope="col">{{ t(LocaleKeys.industry.onvif.ip) }}</th>
            <th scope="col">{{ t(LocaleKeys.industry.onvif.port) }}</th>
            <th scope="col">{{ t(LocaleKeys.industry.onvif.status) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in devices" :key="d.id" tabindex="0" @click="selectDevice(d)" @keydown.enter="selectDevice(d)">
            <td>{{ d.name }}</td>
            <td>{{ d.ip }}</td>
            <td>{{ d.port }}</td>
            <td>
              <span :class="['vp-onvif-device-list__badge', d.online ? 'vp-onvif-device-list__badge--on' : 'vp-onvif-device-list__badge--off']">
                {{ d.online ? t(LocaleKeys.industry.onvif.online) : t(LocaleKeys.industry.onvif.offline) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <slot />
    </div>
  </section>
</template>
`,

  OnvifRecordPlan: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifRecordPlanProps, OnvifRecordPlanEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifRecordPlanProps>(), {
  slots: () => Array.from({ length: 24 }, (_, i) => i >= 8 && i < 20),
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifRecordPlanEmits>()
const { t } = useLocale()
const local = ref([...(props.slots ?? [])])

watch(() => props.slots, (v) => { local.value = [...(v ?? [])] }, { deep: true })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.recordPlan))
const activeCount = computed(() => local.value.filter(Boolean).length)

function toggleSlot(i: number) {
  if (props.disabled || props.loading) return
  local.value[i] = !local.value[i]
  emit('update:slots', [...local.value])
  emit('toggle', i, local.value[i])
  trackEmit({ component: 'OnvifRecordPlan', type: 'toggle', trackId: props.trackId, telemetry: props.telemetry })
}

function fillAll(on: boolean) {
  if (props.disabled || props.loading) return
  local.value = local.value.map(() => on)
  emit('update:slots', [...local.value])
  trackEmit({ component: 'OnvifRecordPlan', type: on ? 'fill' : 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-record-plan', 'vp-onvif-record-plan__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-record-plan-title"
    data-component="OnvifRecordPlan"
  >
    <header class="vp-onvif-record-plan__header">
      <h3 id="vp-onvif-record-plan-title" class="vp-onvif-record-plan__title">{{ titleText }}</h3>
      <div class="vp-onvif-record-plan__status" role="status" aria-live="polite">{{ activeCount }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-record-plan__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-record-plan__body">
      <p class="vp-onvif-record-plan__muted">{{ t(LocaleKeys.industry.onvif.schedule) }}</p>
      <div class="vp-onvif-record-plan__toolbar">
        <button type="button" class="vp-onvif-record-plan__btn" :disabled="disabled" @click="fillAll(true)">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
        <button type="button" class="vp-onvif-record-plan__btn vp-onvif-record-plan__btn--ghost" :disabled="disabled" @click="fillAll(false)">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <div class="vp-onvif-record-plan__grid-schedule" role="group" :aria-label="t(LocaleKeys.industry.onvif.schedule)">
        <button
          v-for="(on, i) in local"
          :key="i"
          type="button"
          :class="['vp-onvif-record-plan__slot', { 'vp-onvif-record-plan__slot--on': on }]"
          :disabled="disabled"
          :aria-pressed="on"
          @click="toggleSlot(i)"
        />
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  OnvifSettingPanel: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifSettingPanelProps, OnvifSettingPanelEmits, OnvifSettings } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifSettingPanelProps>(), {
  modelValue: () => ({ username: 'admin', password: '', port: 80 }),
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifSettingPanelEmits>()
const { t } = useLocale()
const form = ref<OnvifSettings>({ ...props.modelValue! })

watch(() => props.modelValue, (v) => { if (v) form.value = { ...v } }, { deep: true })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.settings))

function patch(field: keyof OnvifSettings, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value = { ...form.value, [field]: field === 'port' ? Number(raw) : raw }
  emit('update:modelValue', { ...form.value })
}

function submit() {
  if (props.disabled || props.loading) return
  emit('submit', { ...form.value })
  trackEmit({ component: 'OnvifSettingPanel', type: 'submit', trackId: props.trackId, telemetry: props.telemetry })
}

function resetForm() {
  if (props.disabled || props.loading) return
  form.value = { ...(props.modelValue ?? { username: 'admin', password: '', port: 80 }) }
  trackEmit({ component: 'OnvifSettingPanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-setting-panel', 'vp-onvif-setting-panel__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-setting-panel-title"
    data-component="OnvifSettingPanel"
  >
    <header class="vp-onvif-setting-panel__header">
      <h3 id="vp-onvif-setting-panel-title" class="vp-onvif-setting-panel__title">{{ titleText }}</h3>
      <div class="vp-onvif-setting-panel__status" role="status" aria-live="polite">{{ form.port }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-setting-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-onvif-setting-panel__body" @submit.prevent="submit">
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.username) }}</span>
        <input class="vp-onvif-setting-panel__input" :value="form.username" :disabled="disabled" @input="patch('username', $event)" />
      </label>
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.password) }}</span>
        <input type="password" class="vp-onvif-setting-panel__input" :value="form.password" :disabled="disabled" @input="patch('password', $event)" />
      </label>
      <label class="vp-onvif-setting-panel__field">
        <span class="vp-onvif-setting-panel__label">{{ t(LocaleKeys.industry.onvif.port) }}</span>
        <input type="number" class="vp-onvif-setting-panel__input" :value="form.port" :disabled="disabled" @input="patch('port', $event)" />
      </label>
      <div class="vp-onvif-setting-panel__toolbar">
        <button type="submit" class="vp-onvif-setting-panel__btn" :disabled="disabled">{{ t(LocaleKeys.button.submit) }}</button>
        <button type="button" class="vp-onvif-setting-panel__btn vp-onvif-setting-panel__btn--ghost" :disabled="disabled" @click="resetForm">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
`,

  OnvifUrlForm: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifUrlFormProps, OnvifUrlFormEmits } from './types'
import './style.scss'

const BLOCKED = /^javascript:/i
const props = withDefaults(defineProps<OnvifUrlFormProps>(), {
  modelValue: 'rtsp://192.168.1.101/stream1',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifUrlFormEmits>()
const { t } = useLocale()
const url = ref(props.modelValue ?? '')
const invalid = computed(() => BLOCKED.test(url.value.trim()))

watch(() => props.modelValue, (v) => { url.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.url))

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  url.value = v
  emit('update:modelValue', v)
}

function test() {
  if (props.disabled || props.loading) return
  if (invalid.value) {
    emit('invalid')
    trackEmit({ component: 'OnvifUrlForm', type: 'invalid', trackId: props.trackId, telemetry: props.telemetry })
    return
  }
  emit('test', url.value.trim())
  trackEmit({ component: 'OnvifUrlForm', type: 'test', trackId: props.trackId, telemetry: props.telemetry })
}

function resetUrl() {
  if (props.disabled || props.loading) return
  url.value = props.modelValue ?? ''
  trackEmit({ component: 'OnvifUrlForm', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-onvif-url-form', 'vp-onvif-url-form__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-url-form-title"
    data-component="OnvifUrlForm"
  >
    <header class="vp-onvif-url-form__header">
      <h3 id="vp-onvif-url-form-title" class="vp-onvif-url-form__title">{{ titleText }}</h3>
      <div class="vp-onvif-url-form__status" role="status" aria-live="polite">
        {{ invalid ? t(LocaleKeys.industry.onvif.invalidProtocol) : t(LocaleKeys.industry.onvif.testConnection) }}
      </div>
    </header>
    <div v-if="loading" class="vp-onvif-url-form__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-onvif-url-form__body" @submit.prevent="test">
      <input class="vp-onvif-url-form__input" type="url" :value="url" :disabled="disabled" :aria-invalid="invalid" @input="onInput" />
      <p v-if="invalid" class="vp-onvif-url-form__error" role="alert">{{ t(LocaleKeys.industry.onvif.invalidProtocol) }}</p>
      <div class="vp-onvif-url-form__toolbar">
        <button type="submit" class="vp-onvif-url-form__btn" :disabled="disabled || invalid">{{ t(LocaleKeys.industry.onvif.testConnection) }}</button>
        <button type="button" class="vp-onvif-url-form__btn vp-onvif-url-form__btn--ghost" :disabled="disabled" @click="resetUrl">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
`,

  VcrBackupTask: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrBackupTaskProps, VcrBackupTaskEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrBackupTaskProps>(), {
  tasks: () => [
    { id: 'bk1', name: 'NVR-Main backup', progress: 72, status: 'running' },
    { id: 'bk2', name: 'IPC-Gate archive', progress: 0, status: 'pending' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrBackupTaskEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.backup))
const isEmpty = computed(() => !props.tasks?.length)

function statusLabel(status: string) {
  if (status === 'running') return t(LocaleKeys.industry.vcr.running)
  if (status === 'done') return t(LocaleKeys.industry.vcr.done)
  return t(LocaleKeys.industry.vcr.pending)
}

function startTask(id: string) {
  if (props.disabled || props.loading) return
  emit('start', id)
  trackEmit({ component: 'VcrBackupTask', type: 'start', trackId: props.trackId, telemetry: props.telemetry })
}

function refreshTasks() {
  trackEmit({ component: 'VcrBackupTask', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-backup-task', 'vp-vcr-backup-task__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-backup-task-title"
    data-component="VcrBackupTask"
  >
    <header class="vp-vcr-backup-task__header">
      <h3 id="vp-vcr-backup-task-title" class="vp-vcr-backup-task__title">{{ titleText }}</h3>
      <div class="vp-vcr-backup-task__status" role="status" aria-live="polite">{{ tasks?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-backup-task__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-backup-task__body">
      <div class="vp-vcr-backup-task__toolbar">
        <button type="button" class="vp-vcr-backup-task__btn" :disabled="disabled" @click="refreshTasks">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled" @click="refreshTasks">
          {{ t(LocaleKeys.button.create) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-backup-task__empty" role="status">{{ t(LocaleKeys.industry.common.noTasks) }}</p>
      <ul v-else class="vp-vcr-backup-task__list" role="list">
        <li v-for="task in tasks" :key="task.id" class="vp-vcr-backup-task__item">
          <span>{{ task.name }}</span>
          <div class="vp-vcr-backup-task__progress" role="progressbar" :aria-valuenow="task.progress" aria-valuemin="0" aria-valuemax="100">
            <div class="vp-vcr-backup-task__progress-bar" :style="{ width: task.progress + '%' }" />
          </div>
          <span class="vp-vcr-backup-task__muted">{{ statusLabel(task.status) }}</span>
          <button type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled || task.status === 'running'" @click="startTask(task.id)">
            {{ t(LocaleKeys.button.confirm) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
`,

  VcrClipCut: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrClipCutProps, VcrClipCutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrClipCutProps>(), {
  start: 0,
  end: 60,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrClipCutEmits>()
const { t } = useLocale()
const s = ref(props.start ?? 0)
const e = ref(props.end ?? 60)

watch(() => props.start, (v) => { s.value = v ?? 0 })
watch(() => props.end, (v) => { e.value = v ?? 0 })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.cut))
const rangeLabel = computed(() => \`\${s.value} – \${e.value}\`)

function patchStart(ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value)
  s.value = v
  emit('update:start', v)
}

function patchEnd(ev: Event) {
  const v = Number((ev.target as HTMLInputElement).value)
  e.value = v
  emit('update:end', v)
}

function cutClip() {
  if (props.disabled || props.loading) return
  emit('cut', { start: s.value, end: e.value })
  trackEmit({ component: 'VcrClipCut', type: 'cut', trackId: props.trackId, telemetry: props.telemetry })
}

function resetRange() {
  if (props.disabled || props.loading) return
  s.value = props.start ?? 0
  e.value = props.end ?? 60
  trackEmit({ component: 'VcrClipCut', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-clip-cut', 'vp-vcr-clip-cut__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-clip-cut-title"
    data-component="VcrClipCut"
  >
    <header class="vp-vcr-clip-cut__header">
      <h3 id="vp-vcr-clip-cut-title" class="vp-vcr-clip-cut__title">{{ titleText }}</h3>
      <div class="vp-vcr-clip-cut__status" role="status" aria-live="polite">{{ rangeLabel }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-clip-cut__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-clip-cut__body">
      <label class="vp-vcr-clip-cut__field">
        <span class="vp-vcr-clip-cut__label">{{ t(LocaleKeys.industry.vcr.clipStart) }}</span>
        <input type="number" class="vp-vcr-clip-cut__input" :value="s" :disabled="disabled" @input="patchStart" />
      </label>
      <label class="vp-vcr-clip-cut__field">
        <span class="vp-vcr-clip-cut__label">{{ t(LocaleKeys.industry.vcr.clipEnd) }}</span>
        <input type="number" class="vp-vcr-clip-cut__input" :value="e" :disabled="disabled" @input="patchEnd" />
      </label>
      <div class="vp-vcr-clip-cut__toolbar">
        <button type="button" class="vp-vcr-clip-cut__btn" :disabled="disabled" @click="cutClip">{{ t(LocaleKeys.industry.vcr.cut) }}</button>
        <button type="button" class="vp-vcr-clip-cut__btn vp-vcr-clip-cut__btn--ghost" :disabled="disabled" @click="resetRange">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  VcrDownloadPanel: `<script setup lang="ts">
import { computed } from 'vue'
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
`,

  VcrMarkPoint: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrMarkPointProps, VcrMarkPointEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrMarkPointProps>(), {
  marks: () => [
    { id: 'm1', time: 120, label: 'Incident A' },
    { id: 'm2', time: 480, label: 'Motion peak' }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrMarkPointEmits>()
const { t } = useLocale()
const label = ref('')
const time = ref(0)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.mark))
const isEmpty = computed(() => !props.marks?.length)

function addMark() {
  if (props.disabled || props.loading || !label.value.trim()) return
  emit('add', { time: time.value, label: label.value.trim() })
  label.value = ''
  trackEmit({ component: 'VcrMarkPoint', type: 'add', trackId: props.trackId, telemetry: props.telemetry })
}

function selectMark(id: string) {
  if (props.disabled || props.loading) return
  emit('select', id)
  trackEmit({ component: 'VcrMarkPoint', type: 'select', trackId: props.trackId, telemetry: props.telemetry })
}

function removeMark(id: string) {
  if (props.disabled || props.loading) return
  emit('remove', id)
  trackEmit({ component: 'VcrMarkPoint', type: 'remove', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-mark-point', 'vp-vcr-mark-point__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-mark-point-title"
    data-component="VcrMarkPoint"
  >
    <header class="vp-vcr-mark-point__header">
      <h3 id="vp-vcr-mark-point-title" class="vp-vcr-mark-point__title">{{ titleText }}</h3>
      <div class="vp-vcr-mark-point__status" role="status" aria-live="polite">{{ marks?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-mark-point__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-mark-point__body">
      <label class="vp-vcr-mark-point__field">
        <span class="vp-vcr-mark-point__label">{{ t(LocaleKeys.industry.vcr.addMark) }}</span>
        <input v-model="label" class="vp-vcr-mark-point__input" :disabled="disabled" />
      </label>
      <div class="vp-vcr-mark-point__toolbar">
        <button type="button" class="vp-vcr-mark-point__btn" :disabled="disabled || !label.trim()" @click="addMark">
          {{ t(LocaleKeys.industry.vcr.addMark) }}
        </button>
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="label = ''">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-mark-point__empty" role="status">{{ t(LocaleKeys.industry.common.noMarks) }}</p>
      <ul v-else class="vp-vcr-mark-point__list" role="list">
        <li v-for="m in marks" :key="m.id" class="vp-vcr-mark-point__item">
          <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="selectMark(m.id)">{{ m.label }}</button>
          <span class="vp-vcr-mark-point__muted">{{ m.time }}</span>
          <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--danger" :disabled="disabled" @click="removeMark(m.id)">
            {{ t(LocaleKeys.button.delete) }}
          </button>
        </li>
      </ul>
      <slot />
    </div>
  </section>
</template>
`,

  VcrSearchPanel: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrSearchPanelProps, VcrSearchPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrSearchPanelProps>(), {
  date: '2026-07-14',
  device: 'IPC-001',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrSearchPanelEmits>()
const { t } = useLocale()
const d = ref(props.date ?? '')
const dev = ref(props.device ?? '')

watch(() => props.date, (v) => { d.value = v ?? '' })
watch(() => props.device, (v) => { dev.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.common.search))

function search() {
  if (props.disabled || props.loading) return
  emit('search')
  trackEmit({ component: 'VcrSearchPanel', type: 'search', trackId: props.trackId, telemetry: props.telemetry })
}

function resetForm() {
  if (props.disabled || props.loading) return
  d.value = props.date ?? ''
  dev.value = props.device ?? ''
  trackEmit({ component: 'VcrSearchPanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-search-panel', 'vp-vcr-search-panel__panel', props.class]"
    :style="style"
    role="search"
    aria-labelledby="vp-vcr-search-panel-title"
    data-component="VcrSearchPanel"
  >
    <header class="vp-vcr-search-panel__header">
      <h3 id="vp-vcr-search-panel-title" class="vp-vcr-search-panel__title">{{ titleText }}</h3>
      <div class="vp-vcr-search-panel__status" role="status" aria-live="polite">{{ dev }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-search-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <form v-else class="vp-vcr-search-panel__body" @submit.prevent="search">
      <label class="vp-vcr-search-panel__field">
        <span class="vp-vcr-search-panel__label">{{ t(LocaleKeys.industry.vcr.searchDate) }}</span>
        <input class="vp-vcr-search-panel__input" type="date" :value="d" :disabled="disabled" @input="d = ($event.target as HTMLInputElement).value; emit('update:date', d)" />
      </label>
      <label class="vp-vcr-search-panel__field">
        <span class="vp-vcr-search-panel__label">{{ t(LocaleKeys.industry.vcr.searchDevice) }}</span>
        <input class="vp-vcr-search-panel__input" :value="dev" :disabled="disabled" @input="dev = ($event.target as HTMLInputElement).value; emit('update:device', dev)" />
      </label>
      <div class="vp-vcr-search-panel__toolbar">
        <button type="submit" class="vp-vcr-search-panel__btn" :disabled="disabled">{{ t(LocaleKeys.common.search) }}</button>
        <button type="button" class="vp-vcr-search-panel__btn vp-vcr-search-panel__btn--ghost" :disabled="disabled" @click="resetForm">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </form>
  </section>
</template>
`,

  VcrSpeedControl: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrSpeedControlProps, VcrSpeedControlEmits, VcrSpeed } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrSpeedControlProps>(), {
  modelValue: 1,
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrSpeedControlEmits>()
const { t } = useLocale()
const speeds: VcrSpeed[] = [0.5, 1, 2, 4, 8]

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.speed))
const currentLabel = computed(() => String(props.modelValue ?? 1))

function pickSpeed(s: VcrSpeed) {
  if (props.disabled || props.loading) return
  emit('update:modelValue', s)
  emit('change', s)
  trackEmit({ component: 'VcrSpeedControl', type: 'change', trackId: props.trackId, telemetry: props.telemetry })
}

function resetSpeed() {
  if (props.disabled || props.loading) return
  emit('update:modelValue', 1)
  emit('change', 1)
  trackEmit({ component: 'VcrSpeedControl', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-speed-control', 'vp-vcr-speed-control__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-speed-control-title"
    data-component="VcrSpeedControl"
  >
    <header class="vp-vcr-speed-control__header">
      <h3 id="vp-vcr-speed-control-title" class="vp-vcr-speed-control__title">{{ titleText }}</h3>
      <div class="vp-vcr-speed-control__status" role="status" aria-live="polite">{{ currentLabel }}x</div>
    </header>
    <div v-if="loading" class="vp-vcr-speed-control__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-speed-control__body">
      <div class="vp-vcr-speed-control__speeds" role="group" :aria-label="titleText">
        <button
          v-for="s in speeds"
          :key="s"
          type="button"
          :class="['vp-vcr-speed-control__btn', { 'vp-vcr-speed-control__btn--active': modelValue === s }]"
          :disabled="disabled"
          :aria-pressed="modelValue === s"
          @click="pickSpeed(s)"
        >
          {{ s }}x
        </button>
      </div>
      <div class="vp-vcr-speed-control__toolbar">
        <button type="button" class="vp-vcr-speed-control__btn vp-vcr-speed-control__btn--ghost" :disabled="disabled" @click="resetSpeed">
          {{ t(LocaleKeys.button.reset) }}
        </button>
        <button type="button" class="vp-vcr-speed-control__btn" :disabled="disabled" @click="pickSpeed(1)">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  VcrStorageDashboard: `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VcrStorageDashboardProps, VcrStorageDashboardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VcrStorageDashboardProps>(), {
  volumes: () => [
    { id: 'v1', name: 'RAID-01', used: 7200, total: 10000 },
    { id: 'v2', name: 'RAID-02', used: 3100, total: 8000 }
  ],
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VcrStorageDashboardEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.vcr.storage))
const isEmpty = computed(() => !props.volumes?.length)

function pct(used: number, total: number) {
  return total ? Math.round((used / total) * 100) : 0
}

function refresh() {
  if (props.disabled || props.loading) return
  emit('refresh')
  trackEmit({ component: 'VcrStorageDashboard', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

function exportStats() {
  trackEmit({ component: 'VcrStorageDashboard', type: 'export', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-vcr-storage-dashboard', 'vp-vcr-storage-dashboard__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-vcr-storage-dashboard-title"
    data-component="VcrStorageDashboard"
  >
    <header class="vp-vcr-storage-dashboard__header">
      <h3 id="vp-vcr-storage-dashboard-title" class="vp-vcr-storage-dashboard__title">{{ titleText }}</h3>
      <div class="vp-vcr-storage-dashboard__status" role="status" aria-live="polite">{{ volumes?.length ?? 0 }}</div>
    </header>
    <div v-if="loading" class="vp-vcr-storage-dashboard__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-vcr-storage-dashboard__body">
      <div class="vp-vcr-storage-dashboard__toolbar">
        <button type="button" class="vp-vcr-storage-dashboard__btn" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.button.refresh) }}
        </button>
        <button type="button" class="vp-vcr-storage-dashboard__btn vp-vcr-storage-dashboard__btn--ghost" :disabled="disabled" @click="exportStats">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
      </div>
      <p v-if="isEmpty" class="vp-vcr-storage-dashboard__empty" role="status">{{ t(LocaleKeys.industry.common.noData) }}</p>
      <div v-else class="vp-vcr-storage-dashboard__stats">
        <div v-for="vol in volumes" :key="vol.id" class="vp-vcr-storage-dashboard__stat">
          <span class="vp-vcr-storage-dashboard__label">{{ vol.name }}</span>
          <span class="vp-vcr-storage-dashboard__stat-value">{{ pct(vol.used, vol.total) }}%</span>
          <div class="vp-vcr-storage-dashboard__progress"><div class="vp-vcr-storage-dashboard__progress-bar" :style="{ width: pct(vol.used, vol.total) + '%' }" /></div>
          <span class="vp-vcr-storage-dashboard__muted">{{ t(LocaleKeys.industry.vcr.used) }} / {{ t(LocaleKeys.industry.vcr.total) }}</span>
        </div>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  VcrTimelinePlayer: `<script setup lang="ts">
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
const timeLabel = computed(() => \`\${pos.value} / \${props.duration ?? 0}\`)

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
`,

  VideoAdjust: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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
`,

  VideoPreview: `<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoPreviewProps, VideoPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoPreviewProps>(), {
  src: null,
  poster: '',
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoPreviewEmits>()
const { t } = useLocale()
const url = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
const isFs = ref(false)
const playing = ref(false)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.cell))
const fsLabel = computed(() => (isFs.value ? t(LocaleKeys.industry.video.exitFullscreen) : t(LocaleKeys.industry.video.fullscreen)))
const statusLabel = computed(() => (url.value ? (playing.value ? t(LocaleKeys.industry.video.play) : t(LocaleKeys.industry.video.pause)) : t(LocaleKeys.industry.video.noSignal)))

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
  if (!document.fullscreenElement) {
    el.requestFullscreen?.()
    isFs.value = true
  } else {
    document.exitFullscreen?.()
    isFs.value = false
  }
  emit('fullscreen', isFs.value)
  trackEmit({ component: 'VideoPreview', type: 'fullscreen', trackId: props.trackId, telemetry: props.telemetry })
}

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused) {
    v.play()
    playing.value = true
    emit('play')
  } else {
    v.pause()
    playing.value = false
    emit('pause')
  }
  trackEmit({ component: 'VideoPreview', type: playing.value ? 'play' : 'pause', trackId: props.trackId, telemetry: props.telemetry })
}

onBeforeUnmount(() => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
})
</script>

<template>
  <section
    :class="['vp-video-preview', 'vp-video-preview__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-preview-title"
    data-component="VideoPreview"
  >
    <header class="vp-video-preview__header">
      <h3 id="vp-video-preview-title" class="vp-video-preview__title">{{ titleText }}</h3>
      <div class="vp-video-preview__status" role="status" aria-live="polite">{{ statusLabel }}</div>
    </header>
    <div v-if="loading" class="vp-video-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-preview__body">
      <div class="vp-video-preview__wrap">
        <video
          v-if="url"
          ref="videoRef"
          class="vp-video-preview__video"
          :src="url"
          :poster="poster"
          :controls="controls"
          :autoplay="autoplay"
          :loop="loop"
          :muted="muted"
          @play="playing = true; emit('play')"
          @pause="playing = false; emit('pause')"
          @error="emit('error')"
        />
        <p v-else class="vp-video-preview__empty" role="status">{{ t(LocaleKeys.industry.video.noSignal) }}</p>
      </div>
      <div v-if="url" class="vp-video-preview__controls">
        <button type="button" class="vp-video-preview__btn" @click="togglePlay">
          {{ playing ? t(LocaleKeys.industry.video.pause) : t(LocaleKeys.industry.video.play) }}
        </button>
        <button type="button" class="vp-video-preview__btn vp-video-preview__btn--ghost" @click="toggleFs">{{ fsLabel }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
`,

  VideoSnapshot: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { VideoSnapshotProps, VideoSnapshotEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VideoSnapshotProps>(), {
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<VideoSnapshotEmits>()
const { t } = useLocale()
const preview = ref('')
const canvasRef = ref<HTMLCanvasElement | null>(null)

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.video.snapshot))
const hasPreview = computed(() => !!preview.value)

function capture() {
  if (props.disabled || props.loading) return
  const v = props.videoRef
  const c = canvasRef.value
  if (!v || !c || !v.videoWidth) return
  c.width = v.videoWidth
  c.height = v.videoHeight
  const ctx = c.getContext('2d')
  if (!ctx) return
  ctx.drawImage(v, 0, 0)
  preview.value = c.toDataURL('image/png')
  emit('capture', preview.value)
  trackEmit({ component: 'VideoSnapshot', type: 'capture', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  preview.value = ''
  trackEmit({ component: 'VideoSnapshot', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section
    :class="['vp-video-snapshot', 'vp-video-snapshot__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-video-snapshot-title"
    data-component="VideoSnapshot"
  >
    <header class="vp-video-snapshot__header">
      <h3 id="vp-video-snapshot-title" class="vp-video-snapshot__title">{{ titleText }}</h3>
      <div class="vp-video-snapshot__status" role="status" aria-live="polite">
        {{ hasPreview ? t(LocaleKeys.industry.video.capture) : t(LocaleKeys.industry.common.noData) }}
      </div>
    </header>
    <div v-if="loading" class="vp-video-snapshot__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-video-snapshot__body">
      <div class="vp-video-snapshot__toolbar">
        <button type="button" class="vp-video-snapshot__btn" :disabled="disabled" @click="capture">
          {{ t(LocaleKeys.industry.video.capture) }}
        </button>
        <button type="button" class="vp-video-snapshot__btn vp-video-snapshot__btn--ghost" :disabled="disabled || !hasPreview" @click="clearPreview">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <canvas ref="canvasRef" class="vp-video-snapshot__canvas" aria-hidden="true" />
      <div v-if="hasPreview" class="vp-video-snapshot__preview">
        <img :src="preview" :alt="t(LocaleKeys.industry.video.snapshot)" />
      </div>
      <p v-else class="vp-video-snapshot__empty" role="status">{{ t(LocaleKeys.industry.common.noData) }}</p>
      <slot />
    </div>
  </section>
</template>
`,

  VideoVolume: `<script setup lang="ts">
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
`,

  VideoWatermark: `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
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
`

}

// Write styles for all components
for (const name of COMPONENTS) {
  const prefix = `vp-${kebab(name)}`
  const dir = join(baseDir, name)
  const stylePath = join(dir, 'style.scss')
  let extra = ''
  if (name === 'VideoPreview') {
    extra = `
  &__controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    margin-top: var(--spacing-sm);
  }`
  }
  if (name === 'VideoAdjust') {
    extra = `
  &__control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }`
  }
  writeFileSync(stylePath, expandStyle(prefix, extra))
}

const LOCALE_PACKS = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

const COMMON_INDUSTRY_KEYS = {
  'industry.common.noData': {
    'zh-CN': '暂无数据',
    'zh-TW': '暫無資料',
    'en-US': 'No data',
    'ja-JP': 'データがありません',
    'ko-KR': '데이터 없음',
    'ko-KP': '데이터 없음',
    'ru-RU': 'Нет данных'
  },
  'industry.common.noLogs': {
    'zh-CN': '暂无日志',
    'zh-TW': '暫無日誌',
    'en-US': 'No logs',
    'ja-JP': 'ログがありません',
    'ko-KR': '로그 없음',
    'ko-KP': '로그 없음',
    'ru-RU': 'Нет журналов'
  },
  'industry.common.noAlarms': {
    'zh-CN': '暂无告警',
    'zh-TW': '暫無告警',
    'en-US': 'No alarms',
    'ja-JP': 'アラームがありません',
    'ko-KR': '알람 없음',
    'ko-KP': '알람 없음',
    'ru-RU': 'Нет тревог'
  },
  'industry.common.noChannels': {
    'zh-CN': '暂无通道',
    'zh-TW': '暫無通道',
    'en-US': 'No channels',
    'ja-JP': 'チャンネルがありません',
    'ko-KR': '채널 없음',
    'ko-KP': '채널 없음',
    'ru-RU': 'Нет каналов'
  },
  'industry.common.noTasks': {
    'zh-CN': '暂无任务',
    'zh-TW': '暫無任務',
    'en-US': 'No tasks',
    'ja-JP': 'タスクがありません',
    'ko-KR': '작업 없음',
    'ko-KP': '작업 없음',
    'ru-RU': 'Нет задач'
  },
  'industry.common.noMarks': {
    'zh-CN': '暂无标记',
    'zh-TW': '暫無標記',
    'en-US': 'No marks',
    'ja-JP': 'マークがありません',
    'ko-KR': '마크 없음',
    'ko-KP': '마크 없음',
    'ru-RU': 'Нет меток'
  },
  'industry.common.noQueue': {
    'zh-CN': '暂无队列',
    'zh-TW': '暫無佇列',
    'en-US': 'No queue items',
    'ja-JP': 'キューがありません',
    'ko-KR': '대기열 없음',
    'ko-KP': '대기열 없음',
    'ru-RU': 'Очередь пуста'
  }
}

function patchKeysTs() {
  const keysPath = join(root, 'packages/locale/keys.ts')
  let src = readFileSync(keysPath, 'utf8')
  if (src.includes('industry.common.noData')) return false
  src = src.replace(
    '  industry: {\n    video: {',
    `  industry: {
    common: {
      noData: 'industry.common.noData',
      noLogs: 'industry.common.noLogs',
      noAlarms: 'industry.common.noAlarms',
      noChannels: 'industry.common.noChannels',
      noTasks: 'industry.common.noTasks',
      noMarks: 'industry.common.noMarks',
      noQueue: 'industry.common.noQueue'
    },
    video: {`
  )
  writeFileSync(keysPath, src)
  return true
}

function patchIndustryLocales() {
  let touched = 0
  for (const locale of LOCALE_PACKS) {
    const path = join(root, 'packages/locale', locale, 'industry.ts')
    if (!existsSync(path)) continue
    let src = readFileSync(path, 'utf8')
    if (src.includes("'industry.common.noData'")) continue
    const lines = Object.entries(COMMON_INDUSTRY_KEYS).map(
      ([key, map]) => `  '${key}': '${map[locale]}',`
    )
    src = src.replace('export default {', `export default {\n${lines.join('\n')}`)
    writeFileSync(path, src)
    touched += 1
  }
  return touched
}

const written = { styles: [], types: [], vue: [] }

for (const name of COMPONENTS) {
  const dir = join(baseDir, name)
  if (typesFiles[name]) {
    writeFileSync(join(dir, 'types.ts'), typesFiles[name])
    written.types.push(name)
  }
  if (vueFiles[name]) {
    writeFileSync(join(dir, 'index.vue'), vueFiles[name])
    written.vue.push(name)
  }
}

const keysPatched = patchKeysTs()
const localesPatched = patchIndustryLocales()

console.log('[deepen-industry-shells]', {
  styles: COMPONENTS.length,
  types: written.types.length,
  vue: written.vue.length,
  keysPatched,
  localesPatched
})
