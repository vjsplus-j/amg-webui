#!/usr/bin/env node
/** Part 6: VCR suite */
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
  &__panel { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); }
  &__muted { color: var(--text-secondary); font-size: var(--font-size-sm); }
  &__toolbar { display: flex; flex-wrap: wrap; gap: var(--spacing-md); align-items: center; }
  &__btn { appearance: none; border: 1px solid transparent; background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-radius: var(--theme-btn-radius, var(--border-radius-md)); height: var(--height-md, 2.25rem); padding: 0 var(--spacing-lg); cursor: pointer; font-size: var(--font-size-sm); }
  &__btn:disabled { opacity: 0.55; cursor: not-allowed; }
  &__btn--ghost { background: transparent; border-color: var(--ds-border, var(--border-color)); color: var(--text-primary); }
  &__btn--active { background: var(--primary-600, var(--primary-500)); }
  &__input, &__select { flex: 1; min-width: 6rem; height: var(--height-md, 2.25rem); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-input-radius, var(--border-radius-md)); padding: 0 var(--spacing-md); background: var(--surface-0, var(--surface-1)); color: var(--text-primary); font-size: var(--font-size-sm); }
  &__field { display: flex; flex-direction: column; gap: var(--spacing-xs); }
  &__label { font-size: var(--font-size-sm); color: var(--text-secondary); }
  &__list { list-style: none; margin: 0; padding: 0; }
  &__item { padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--ds-border, var(--border-color)); display: flex; justify-content: space-between; align-items: center; gap: var(--spacing-md); }
  &__badge { display: inline-block; padding: 0 var(--spacing-sm); border-radius: var(--border-radius-sm, var(--border-radius-md)); font-size: var(--font-size-xs); background: var(--surface-2, var(--surface-1)); }
  &__progress { height: var(--spacing-sm); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); overflow: hidden; flex: 1; }
  &__progress-bar { height: 100%; background: var(--primary-500); }
  &__timeline { padding: var(--spacing-md) 0; }
  &__scrubber { width: 100%; accent-color: var(--primary-500); }
  &__speeds { display: flex; gap: var(--spacing-sm); flex-wrap: wrap; }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

// VcrSearchPanel
write('VcrSearchPanel', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrSearchPanelProps extends BaseProps { date?: string; device?: string; disabled?: boolean; loading?: boolean }
export interface VcrSearchPanelEmits { (e: 'update:date', v: string): void; (e: 'update:device', v: string): void; (e: 'search'): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrSearchPanelProps, VcrSearchPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrSearchPanelProps>(), { date: '2026-07-14', device: 'IPC-001', disabled: false, loading: false })
const emit = defineEmits<VcrSearchPanelEmits>()
const { t } = useLocale()
const d = ref(props.date), dev = ref(props.device)
watch(() => props.date, v => { d.value = v ?? '' })
watch(() => props.device, v => { dev.value = v ?? '' })
</script>
<template>
  <form :class="['vp-vcr-search-panel', 'vp-vcr-search-panel__panel', props.class]" :style="style" data-component="VcrSearchPanel" @submit.prevent="emit('search')">
    <h3 class="vp-vcr-search-panel__title">{{ t('common.search') }}</h3>
    <label class="vp-vcr-search-panel__field"><span class="vp-vcr-search-panel__label">{{ t('industry.vcr.searchDate') }}</span><input class="vp-vcr-search-panel__input" type="date" :value="d" :disabled="disabled" @input="d = ($event.target as HTMLInputElement).value; emit('update:date', d)" /></label>
    <label class="vp-vcr-search-panel__field"><span class="vp-vcr-search-panel__label">{{ t('industry.vcr.searchDevice') }}</span><input class="vp-vcr-search-panel__input" :value="dev" :disabled="disabled" @input="dev = ($event.target as HTMLInputElement).value; emit('update:device', dev)" /></label>
    <button type="submit" class="vp-vcr-search-panel__btn" :disabled="disabled || loading">{{ loading ? t('common.loading') : t('common.search') }}</button>
  </form>
</template>`,
  'style.scss': S('vp-vcr-search-panel'),
})

// VcrTimelinePlayer
write('VcrTimelinePlayer', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrTimelinePlayerProps extends BaseProps { currentTime?: number; duration?: number; disabled?: boolean }
export interface VcrTimelinePlayerEmits { (e: 'update:currentTime', v: number): void; (e: 'seek', v: number): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrTimelinePlayerProps, VcrTimelinePlayerEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrTimelinePlayerProps>(), { currentTime: 0, duration: 3600, disabled: false })
const emit = defineEmits<VcrTimelinePlayerEmits>()
const { t } = useLocale()
const pos = ref(props.currentTime)
watch(() => props.currentTime, v => { pos.value = v ?? 0 })
const label = computed(() => {
  const fmt = (s: number) => { const m = Math.floor(s/60), sec = Math.floor(s%60); return String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0') }
  return fmt(pos.value) + ' / ' + fmt(props.duration ?? 0)
})
function onSeek(e: Event) { const v = Number((e.target as HTMLInputElement).value); pos.value = v; emit('update:currentTime', v); emit('seek', v) }
</script>
<template>
  <div :class="['vp-vcr-timeline-player', 'vp-vcr-timeline-player__panel', props.class]" :style="style" data-component="VcrTimelinePlayer">
    <h3 class="vp-vcr-timeline-player__title">{{ t('industry.vcr.timeline') }}</h3>
    <p class="vp-vcr-timeline-player__muted">{{ t('industry.vcr.currentTime') }}: {{ label }}</p>
    <div class="vp-vcr-timeline-player__timeline">
      <input class="vp-vcr-timeline-player__scrubber" type="range" min="0" :max="duration" :value="pos" :disabled="disabled" @input="onSeek" />
    </div>
    <slot />
  </div>
</template>`,
  'style.scss': S('vp-vcr-timeline-player'),
})

