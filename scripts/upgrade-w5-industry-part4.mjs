#!/usr/bin/env node
/** Part 4: ONVIF + GBS + VCR */
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
  &__btn--danger { background: transparent; border-color: var(--ds-border, var(--border-color)); color: var(--text-primary); }
  &__input, &__select { flex: 1; min-width: 6rem; height: var(--height-md, 2.25rem); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-input-radius, var(--border-radius-md)); padding: 0 var(--spacing-md); background: var(--surface-0, var(--surface-1)); color: var(--text-primary); font-size: var(--font-size-sm); }
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
  &__slot { aspect-ratio: 1; background: var(--surface-2, var(--surface-1)); border: none; cursor: pointer; padding: 0; min-height: var(--spacing-md); }
  &__slot--on { background: var(--primary-400, var(--primary-500)); opacity: 0.7; }
  &__modal { position: fixed; inset: 0; background: color-mix(in srgb, var(--surface-0, var(--surface-1)) 40%, transparent); display: flex; align-items: center; justify-content: center; z-index: 100; }
  &__dialog { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); max-width: 24rem; width: 90%; }
  &__field { display: flex; flex-direction: column; gap: var(--spacing-xs); }
  &__label { font-size: var(--font-size-sm); color: var(--text-secondary); }
  &__timeline { position: relative; height: var(--spacing-xl); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); }
  &__scrubber { width: 100%; accent-color: var(--primary-500); }
  &__tree { list-style: none; margin: 0; padding: 0; }
  &__tree-item { padding: var(--spacing-xs) 0; }
  &__error { color: var(--text-secondary); font-size: var(--font-size-xs); }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

const MOCK_DEVICES = `[
  { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true },
  { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true },
  { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false },
]`

// OnvifSearch
write('OnvifSearch', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifDevice { id: string; name: string; ip: string; port: number; online: boolean }
export interface OnvifSearchProps extends BaseProps { devices?: OnvifDevice[]; filter?: string; loading?: boolean; disabled?: boolean }
export interface OnvifSearchEmits { (e: 'update:filter', v: string): void; (e: 'discover'): void; (e: 'select', device: OnvifDevice): void }
`,
  'index.vue': `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifSearchProps, OnvifSearchEmits, OnvifDevice } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifSearchProps>(), {
  devices: () => ${MOCK_DEVICES},
  filter: '', loading: false, disabled: false
})
const emit = defineEmits<OnvifSearchEmits>()
const { t } = useLocale()
const q = ref(props.filter)
watch(() => props.filter, v => { q.value = v ?? '' })
const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return props.devices ?? []
  return (props.devices ?? []).filter(d => d.name.toLowerCase().includes(s) || d.ip.includes(s))
})
function onFilter(e: Event) { const v = (e.target as HTMLInputElement).value; q.value = v; emit('update:filter', v) }
function discover() { if (!props.disabled && !props.loading) emit('discover') }
function pick(d: OnvifDevice) { emit('select', d) }
</script>
<template>
  <div :class="['vp-onvif-search', 'vp-onvif-search__panel', { 'vp-onvif-search--disabled': disabled }, props.class]" :style="style" data-component="OnvifSearch">
    <h3 class="vp-onvif-search__title">{{ t('industry.onvif.discover') }}</h3>
    <div class="vp-onvif-search__toolbar">
      <input class="vp-onvif-search__input" type="search" :value="q" :placeholder="t('industry.onvif.filter')" :disabled="disabled" @input="onFilter" />
      <button type="button" class="vp-onvif-search__btn" :disabled="disabled || loading" @click="discover">{{ loading ? t('common.loading') : t('industry.onvif.discover') }}</button>
    </div>
    <ul class="vp-onvif-search__list">
      <li v-for="d in filtered" :key="d.id" class="vp-onvif-search__log">
        <button type="button" class="vp-onvif-search__btn vp-onvif-search__btn--ghost" style="width:100%;justify-content:space-between" :disabled="disabled" @click="pick(d)">
          <span>{{ d.name }} · {{ d.ip }}:{{ d.port }}</span>
          <span :class="['vp-onvif-search__badge', d.online ? 'vp-onvif-search__badge--on' : 'vp-onvif-search__badge--off']">{{ d.online ? t('industry.onvif.online') : t('industry.onvif.offline') }}</span>
        </button>
      </li>
      <li v-if="!filtered.length" class="vp-onvif-search__muted">{{ t('industry.onvif.noDevices') }}</li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-onvif-search'),
})

