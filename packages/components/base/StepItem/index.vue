<script setup lang="ts">
import { inject, computed, getCurrentInstance, ref } from 'vue'
import type { StepItemProps } from './types'
import { STEPS_INJECTION_KEY } from '../Steps/types'
import './style.scss'

const props = defineProps<StepItemProps>()

const ctx = inject(STEPS_INJECTION_KEY, {
  active: ref(0),
  direction: ref<'horizontal' | 'vertical'>('horizontal')
})

const instance = getCurrentInstance()
const index = computed(() => {
  const parent = instance?.parent
  if (!parent) return 0
  const slotNodes = parent.slots.default?.() ?? []
  const self = instance.vnode
  return slotNodes.findIndex((vn) => vn === self || vn.type === self?.type)
})

const state = computed(() => {
  const active = ctx.active.value
  if (index.value < active) return 'done'
  if (index.value === active) return 'active'
  return 'wait'
})

const indicatorClass = computed(() => [
  'vp-step-item__indicator',
  {
    'vp-step-item__indicator--active': state.value === 'active',
    'vp-step-item__indicator--done': state.value === 'done'
  }
])
</script>

<template>
  <li :class="['vp-step-item', props.class]" :style="style">
    <span :class="indicatorClass">
      <slot name="icon">{{ index + 1 }}</slot>
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
    <span class="vp-step-item__tail" aria-hidden="true" />
  </li>
</template>
