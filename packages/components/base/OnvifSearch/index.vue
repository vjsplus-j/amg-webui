<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifSearchProps, OnvifSearchEmits, OnvifDevice } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifSearchProps>(), {
  devices: () => [
  { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true },
  { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true },
  { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false },
],
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
      <li v-for="d in filtered" :key="d.id" class="vp-onvif-search__item">
        <button type="button" class="vp-onvif-search__btn vp-onvif-search__btn--ghost vp-onvif-search__row" :disabled="disabled" @click="pick(d)">
          <span class="vp-onvif-search__device-name">{{ d.name }} · {{ d.ip }}:{{ d.port }}</span>
          <span :class="['vp-onvif-search__badge', d.online ? 'vp-onvif-search__badge--on' : 'vp-onvif-search__badge--off']">{{ d.online ? t('industry.onvif.online') : t('industry.onvif.offline') }}</span>
        </button>
      </li>
      <li v-if="!filtered.length" class="vp-onvif-search__muted">{{ t('industry.onvif.noDevices') }}</li>
    </ul>
  </div>
</template>