<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { OnvifDeviceListProps, OnvifDeviceListEmits } from './types'
import './style.scss'
const props = withDefaults(defineProps<OnvifDeviceListProps>(), { devices: () => [
  { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true },
  { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true },
  { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false },
], disabled: false })
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
</template>