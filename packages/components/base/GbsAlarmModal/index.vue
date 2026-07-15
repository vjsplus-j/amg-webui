<script setup lang="ts">
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
</template>