// VcrSpeedControl
write('VcrSpeedControl', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export type VcrSpeed = 0.5 | 1 | 2 | 4 | 8
export interface VcrSpeedControlProps extends BaseProps { modelValue?: VcrSpeed; disabled?: boolean }
export interface VcrSpeedControlEmits { (e: 'update:modelValue', v: VcrSpeed): void; (e: 'change', v: VcrSpeed): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrSpeedControlProps, VcrSpeedControlEmits, VcrSpeed } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrSpeedControlProps>(), { modelValue: 1, disabled: false })
const emit = defineEmits<VcrSpeedControlEmits>()
const { t } = useLocale()
const speeds: VcrSpeed[] = [0.5, 1, 2, 4, 8]
function pick(s: VcrSpeed) { if (!props.disabled) { emit('update:modelValue', s); emit('change', s) } }
</script>
<template>
  <div :class="['vp-vcr-speed-control', 'vp-vcr-speed-control__panel', props.class]" :style="style" data-component="VcrSpeedControl">
    <h3 class="vp-vcr-speed-control__title">{{ t('industry.vcr.speed') }}</h3>
    <div class="vp-vcr-speed-control__speeds">
      <button v-for="s in speeds" :key="s" type="button" :class="['vp-vcr-speed-control__btn', { 'vp-vcr-speed-control__btn--active': modelValue === s }]" :disabled="disabled" @click="pick(s)">{{ s }}×</button>
    </div>
  </div>
</template>`,
  'style.scss': S('vp-vcr-speed-control'),
})

// VcrClipCut
write('VcrClipCut', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrClipCutProps extends BaseProps { start?: number; end?: number; disabled?: boolean }
export interface VcrClipCutEmits { (e: 'update:start', v: number): void; (e: 'update:end', v: number): void; (e: 'cut', range: { start: number; end: number }): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrClipCutProps, VcrClipCutEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrClipCutProps>(), { start: 0, end: 60, disabled: false })
const emit = defineEmits<VcrClipCutEmits>()
const { t } = useLocale()
const s = ref(props.start), e = ref(props.end)
watch(() => props.start, v => { s.value = v ?? 0 })
watch(() => props.end, v => { e.value = v ?? 0 })
function cut() { emit('cut', { start: s.value, end: e.value }) }
</script>
<template>
  <div :class="['vp-vcr-clip-cut', 'vp-vcr-clip-cut__panel', props.class]" :style="style" data-component="VcrClipCut">
    <h3 class="vp-vcr-clip-cut__title">{{ t('industry.vcr.cut') }}</h3>
    <label class="vp-vcr-clip-cut__field"><span class="vp-vcr-clip-cut__label">{{ t('industry.vcr.clipStart') }}</span><input class="vp-vcr-clip-cut__input" type="number" min="0" :value="s" :disabled="disabled" @input="s = Number(($event.target as HTMLInputElement).value); emit('update:start', s)" /></label>
    <label class="vp-vcr-clip-cut__field"><span class="vp-vcr-clip-cut__label">{{ t('industry.vcr.clipEnd') }}</span><input class="vp-vcr-clip-cut__input" type="number" min="0" :value="e" :disabled="disabled" @input="e = Number(($event.target as HTMLInputElement).value); emit('update:end', e)" /></label>
    <button type="button" class="vp-vcr-clip-cut__btn" :disabled="disabled" @click="cut">{{ t('industry.vcr.cut') }}</button>
  </div>
</template>`,
  'style.scss': S('vp-vcr-clip-cut'),
})

