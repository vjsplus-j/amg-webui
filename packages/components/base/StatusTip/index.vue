<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { StatusTipProps, StatusTipEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<StatusTipProps>(), {
  severity: 'info',
  closable: false
})
const emit = defineEmits<StatusTipEmits>()
const { t } = useLocale()
const show = ref(true)

const rootClass = computed(() => [
  'vp-status-tip',
  `vp-status-tip--${props.severity}`,
  props.class
])

function close() {
  show.value = false
  emit('close')
}
</script>

<template>
  <div v-if="show" :class="rootClass" :style="style" role="status">
    <span class="vp-status-tip__icon" aria-hidden="true">•</span>
    <span class="vp-status-tip__text"><slot>{{ message }}</slot></span>
    <button
      v-if="closable"
      type="button"
      class="vp-status-tip__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >×</button>
  </div>
</template>
