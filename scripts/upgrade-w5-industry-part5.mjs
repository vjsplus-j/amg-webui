#!/usr/bin/env node
/** Part 5: GBS + VCR */
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
  &__field { display: flex; flex-direction: column; gap: var(--spacing-xs); }
  &__label { font-size: var(--font-size-sm); color: var(--text-secondary); }
  &__list { list-style: none; margin: 0; padding: 0; max-height: 12rem; overflow: auto; }
  &__log { font-family: var(--font-family-mono, monospace); font-size: var(--font-size-xs); padding: var(--spacing-xs) 0; border-bottom: 1px solid var(--ds-border, var(--border-color)); }
  &__badge { display: inline-block; padding: 0 var(--spacing-sm); border-radius: var(--border-radius-sm, var(--border-radius-md)); font-size: var(--font-size-xs); }
  &__badge--on { background: var(--primary-100, var(--primary-500)); color: var(--primary-700, var(--primary-500)); }
  &__badge--off { background: var(--surface-2, var(--surface-1)); color: var(--text-secondary); }
  &__progress { height: var(--spacing-sm); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); overflow: hidden; }
  &__progress-bar { height: 100%; background: var(--primary-500); }
  &__stat { display: flex; flex-direction: column; gap: var(--spacing-xs); padding: var(--spacing-md); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); }
  &__stat-value { font-size: var(--font-size-xl); font-weight: 600; }
  &__modal { position: fixed; inset: 0; background: color-mix(in srgb, var(--surface-0, var(--surface-1)) 40%, transparent); display: flex; align-items: center; justify-content: center; z-index: 100; }
  &__dialog { background: var(--surface-1); border: 1px solid var(--ds-border, var(--border-color)); border-radius: var(--theme-card-radius, var(--border-radius-md)); padding: var(--theme-card-pad, var(--spacing-md)); max-width: 24rem; width: 90%; }
  &__timeline { height: var(--spacing-xl); background: var(--surface-2, var(--surface-1)); border-radius: var(--border-radius-sm, var(--border-radius-md)); }
  &__scrubber { width: 100%; accent-color: var(--primary-500); }
  &__tree { list-style: none; margin: 0; padding: 0; }
  &__tree-item { padding: var(--spacing-xs) 0; }
  &--disabled { opacity: 0.55; pointer-events: none; }
}`

// GbsGatewayForm
write('GbsGatewayForm', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsGateway { gatewayId: string; sipDomain: string; sipPort: number; password: string; realm: string }
export interface GbsGatewayFormProps extends BaseProps { modelValue?: GbsGateway; disabled?: boolean }
export interface GbsGatewayFormEmits { (e: 'update:modelValue', v: GbsGateway): void; (e: 'submit', v: GbsGateway): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsGatewayFormProps, GbsGatewayFormEmits, GbsGateway } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsGatewayFormProps>(), {
  modelValue: () => ({ gatewayId: '34020000001320000001', sipDomain: '3402000000', sipPort: 5060, password: '', realm: '3402000000' }),
  disabled: false
})
const emit = defineEmits<GbsGatewayFormEmits>()
const { t } = useLocale()
const form = ref<GbsGateway>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof GbsGateway>(k: K, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'sipPort' ? Number(raw) : raw) as GbsGateway[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('submit', { ...form.value }) }
</script>
<template>
  <form :class="['vp-gbs-gateway-form', 'vp-gbs-gateway-form__panel', props.class]" :style="style" data-component="GbsGatewayForm" @submit.prevent="submit">
    <h3 class="vp-gbs-gateway-form__title">{{ t('industry.gbs.gatewayId') }}</h3>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.gatewayId') }}</span><input class="vp-gbs-gateway-form__input" :value="form.gatewayId" :disabled="disabled" @input="patch('gatewayId', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipDomain') }}</span><input class="vp-gbs-gateway-form__input" :value="form.sipDomain" :disabled="disabled" @input="patch('sipDomain', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.sipPort') }}</span><input class="vp-gbs-gateway-form__input" type="number" :value="form.sipPort" :disabled="disabled" @input="patch('sipPort', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.realm') }}</span><input class="vp-gbs-gateway-form__input" :value="form.realm" :disabled="disabled" @input="patch('realm', $event)" /></label>
    <label class="vp-gbs-gateway-form__field"><span class="vp-gbs-gateway-form__label">{{ t('industry.gbs.password') }}</span><input class="vp-gbs-gateway-form__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <button type="submit" class="vp-gbs-gateway-form__btn" :disabled="disabled">{{ t('button.save') }}</button>
  </form>
</template>`,
  'style.scss': S('vp-gbs-gateway-form'),
})

