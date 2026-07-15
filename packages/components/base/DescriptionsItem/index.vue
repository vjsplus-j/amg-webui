<script setup lang="ts">
import { inject, computed, onMounted, onUnmounted } from 'vue'
import type { DescriptionsItemProps } from './types'
import { DESCRIPTIONS_INJECTION_KEY } from '../Descriptions/types'
import './style.scss'

const props = withDefaults(defineProps<DescriptionsItemProps>(), {
  span: 1
})

const ctx = inject(DESCRIPTIONS_INJECTION_KEY, null)
const uid = Symbol('vp-descriptions-item')

onMounted(() => {
  ctx?.register({ id: uid, span: props.span })
})

onUnmounted(() => {
  ctx?.unregister(uid)
})

const labelWidthStyle = computed(() => {
  if (!ctx?.labelWidth) return undefined
  const w =
    typeof ctx.labelWidth === 'number' ? `${ctx.labelWidth}px` : ctx.labelWidth
  return { width: w, flexShrink: '0' }
})

const itemStyle = computed(() => ({
  gridColumn: `span ${Math.min(props.span, ctx?.column ?? props.span)}`
}))
</script>

<template>
  <div class="vp-descriptions-item" :style="itemStyle">
    <div
      v-if="label || $slots.label"
      class="vp-descriptions-item__label"
      :style="labelWidthStyle"
    >
      <slot name="label">{{ label }}</slot>
    </div>
    <div class="vp-descriptions-item__content">
      <slot />
    </div>
  </div>
</template>