// VcrDownloadPanel
write('VcrDownloadPanel', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrDownloadItem { id: string; name: string; progress: number; status: 'pending' | 'running' | 'done' }
export interface VcrDownloadPanelProps extends BaseProps { items?: VcrDownloadItem[]; disabled?: boolean }
export interface VcrDownloadPanelEmits { (e: 'download', id: string): void; (e: 'cancel', id: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrDownloadPanelProps, VcrDownloadPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrDownloadPanelProps>(), {
  items: () => [
    { id: 'dl1', name: 'clip-20260714-1000.mp4', progress: 100, status: 'done' },
    { id: 'dl2', name: 'clip-20260714-1030.mp4', progress: 45, status: 'running' },
    { id: 'dl3', name: 'clip-20260714-1100.mp4', progress: 0, status: 'pending' },
  ],
  disabled: false
})
const emit = defineEmits<VcrDownloadPanelEmits>()
const { t } = useLocale()
const statusKey = (s: string) => s === 'done' ? t('industry.vcr.done') : s === 'running' ? t('industry.vcr.running') : t('industry.vcr.pending')
</script>
<template>
  <div :class="['vp-vcr-download-panel', 'vp-vcr-download-panel__panel', props.class]" :style="style" data-component="VcrDownloadPanel">
    <h3 class="vp-vcr-download-panel__title">{{ t('industry.vcr.queue') }}</h3>
    <ul class="vp-vcr-download-panel__list">
      <li v-for="item in items" :key="item.id" class="vp-vcr-download-panel__item">
        <div style="flex:1;min-width:0">
          <div>{{ item.name }}</div>
          <div class="vp-vcr-download-panel__progress"><div class="vp-vcr-download-panel__progress-bar" :style="{ width: item.progress + '%' }" /></div>
        </div>
        <span class="vp-vcr-download-panel__badge">{{ statusKey(item.status) }}</span>
        <button v-if="item.status === 'pending'" type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled" @click="emit('download', item.id)">{{ t('industry.vcr.download') }}</button>
        <button v-else-if="item.status === 'running'" type="button" class="vp-vcr-download-panel__btn vp-vcr-download-panel__btn--ghost" :disabled="disabled" @click="emit('cancel', item.id)">{{ t('button.cancel') }}</button>
      </li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-vcr-download-panel'),
})