// OnvifDeviceList
write('OnvifDeviceList', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
import type { OnvifDevice } from '../OnvifSearch/types'
export interface OnvifDeviceListProps extends BaseProps { devices?: OnvifDevice[]; disabled?: boolean }
export interface OnvifDeviceListEmits { (e: 'select', device: OnvifDevice): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { OnvifDeviceListProps, OnvifDeviceListEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifDeviceListProps>(), { devices: () => ${MOCK_DEVICES}, disabled: false })
const emit = defineEmits<OnvifDeviceListEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-onvif-device-list', 'vp-onvif-device-list__panel', props.class]" :style="style" data-component="OnvifDeviceList">
    <h3 class="vp-onvif-device-list__title">{{ t('industry.onvif.devices') }}</h3>
    <table class="vp-onvif-device-list__table">
      <thead><tr><th>{{ t('industry.onvif.deviceName') }}</th><th>{{ t('industry.onvif.ip') }}</th><th>{{ t('industry.onvif.port') }}</th><th>{{ t('industry.onvif.status') }}</th></tr></thead>
      <tbody>
        <tr v-for="d in devices" :key="d.id" style="cursor:pointer" @click="emit('select', d)">
          <td>{{ d.name }}</td><td>{{ d.ip }}</td><td>{{ d.port }}</td>
          <td><span :class="['vp-onvif-device-list__badge', d.online ? 'vp-onvif-device-list__badge--on' : 'vp-onvif-device-list__badge--off']">{{ d.online ? t('industry.onvif.online') : t('industry.onvif.offline') }}</span></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>`,
  'style.scss': S('vp-onvif-device-list'),
})

// OnvifChannelManage
write('OnvifChannelManage', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifChannel { id: string; name: string }
export interface OnvifChannelManageProps extends BaseProps { channels?: OnvifChannel[]; disabled?: boolean }
export interface OnvifChannelManageEmits { (e: 'add', name: string): void; (e: 'remove', id: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifChannelManageProps, OnvifChannelManageEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifChannelManageProps>(), {
  channels: () => [{ id: 'ch1', name: 'Channel-01' }, { id: 'ch2', name: 'Channel-02' }],
  disabled: false
})
const emit = defineEmits<OnvifChannelManageEmits>()
const { t } = useLocale()
const newName = ref('')
function add() { if (!newName.value.trim() || props.disabled) return; emit('add', newName.value.trim()); newName.value = '' }
</script>
<template>
  <div :class="['vp-onvif-channel-manage', 'vp-onvif-channel-manage__panel', props.class]" :style="style" data-component="OnvifChannelManage">
    <h3 class="vp-onvif-channel-manage__title">{{ t('industry.onvif.channel') }}</h3>
    <ul class="vp-onvif-channel-manage__list">
      <li v-for="ch in channels" :key="ch.id" class="vp-onvif-channel-manage__toolbar">
        <span>{{ ch.name }}</span>
        <button type="button" class="vp-onvif-channel-manage__btn vp-onvif-channel-manage__btn--danger" :disabled="disabled" @click="emit('remove', ch.id)">{{ t('industry.onvif.removeChannel') }}</button>
      </li>
    </ul>
    <div class="vp-onvif-channel-manage__toolbar">
      <input v-model="newName" class="vp-onvif-channel-manage__input" type="text" :placeholder="t('industry.onvif.channelName')" :disabled="disabled" />
      <button type="button" class="vp-onvif-channel-manage__btn" :disabled="disabled" @click="add">{{ t('industry.onvif.addChannel') }}</button>
    </div>
  </div>
</template>`,
  'style.scss': S('vp-onvif-channel-manage'),
})

// OnvifSettingPanel
write('OnvifSettingPanel', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifSettings { username: string; password: string; port: number }
export interface OnvifSettingPanelProps extends BaseProps { modelValue?: OnvifSettings; disabled?: boolean }
export interface OnvifSettingPanelEmits { (e: 'update:modelValue', v: OnvifSettings): void; (e: 'submit', v: OnvifSettings): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifSettingPanelProps, OnvifSettingPanelEmits, OnvifSettings } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifSettingPanelProps>(), {
  modelValue: () => ({ username: 'admin', password: '', port: 80 }), disabled: false
})
const emit = defineEmits<OnvifSettingPanelEmits>()
const { t } = useLocale()
const form = ref<OnvifSettings>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof OnvifSettings>(k: K, e: Event) {
  form.value[k] = (k === 'port' ? Number((e.target as HTMLInputElement).value) : (e.target as HTMLInputElement).value) as OnvifSettings[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('submit', { ...form.value }) }
</script>
<template>
  <form :class="['vp-onvif-setting-panel', 'vp-onvif-setting-panel__panel', props.class]" :style="style" data-component="OnvifSettingPanel" @submit.prevent="submit">
    <h3 class="vp-onvif-setting-panel__title">{{ t('industry.onvif.settings') }}</h3>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.username') }}</span><input class="vp-onvif-setting-panel__input" type="text" :value="form.username" :disabled="disabled" @input="patch('username', $event)" /></label>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.password') }}</span><input class="vp-onvif-setting-panel__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <label class="vp-onvif-setting-panel__field"><span class="vp-onvif-setting-panel__label">{{ t('industry.onvif.port') }}</span><input class="vp-onvif-setting-panel__input" type="number" :value="form.port" :disabled="disabled" @input="patch('port', $event)" /></label>
    <button type="submit" class="vp-onvif-setting-panel__btn" :disabled="disabled">{{ t('button.save') }}</button>
  </form>
