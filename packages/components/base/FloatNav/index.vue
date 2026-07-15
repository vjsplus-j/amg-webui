<script setup lang="ts">
import { computed } from 'vue'
import type { FloatNavProps, FloatNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<FloatNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<FloatNavEmits>()

const rootClass = computed(() => [
  'vp-float-nav',
  `vp-float-nav--${props.direction}`,
  props.class
])

const active = computed({
  get: () => props.modelValue,
  set: (v: string | number) => { emit('update:modelValue', v); emit('change', v) }
})

function selectItem(item: NavItem, e: MouseEvent) {
  if (item.disabled || props.disabled) return
  const v = item.value ?? item.label
  active.value = v
  emit('select', item, e)
}

</script>

<template>
  <nav :class="rootClass" :style="style">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-float-nav__fab', { 'vp-float-nav__fab--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      :title="item.label"
      @click="selectItem(item, $event)"
    >{{ item.icon ?? item.label.charAt(0) }}</button>
  </nav>
</template>