// GbsDeviceTree
write('GbsDeviceTree', {
  'index.vue': `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsDeviceTreeProps, GbsDeviceTreeEmits } from './types'
import './style.scss'
type Node = { label: string; value?: unknown; children?: Node[]; disabled?: boolean }
const props = withDefaults(defineProps<GbsDeviceTreeProps & { options?: Node[] }>(), {
  options: () => [
    { label: 'Region-01', value: 'r1', children: [{ label: 'IPC-001', value: 'd1' }, { label: 'IPC-002', value: 'd2' }] },
    { label: 'Region-02', value: 'r2', children: [{ label: 'NVR-001', value: 'd3' }] },
  ]
})
const emit = defineEmits<GbsDeviceTreeEmits>()
const { t } = useLocale()
const openMap = ref<Record<string, boolean>>({ r1: true })
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : [])
watch(() => props.modelValue, v => { checked.value = Array.isArray(v) ? [...v] : [] })
const roots = computed(() => props.options?.length ? props.options : (Array.isArray(props.data) ? props.data as Node[] : []))
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
  <div :class="['vp-gbs-device-tree', 'vp-gbs-device-tree__panel', { 'vp-gbs-device-tree--disabled': disabled }, props.class]" :style="style" data-component="GbsDeviceTree">
    <h3 class="vp-gbs-device-tree__title">{{ title ?? t('industry.gbs.deviceId') }}</h3>
    <ul v-if="roots.length" class="vp-gbs-device-tree__tree">
      <li v-for="n in roots" :key="nid(n,'r')" class="vp-gbs-device-tree__tree-item">
        <div class="vp-gbs-device-tree__toolbar">
          <button v-if="n.children?.length" type="button" class="vp-gbs-device-tree__btn vp-gbs-device-tree__btn--ghost" @click="toggle(nid(n,'r'))">{{ openMap[nid(n,'r')] ? '−' : '+' }}</button>
          <input type="checkbox" :disabled="n.disabled || disabled" :checked="checked.includes(n.value ?? n.label)" @change="onCheck(n, $event)" />
          <span>{{ n.label }}</span>
        </div>
        <ul v-if="n.children?.length && openMap[nid(n,'r')]" class="vp-gbs-device-tree__tree" style="padding-left:var(--spacing-lg)">
          <li v-for="c in n.children" :key="nid(c,nid(n,'r'))" class="vp-gbs-device-tree__tree-item">
            <div class="vp-gbs-device-tree__toolbar">
              <input type="checkbox" :disabled="c.disabled || disabled" :checked="checked.includes(c.value ?? c.label)" @change="onCheck(c, $event)" />
              <span>{{ c.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="vp-gbs-device-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>`,
  'style.scss': S('vp-gbs-device-tree'),
})

// GbsCascadePanel
write('GbsCascadePanel', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsCascadePanelProps extends BaseProps { upstream?: string; downstream?: string; disabled?: boolean }
export interface GbsCascadePanelEmits { (e: 'update:upstream', v: string): void; (e: 'update:downstream', v: string): void; (e: 'save'): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsCascadePanelProps, GbsCascadePanelEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsCascadePanelProps>(), { upstream: '34020000001110000001', downstream: '34020000001320000002', disabled: false })
const emit = defineEmits<GbsCascadePanelEmits>()
const { t } = useLocale()
const up = ref(props.upstream), down = ref(props.downstream)
watch(() => props.upstream, v => { up.value = v ?? '' })
watch(() => props.downstream, v => { down.value = v ?? '' })
</script>
<template>
  <div :class="['vp-gbs-cascade-panel', 'vp-gbs-cascade-panel__panel', props.class]" :style="style" data-component="GbsCascadePanel">
    <h3 class="vp-gbs-cascade-panel__title">{{ t('industry.gbs.cascade') }}</h3>
    <label class="vp-gbs-cascade-panel__field"><span class="vp-gbs-cascade-panel__label">{{ t('industry.gbs.upstream') }}</span><input class="vp-gbs-cascade-panel__input" :value="up" :disabled="disabled" @input="up = ($event.target as HTMLInputElement).value; emit('update:upstream', up)" /></label>
    <label class="vp-gbs-cascade-panel__field"><span class="vp-gbs-cascade-panel__label">{{ t('industry.gbs.downstream') }}</span><input class="vp-gbs-cascade-panel__input" :value="down" :disabled="disabled" @input="down = ($event.target as HTMLInputElement).value; emit('update:downstream', down)" /></label>
    <button type="button" class="vp-gbs-cascade-panel__btn" :disabled="disabled" @click="emit('save')">{{ t('button.save') }}</button>
  </div>
</template>`,
  'style.scss': S('vp-gbs-cascade-panel'),
})

// GbsSignMonitor
write('GbsSignMonitor', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsSignEntry { id: string; type: string; message: string; time: string }
export interface GbsSignMonitorProps extends BaseProps { logs?: GbsSignEntry[]; disabled?: boolean }
export interface GbsSignMonitorEmits { (e: 'refresh'): void }
`,
  'index.vue': `<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { GbsSignMonitorProps, GbsSignMonitorEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsSignMonitorProps>(), {
  logs: () => [
    { id: '1', type: 'REGISTER', message: 'SIP/2.0 200 OK', time: '10:00:01' },
    { id: '2', type: 'KEEPALIVE', message: 'MESSAGE sip:...', time: '10:00:31' },
    { id: '3', type: 'INVITE', message: 'INVITE sip:340200...', time: '10:01:05' },
  ],
  disabled: false
})
const emit = defineEmits<GbsSignMonitorEmits>()
const { t } = useLocale()
</script>
<template>
  <div :class="['vp-gbs-sign-monitor', 'vp-gbs-sign-monitor__panel', props.class]" :style="style" data-component="GbsSignMonitor">
    <div class="vp-gbs-sign-monitor__toolbar">
      <h3 class="vp-gbs-sign-monitor__title">{{ t('industry.gbs.signLog') }}</h3>
      <button type="button" class="vp-gbs-sign-monitor__btn vp-gbs-sign-monitor__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <ul class="vp-gbs-sign-monitor__list">
      <li v-for="l in logs" :key="l.id" class="vp-gbs-sign-monitor__log"><span class="vp-gbs-sign-monitor__badge vp-gbs-sign-monitor__badge--on">{{ l.type }}</span> {{ l.time }} — {{ l.message }}</li>
    </ul>
  </div>
</template>`,
  'style.scss': S('vp-gbs-sign-monitor'),
})