// VcrBackupTask
write('VcrBackupTask', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrBackupTaskItem { id: string; name: string; progress: number; status: 'pending' | 'running' | 'done' }
export interface VcrBackupTaskProps extends BaseProps { tasks?: VcrBackupTaskItem[]; disabled?: boolean }
export interface VcrBackupTaskEmits { (e: 'start', id: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { VcrBackupTaskProps, VcrBackupTaskEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrBackupTaskProps>(), {
  tasks: () => [
    { id: 'bk1', name: 'NVR-Main backup', progress: 72, status: 'running' },
    { id: 'bk2', name: 'IPC-Gate archive', progress: 0, status: 'pending' },
  ],
  disabled: false
})
const emit = defineEmits<VcrBackupTaskEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-vcr-backup-task', 'vp-vcr-backup-task__panel', props.class]" :style="style" data-component="VcrBackupTask">
    <h3 class="vp-vcr-backup-task__title">{{ t('industry.vcr.backup') }}</h3>
    <ul class="vp-vcr-backup-task__list">
      <li v-for="task in tasks" :key="task.id" class="vp-vcr-backup-task__item">
        <span>{{ task.name }}</span>
        <div class="vp-vcr-backup-task__progress" style="width:6rem"><div class="vp-vcr-backup-task__progress-bar" :style="{ width: task.progress + '%' }" /></div>
        <button v-if="task.status === 'pending'" type="button" class="vp-vcr-backup-task__btn vp-vcr-backup-task__btn--ghost" :disabled="disabled" @click="emit('start', task.id)">{{ t('common.play') }}</button>
      </li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-vcr-backup-task'),
})

// VcrMarkPoint
write('VcrMarkPoint', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrMark { id: string; time: number; label: string }
export interface VcrMarkPointProps extends BaseProps { marks?: VcrMark[]; disabled?: boolean }
export interface VcrMarkPointEmits { (e: 'add', mark: Omit<VcrMark, 'id'>): void; (e: 'select', id: string): void; (e: 'remove', id: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrMarkPointProps, VcrMarkPointEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrMarkPointProps>(), {
  marks: () => [
    { id: 'm1', time: 120, label: 'Incident A' },
    { id: 'm2', time: 480, label: 'Motion peak' },
  ],
  disabled: false
})
const emit = defineEmits<VcrMarkPointEmits>()
const { t } = useLocale()
const label = ref('')
function add() {
  if (!label.value.trim() || props.disabled) return
  emit('add', { time: 0, label: label.value.trim() })
  label.value = ''
}
</script>
<template>
  <div :class="['vp-vcr-mark-point', 'vp-vcr-mark-point__panel', props.class]" :style="style" data-component="VcrMarkPoint">
    <h3 class="vp-vcr-mark-point__title">{{ t('industry.vcr.mark') }}</h3>
    <ul class="vp-vcr-mark-point__list">
      <li v-for="m in marks" :key="m.id" class="vp-vcr-mark-point__item">
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="emit('select', m.id)">{{ m.label }} ({{ m.time }}s)</button>
        <button type="button" class="vp-vcr-mark-point__btn vp-vcr-mark-point__btn--ghost" :disabled="disabled" @click="emit('remove', m.id)">{{ t('button.delete') }}</button>
      </li>
    </ul>
    <div class="vp-vcr-mark-point__toolbar">
      <input v-model="label" class="vp-vcr-mark-point__input" type="text" :placeholder="t('industry.vcr.mark')" :disabled="disabled" />
      <button type="button" class="vp-vcr-mark-point__btn" :disabled="disabled" @click="add">{{ t('industry.vcr.addMark') }}</button>
    </div>
  </div>
</template>`,
  'style.scss': S('vp-vcr-mark-point'),
})

// VcrStorageDashboard
write('VcrStorageDashboard', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface VcrStorageVolume { id: string; name: string; used: number; total: number }
export interface VcrStorageDashboardProps extends BaseProps { volumes?: VcrStorageVolume[]; disabled?: boolean }
export interface VcrStorageDashboardEmits { (e: 'refresh'): void }
`,
  'index.vue': `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { VcrStorageDashboardProps, VcrStorageDashboardEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<VcrStorageDashboardProps>(), {
  volumes: () => [
    { id: 'v1', name: 'RAID-01', used: 7200, total: 10000 },
    { id: 'v2', name: 'RAID-02', used: 3100, total: 8000 },
  ],
  disabled: false
})
const emit = defineEmits<VcrStorageDashboardEmits>()
const { t } = useLocale()
function pct(v: { used: number; total: number }) { return v.total ? Math.round((v.used / v.total) * 100) : 0 }
</script>
<template>
  <div :class="['vp-vcr-storage-dashboard', 'vp-vcr-storage-dashboard__panel', props.class]" :style="style" data-component="VcrStorageDashboard">
    <div class="vp-vcr-storage-dashboard__toolbar">
      <h3 class="vp-vcr-storage-dashboard__title">{{ t('industry.vcr.storage') }}</h3>
      <button type="button" class="vp-vcr-storage-dashboard__btn vp-vcr-storage-dashboard__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <ul class="vp-vcr-storage-dashboard__list">
      <li v-for="v in volumes" :key="v.id" class="vp-vcr-storage-dashboard__item" style="flex-direction:column;align-items:stretch">
        <div class="vp-vcr-storage-dashboard__toolbar" style="justify-content:space-between">
          <span>{{ v.name }}</span>
          <span class="vp-vcr-storage-dashboard__muted">{{ t('industry.vcr.used') }} {{ v.used }}GB / {{ t('industry.vcr.total') }} {{ v.total }}GB ({{ pct(v) }}%)</span>
        </div>
        <div class="vp-vcr-storage-dashboard__progress"><div class="vp-vcr-storage-dashboard__progress-bar" :style="{ width: pct(v) + '%' }" /></div>
      </li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-vcr-storage-dashboard'),
})

console.log('Part 6 done (VCR) — all w5_industry upgraded')
