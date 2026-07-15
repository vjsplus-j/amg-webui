<script setup lang="ts">
import { provide, ref, computed } from 'vue'
import type { DescriptionsProps, DescriptionsItemRegistration } from './types'
import { DESCRIPTIONS_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<DescriptionsProps>(), {
  column: 3,
  bordered: false,
  size: 'md'
})

const items = ref<DescriptionsItemRegistration[]>([])

function register(item: DescriptionsItemRegistration) {
  const idx = items.value.findIndex((i) => i.id === item.id)
  if (idx >= 0) {
    items.value[idx] = item
  } else {
    items.value.push(item)
  }
}

function unregister(id: symbol) {
  items.value = items.value.filter((i) => i.id !== id)
}

provide(DESCRIPTIONS_INJECTION_KEY, {
  column: props.column,
  bordered: props.bordered,
  size: props.size,
  labelWidth: props.labelWidth,
  items,
  register,
  unregister
})

const bodyStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.column}, minmax(0, 1fr))`
}))

const rootClass = computed(() => [
  'vp-descriptions',
  `vp-descriptions--size-${props.size}`,
  { 'vp-descriptions--bordered': props.bordered },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style">
    <div v-if="title || $slots.title" class="vp-descriptions__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="vp-descriptions__body" :style="bodyStyle">
      <slot />
    </div>
  </div>
</template>
