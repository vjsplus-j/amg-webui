<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ToastProps, ToastEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ToastProps>(), {
  visible: true,
  severity: 'info',
  duration: 3000,
  closable: true,
  position: 'top-right'
})
const emit = defineEmits<ToastEmits>()
const { t } = useLocale()

let timer: ReturnType<typeof setTimeout> | undefined

const rootClass = computed(() => [
  'vp-toast',
  `vp-toast--${props.severity}`,
  `vp-toast--${props.position}`,
  props.class
])

function close() {
  emit('update:visible', false)
  emit('close')
}

function arm() {
  if (timer) clearTimeout(timer)
  if (props.duration > 0 && props.visible) {
    timer = setTimeout(() => close(), props.duration)
  }
}

watch(() => [props.visible, props.duration] as const, () => arm(), { immediate: true })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-toast-fade">
      <div v-if="visible" :class="rootClass" :style="style" role="status">
        <div class="vp-toast__body">
          <h4 v-if="title || $slots.title" class="vp-toast__title">
            <slot name="title">{{ title }}</slot>
          </h4>
          <p v-if="message || $slots.default" class="vp-toast__message">
            <slot>{{ message }}</slot>
          </p>
        </div>
        <button
          v-if="closable"
          type="button"
          class="vp-toast__close"
          :aria-label="t(LocaleKeys.common.close)"
          @click="close"
        >×</button>
      </div>
    </Transition>
  </Teleport>
</template>
