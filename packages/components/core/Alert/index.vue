<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { AlertProps, AlertEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AlertProps>(), {
  severity: 'info',
  closable: true,
  showIcon: true
})

const emit = defineEmits<AlertEmits>()

const { t } = useLocale()
const visible = ref(true)

const closeLabel = computed(() => t(LocaleKeys.common.close))

const severityClass = computed(() => {
  const sev = props.severity === 'error' ? 'danger' : props.severity
  return `vp-alert--${sev}`
})

const close = () => {
  visible.value = false
  emit('close')
}
</script>

<template>
  <div v-if="visible" :class="['vp-alert', severityClass, props.class]" :style="style" role="alert">
    <span v-if="showIcon" class="vp-alert__icon" aria-hidden="true">
      <slot name="icon">
        {{ icon || '•' }}
      </slot>
    </span>
    <div class="vp-alert__content">
      <div v-if="title || $slots.title" class="vp-alert__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.description" class="vp-alert__description">
        <slot name="description">{{ description }}</slot>
      </div>
      <div v-if="$slots.default" class="vp-alert__body">
        <slot />
      </div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="vp-alert__close"
      :aria-label="closeLabel"
      @click="close"
    >
      ×
    </button>
  </div>
</template>
