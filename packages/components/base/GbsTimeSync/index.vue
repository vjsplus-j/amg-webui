<script setup lang="ts">
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
</template>