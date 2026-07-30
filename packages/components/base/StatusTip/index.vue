<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

type Severity = 'info' | 'success' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    severity?: Severity
    message?: string
    closable?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    severity: 'info',
    closable: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  close: []
}>()

const { t } = useLocale()
const show = ref(true)

const ICON: Record<Severity, string> = {
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  danger: 'CircleX'
}

const rootClass = computed(() => [
  'vp-status-tip',
  `vp-status-tip--${props.severity}`,
  props.class
])

const iconName = computed(() => ICON[props.severity])

function close() {
  show.value = false
  trackEmit({
    component: 'StatusTip',
    type: 'close',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { severity: props.severity }
  })
  emit('close')
}
</script>

<template>
  <div v-if="show" :class="rootClass" :style="style" role="status" data-component="StatusTip">
    <Icon :name="iconName" size="sm" class="vp-status-tip__icon" aria-hidden="true" />
    <span class="vp-status-tip__text"><slot>{{ message }}</slot></span>
    <button
      v-if="closable"
      type="button"
      class="vp-status-tip__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >
      <Icon name="X" size="sm" />
    </button>
  </div>
</template>