</template>`,
  'style.scss': S('vp-onvif-setting-panel'),
})

// OnvifRecordPlan
write('OnvifRecordPlan', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifRecordPlanProps extends BaseProps { slots?: boolean[]; disabled?: boolean }
export interface OnvifRecordPlanEmits { (e: 'update:slots', v: boolean[]): void; (e: 'toggle', index: number, on: boolean): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifRecordPlanProps, OnvifRecordPlanEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifRecordPlanProps>(), {
  slots: () => Array.from({ length: 24 }, (_, i) => i >= 8 && i < 20), disabled: false
})
const emit = defineEmits<OnvifRecordPlanEmits>()
const { t } = useLocale()
const grid = ref([...(props.slots ?? [])])
watch(() => props.slots, v => { if (v) grid.value = [...v] }, { deep: true })
function toggle(i: number) {
  if (props.disabled) return
  grid.value[i] = !grid.value[i]
  emit('update:slots', [...grid.value])
  emit('toggle', i, grid.value[i])
}
</script>
<template>
  <div :class="['vp-onvif-record-plan', 'vp-onvif-record-plan__panel', props.class]" :style="style" data-component="OnvifRecordPlan">
    <h3 class="vp-onvif-record-plan__title">{{ t('industry.onvif.recordPlan') }}</h3>
    <p class="vp-onvif-record-plan__muted">{{ t('industry.onvif.schedule') }} (24h)</p>
    <div class="vp-onvif-record-plan__grid-schedule">
      <button v-for="(on, i) in grid" :key="i" type="button" :class="['vp-onvif-record-plan__slot', { 'vp-onvif-record-plan__slot--on': on }]" :disabled="disabled" :aria-label="String(i)" @click="toggle(i)" />
    </div>
  </div>
</template>`,
  'style.scss': S('vp-onvif-record-plan'),
})