// GbsAlarmModal
write('GbsAlarmModal', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsAlarmModalProps extends BaseProps { open?: boolean; title?: string; description?: string; disabled?: boolean }
export interface GbsAlarmModalEmits { (e: 'update:open', v: boolean): void; (e: 'acknowledge'): void; (e: 'close'): void }
`,
  'index.vue': `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsAlarmModalProps, GbsAlarmModalEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsAlarmModalProps>(), { open: false, disabled: false })
const emit = defineEmits<GbsAlarmModalEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('industry.gbs.alarmTitle'))
const descText = computed(() => props.description ?? t('industry.gbs.alarmDesc'))
function close() { emit('update:open', false); emit('close') }
function ack() { emit('acknowledge'); close() }
</script>
<template>
  <div v-if="open" class="vp-gbs-alarm-modal__modal" data-component="GbsAlarmModal" @click.self="close">
    <div class="vp-gbs-alarm-modal__dialog" :class="props.class" :style="style">
      <h3 class="vp-gbs-alarm-modal__title">{{ titleText }}</h3>
      <p class="vp-gbs-alarm-modal__muted">{{ descText }}</p>
      <div class="vp-gbs-alarm-modal__toolbar">
        <button type="button" class="vp-gbs-alarm-modal__btn" :disabled="disabled" @click="ack">{{ t('industry.gbs.acknowledge') }}</button>
        <button type="button" class="vp-gbs-alarm-modal__btn vp-gbs-alarm-modal__btn--ghost" @click="close">{{ t('button.cancel') }}</button>
      </div>
      <slot />
    </div>
  </div>
</template>`,
  'style.scss': S('vp-gbs-alarm-modal'),
})

// GbsRegisterForm
write('GbsRegisterForm', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsRegister { deviceId: string; sipDomain: string; expires: number; password: string }
export interface GbsRegisterFormProps extends BaseProps { modelValue?: GbsRegister; disabled?: boolean }
export interface GbsRegisterFormEmits { (e: 'update:modelValue', v: GbsRegister): void; (e: 'register', v: GbsRegister): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsRegisterFormProps, GbsRegisterFormEmits, GbsRegister } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsRegisterFormProps>(), {
  modelValue: () => ({ deviceId: '34020000001320000001', sipDomain: '3402000000', expires: 3600, password: '' }),
  disabled: false
})
const emit = defineEmits<GbsRegisterFormEmits>()
const { t } = useLocale()
const form = ref<GbsRegister>({ ...props.modelValue! })
watch(() => props.modelValue, v => { if (v) form.value = { ...v } }, { deep: true })
function patch<K extends keyof GbsRegister>(k: K, e: Event) {
  const raw = (e.target as HTMLInputElement).value
  form.value[k] = (k === 'expires' ? Number(raw) : raw) as GbsRegister[K]
  emit('update:modelValue', { ...form.value })
}
function submit() { emit('register', { ...form.value }) }
</script>
<template>
  <form :class="['vp-gbs-register-form', 'vp-gbs-register-form__panel', props.class]" :style="style" data-component="GbsRegisterForm" @submit.prevent="submit">
    <h3 class="vp-gbs-register-form__title">{{ t('industry.gbs.register') }}</h3>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.deviceId') }}</span><input class="vp-gbs-register-form__input" :value="form.deviceId" :disabled="disabled" @input="patch('deviceId', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.sipDomain') }}</span><input class="vp-gbs-register-form__input" :value="form.sipDomain" :disabled="disabled" @input="patch('sipDomain', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.expires') }}</span><input class="vp-gbs-register-form__input" type="number" :value="form.expires" :disabled="disabled" @input="patch('expires', $event)" /></label>
    <label class="vp-gbs-register-form__field"><span class="vp-gbs-register-form__label">{{ t('industry.gbs.password') }}</span><input class="vp-gbs-register-form__input" type="password" :value="form.password" :disabled="disabled" @input="patch('password', $event)" /></label>
    <button type="submit" class="vp-gbs-register-form__btn" :disabled="disabled">{{ t('industry.gbs.register') }}</button>
  </form>
</template>`,
  'style.scss': S('vp-gbs-register-form'),
})

