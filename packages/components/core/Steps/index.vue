<script setup lang="ts">
import { computed, provide, reactive, toRef } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { STEPS_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    active?: number
    modelValue?: number
    direction?: 'horizontal' | 'vertical'
    clickable?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    active: 0,
    direction: 'horizontal',
    clickable: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:active': [index: number]
  'update:modelValue': [index: number]
  change: [index: number]
}>()

const order = reactive<symbol[]>([])

const active = computed(() =>
  props.modelValue !== undefined ? props.modelValue : (props.active ?? 0)
)

function register(id: symbol) {
  if (!order.includes(id)) order.push(id)
}

function unregister(id: symbol) {
  const i = order.indexOf(id)
  if (i >= 0) order.splice(i, 1)
}

function indexOf(id: symbol) {
  return order.indexOf(id)
}

function setActive(index: number) {
  if (index < 0 || index >= order.length) return
  trackEmit({
    component: 'Steps',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { index }
  })
  emit('update:active', index)
  emit('update:modelValue', index)
  emit('change', index)
}

provide(STEPS_INJECTION_KEY, {
  active,
  direction: toRef(props, 'direction'),
  clickable: toRef(props, 'clickable'),
  register,
  unregister,
  indexOf,
  setActive,
  inList: true
})
</script>

<template>
  <ol
    :class="['vp-steps', `vp-steps--${direction}`, props.class]"
    :style="style"
    role="list"
  >
    <slot />
  </ol>
</template>