// OnvifAlarmPanel
write('OnvifAlarmPanel', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifAlarm { id: string; type: string; time: string }
export interface OnvifAlarmPanelProps extends BaseProps { alarms?: OnvifAlarm[]; disabled?: boolean }
export interface OnvifAlarmPanelEmits { (e: 'acknowledge', id: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { OnvifAlarmPanelProps, OnvifAlarmPanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifAlarmPanelProps>(), {
  alarms: () => [
    { id: 'a1', type: 'motion', time: '2026-07-14 10:00:00' },
    { id: 'a2', type: 'tamper', time: '2026-07-14 09:30:00' },
  ],
  disabled: false
})
const emit = defineEmits<OnvifAlarmPanelEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-onvif-alarm-panel', 'vp-onvif-alarm-panel__panel', props.class]" :style="style" data-component="OnvifAlarmPanel">
    <h3 class="vp-onvif-alarm-panel__title">{{ t('industry.onvif.alarm') }}</h3>
    <ul class="vp-onvif-alarm-panel__list">
      <li v-for="a in alarms" :key="a.id" class="vp-onvif-alarm-panel__toolbar">
        <span><strong>{{ a.type }}</strong> · {{ a.time }}</span>
        <button type="button" class="vp-onvif-alarm-panel__btn vp-onvif-alarm-panel__btn--ghost" :disabled="disabled" @click="emit('acknowledge', a.id)">{{ t('industry.gbs.acknowledge') }}</button>
      </li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-onvif-alarm-panel'),
})

// OnvifGroupTree - enhance
write('OnvifGroupTree', {
  'index.vue': `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifGroupTreeProps, OnvifGroupTreeEmits } from './types'
import './style.scss'
type Node = { label: string; value?: unknown; children?: Node[]; disabled?: boolean }
const props = withDefaults(defineProps<OnvifGroupTreeProps & { options?: Node[] }>(), {
  options: () => [
    { label: 'Building A', value: 'g1', children: [{ label: 'Floor 1', value: 'g1-1' }, { label: 'Floor 2', value: 'g1-2' }] },
    { label: 'Building B', value: 'g2', children: [{ label: 'Gate', value: 'g2-1' }] },
  ]
})
const emit = defineEmits<OnvifGroupTreeEmits>()
const { t } = useLocale()
const openMap = ref<Record<string, boolean>>({ 'g1': true })
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : [])
watch(() => props.modelValue, v => { checked.value = Array.isArray(v) ? [...v] : [] })
const roots = computed<Node[]>(() => props.options?.length ? props.options : (Array.isArray(props.data) ? props.data as Node[] : []))
function nid(n: Node, p: string) { return p + '/' + String(n.value ?? n.label) }
function toggle(id: string) { openMap.value = { ...openMap.value, [id]: !openMap.value[id] } }
function onCheck(n: Node, ev: Event) {
  if (n.disabled || props.disabled) return
  const val = n.value ?? n.label
  const box = ev.target as HTMLInputElement
  const next = new Set(checked.value)
  if (box.checked) next.add(val); else next.delete(val)
  checked.value = [...next]
  emit('update:modelValue', checked.value)
  emit('change', checked.value)
}
</script>
<template>
  <div :class="['vp-onvif-group-tree', 'vp-onvif-group-tree__panel', { 'vp-onvif-group-tree--disabled': disabled }, props.class]" :style="style" data-component="OnvifGroupTree">
    <h3 class="vp-onvif-group-tree__title">{{ title ?? t('industry.onvif.group') }}</h3>
    <ul v-if="roots.length" class="vp-onvif-group-tree__tree">
      <li v-for="n in roots" :key="nid(n,'r')" class="vp-onvif-group-tree__tree-item">
        <div class="vp-onvif-group-tree__toolbar">
          <button v-if="n.children?.length" type="button" class="vp-onvif-group-tree__btn vp-onvif-group-tree__btn--ghost" @click="toggle(nid(n,'r'))">{{ openMap[nid(n,'r')] ? '−' : '+' }}</button>
          <input type="checkbox" :disabled="n.disabled || disabled" :checked="checked.includes(n.value ?? n.label)" @change="onCheck(n, $event)" />
          <span>{{ n.label }}</span>
        </div>
        <ul v-if="n.children?.length && openMap[nid(n,'r')]" class="vp-onvif-group-tree__tree" style="padding-left:var(--spacing-lg)">
          <li v-for="c in n.children" :key="nid(c,nid(n,'r'))" class="vp-onvif-group-tree__tree-item">
            <div class="vp-onvif-group-tree__toolbar">
              <input type="checkbox" :disabled="c.disabled || disabled" :checked="checked.includes(c.value ?? c.label)" @change="onCheck(c, $event)" />
              <span>{{ c.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="vp-onvif-group-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>`,
  'style.scss': S('vp-onvif-group-tree'),
})

// OnvifUrlForm
write('OnvifUrlForm', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface OnvifUrlFormProps extends BaseProps { modelValue?: string; disabled?: boolean }
export interface OnvifUrlFormEmits { (e: 'update:modelValue', v: string): void; (e: 'test', url: string): void; (e: 'invalid'): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifUrlFormProps, OnvifUrlFormEmits } from './types'
import './style.scss'
const BLOCKED = /^javascript:/i
const props = withDefaults(defineProps<OnvifUrlFormProps>(), { modelValue: 'rtsp://192.168.1.101/stream1', disabled: false })
const emit = defineEmits<OnvifUrlFormEmits>()
const { t } = useLocale()
const url = ref(props.modelValue ?? '')
const invalid = computed(() => BLOCKED.test(url.value.trim()))
watch(() => props.modelValue, v => { url.value = v ?? '' })
function onInput(e: Event) { const v = (e.target as HTMLInputElement).value; url.value = v; emit('update:modelValue', v) }
function test() { if (invalid.value) { emit('invalid'); return } emit('test', url.value.trim()) }
</script>
<template>
  <form :class="['vp-onvif-url-form', 'vp-onvif-url-form__panel', props.class]" :style="style" data-component="OnvifUrlForm" @submit.prevent="test">
    <h3 class="vp-onvif-url-form__title">{{ t('industry.onvif.url') }}</h3>
    <input class="vp-onvif-url-form__input" type="url" :value="url" :disabled="disabled" @input="onInput" />
    <p v-if="invalid" class="vp-onvif-url-form__error">{{ t('industry.onvif.invalidProtocol') }}</p>
    <button type="submit" class="vp-onvif-url-form__btn" :disabled="disabled || invalid">{{ t('industry.onvif.testConnection') }}</button>
  </form>
</template>`,
  'style.scss': S('vp-onvif-url-form'),
})

console.log('Part 4a done (ONVIF)')
