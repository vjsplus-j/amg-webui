<script setup lang="ts">
import { computed, inject, onBeforeMount, onUnmounted, ref } from 'vue'
import Icon from '../Icon/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import type { StepStatus } from './types'
import { STEPS_INJECTION_KEY } from '../Steps/types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    icon?: string
    status?: StepStatus
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    disabled: false
  }
)

const emit = defineEmits<{
  click: [index: number, event: MouseEvent]
}>()

const fallbackActive = ref(0)
const fallbackDirection = ref<'horizontal' | 'vertical'>('horizontal')
const fallbackClickable = ref(false)

const ctx = inject(STEPS_INJECTION_KEY, {
  active: fallbackActive,
  direction: fallbackDirection,
  clickable: fallbackClickable,
  register: () => undefined,
  unregister: () => undefined,
  indexOf: () => 0,
  setActive: () => undefined
})

const uid = Symbol('vp-step-item')

onBeforeMount(() => {
  ctx.register(uid)
})

onUnmounted(() => {
  ctx.unregister(uid)
})

const index = computed(() => ctx.indexOf(uid))

const state = computed(() => {
  if (props.status) return props.status
  const active = ctx.active.value
  if (index.value < active) return 'finish'
  if (index.value === active) return 'process'
  return 'wait'
})

const indicatorClass = computed(() => [
  'vp-step-item__indicator',
  {
    'vp-step-item__indicator--process': state.value === 'process',
    'vp-step-item__indicator--finish': state.value === 'finish',
    'vp-step-item__indicator--error': state.value === 'error',
    'vp-step-item__indicator--wait': state.value === 'wait'
  }
])

const canClick = computed(
  () => ctx.clickable.value && !props.disabled && state.value !== 'process'
)

function onClick(event: MouseEvent) {
  if (!canClick.value) return
  trackEmit({
    component: 'StepItem',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { index: index.value }
  })
  ctx.setActive(index.value)
  emit('click', index.value, event)
}
</script>

<template>
  <li
    :class="[
      'vp-step-item',
      `vp-step-item--${state}`,
      {
        'vp-step-item--clickable': canClick,
        'vp-step-item--disabled': disabled
      },
      props.class
    ]"
    :style="style"
    role="listitem"
    :aria-current="state === 'process' ? 'step' : undefined"
  >
    <button
      type="button"
      class="vp-step-item__trigger"
      :disabled="disabled"
      :tabindex="canClick ? 0 : -1"
      @click="onClick"
    >
      <span :class="indicatorClass" aria-hidden="true">
        <slot name="icon">
          <Icon v-if="icon" :name="icon" size="sm" />
          <Icon v-else-if="state === 'finish'" name="Check" size="sm" />
          <Icon v-else-if="state === 'error'" name="X" size="sm" />
          <template v-else>{{ index + 1 }}</template>
        </slot>
      </span>
      <div class="vp-step-item__content">
        <div v-if="title || $slots.title" class="vp-step-item__title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="description || $slots.description" class="vp-step-item__description">
          <slot name="description">{{ description }}</slot>
        </div>
        <slot />
      </div>
    </button>
    <span class="vp-step-item__tail" aria-hidden="true" />
  </li>
</template>