// GbsTimeSync
write('GbsTimeSync', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsTimeSyncProps extends BaseProps { server?: string; disabled?: boolean; syncing?: boolean }
export interface GbsTimeSyncEmits { (e: 'sync'): void; (e: 'update:server', v: string): void }
`,
  'index.vue': `<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsTimeSyncProps, GbsTimeSyncEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsTimeSyncProps>(), { server: 'ntp.pool.org', disabled: false, syncing: false })
const emit = defineEmits<GbsTimeSyncEmits>()
const { t } = useLocale()
const srv = ref(props.server)
watch(() => props.server, v => { srv.value = v ?? '' })
</script>
<template>
  <div :class="['vp-gbs-time-sync', 'vp-gbs-time-sync__panel', props.class]" :style="style" data-component="GbsTimeSync">
    <h3 class="vp-gbs-time-sync__title">{{ t('industry.gbs.timeSync') }}</h3>
    <input class="vp-gbs-time-sync__input" :value="srv" :disabled="disabled" @input="srv = ($event.target as HTMLInputElement).value; emit('update:server', srv)" />
    <button type="button" class="vp-gbs-time-sync__btn" :disabled="disabled || syncing" @click="emit('sync')">{{ syncing ? t('common.loading') : t('industry.gbs.syncNow') }}</button>
  </div>
</template>`,
  'style.scss': S('vp-gbs-time-sync'),
})

// GbsStatusCard
write('GbsStatusCard', {
  'types.ts': `import type { BaseProps } from '@amg-webui/types'
export interface GbsStatusCardProps extends BaseProps { registered?: boolean; deviceCount?: number; channelCount?: number; disabled?: boolean }
export interface GbsStatusCardEmits { (e: 'refresh'): void }
`,
  'index.vue': `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsStatusCardProps, GbsStatusCardEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<GbsStatusCardProps>(), { registered: true, deviceCount: 12, channelCount: 48, disabled: false })
const emit = defineEmits<GbsStatusCardEmits>()
const { t } = useLocale()
const sipLabel = computed(() => props.registered ? t('industry.gbs.registered') : t('industry.gbs.unregistered'))
</script>
<template>
  <div :class="['vp-gbs-status-card', 'vp-gbs-status-card__panel', props.class]" :style="style" data-component="GbsStatusCard">
    <div class="vp-gbs-status-card__toolbar">
      <h3 class="vp-gbs-status-card__title">{{ t('industry.gbs.status') }}</h3>
      <button type="button" class="vp-gbs-status-card__btn vp-gbs-status-card__btn--ghost" :disabled="disabled" @click="emit('refresh')">{{ t('button.refresh') }}</button>
    </div>
    <div class="vp-gbs-status-card__toolbar" style="align-items:stretch">
      <div class="vp-gbs-status-card__stat"><span class="vp-gbs-status-card__label">{{ t('industry.gbs.sipStatus') }}</span><span class="vp-gbs-status-card__stat-value"><span :class="['vp-gbs-status-card__badge', registered ? 'vp-gbs-status-card__badge--on' : 'vp-gbs-status-card__badge--off']">{{ sipLabel }}</span></span></div>
      <div class="vp-gbs-status-card__stat"><span class="vp-gbs-status-card__label">{{ t('industry.gbs.deviceCount') }}</span><span class="vp-gbs-status-card__stat-value">{{ deviceCount }}</span></div>
      <div class="vp-gbs-status-card__stat"><span class="vp-gbs-status-card__label">{{ t('industry.gbs.channelCount') }}</span><span class="vp-gbs-status-card__stat-value">{{ channelCount }}</span></div>
    </div>
  </div>
</template>`,
  'style.scss': S('vp-gbs-status-card'),
})

console.log('Part 5a done (GBS)')
