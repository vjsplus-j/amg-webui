<script setup lang="ts">
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
</template>