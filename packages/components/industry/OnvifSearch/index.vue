<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifSearchProps, OnvifDevice } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifSearchProps>(), {
  devices: () => [
    { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true },
    { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true },
    { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false }
  ],
  filter: '',
  loading: false,
  disabled: false,
  pageSize: 50
})

const emit = defineEmits<{
  (e: 'update:filter', v: string): void
  (e: 'discover'): void
  (e: 'select', device: OnvifDevice): void
}>()
const { t } = useLocale()
const q = ref(props.filter)

watch(
  () => props.filter,
  (v) => {
    q.value = v ?? ''
  }
)

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  const list = props.devices ?? []
  if (!s) return list.slice(0, props.pageSize)
  return list
    .filter((d) => d.name.toLowerCase().includes(s) || d.ip.includes(s))
    .slice(0, props.pageSize)
})

const emptyLabel = computed(() => props.emptyText ?? t('industry.onvif.noDevices'))

function onFilter(e: Event) {
  const v = (e.target as HTMLInputElement).value
  q.value = v
  emit('update:filter', v)
}

function discover() {
  if (!props.disabled && !props.loading) emit('discover')
}

function pick(d: OnvifDevice) {
  if (props.disabled) return
  emit('select', d)
}
</script>

<template>
  <div
    :class="[
      'vp-onvif-search',
      'vp-onvif-search__panel',
      { 'vp-onvif-search--disabled': disabled, 'vp-onvif-search--loading': loading },
      props.class
    ]"
    :style="style"
    data-component="OnvifSearch"
    role="search"
    :aria-busy="loading"
  >
    <h3 class="vp-onvif-search__title">{{ t('industry.onvif.discover') }}</h3>
    <div class="vp-onvif-search__toolbar">
      <input
        class="vp-onvif-search__input"
        type="search"
        :value="q"
        :placeholder="t('industry.onvif.filter')"
        :disabled="disabled"
        :aria-label="t('industry.onvif.filter')"
        @input="onFilter"
      />
      <button
        type="button"
        class="vp-onvif-search__btn"
        :disabled="disabled || loading"
        :aria-label="t('industry.onvif.discover')"
        @click="discover"
      >
        {{ loading ? t('common.loading') : t('industry.onvif.discover') }}
      </button>
    </div>
    <ul class="vp-onvif-search__list" role="listbox" :aria-label="t('industry.onvif.discover')">
      <li v-for="d in filtered" :key="d.id" class="vp-onvif-search__item" role="presentation">
        <button
          type="button"
          class="vp-onvif-search__btn vp-onvif-search__btn--ghost vp-onvif-search__row"
          role="option"
          :disabled="disabled"
          @click="pick(d)"
        >
          <span class="vp-onvif-search__device-name">{{ d.name }} · {{ d.ip }}:{{ d.port }}</span>
          <span
            :class="[
              'vp-onvif-search__badge',
              d.online ? 'vp-onvif-search__badge--on' : 'vp-onvif-search__badge--off'
            ]"
          >
            {{ d.online ? t('industry.onvif.online') : t('industry.onvif.offline') }}
          </span>
        </button>
      </li>
      <li v-if="!filtered.length" class="vp-onvif-search__muted" role="status">{{ emptyLabel }}</li>
    </ul>
  </div>
</template>
