<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
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

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
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
