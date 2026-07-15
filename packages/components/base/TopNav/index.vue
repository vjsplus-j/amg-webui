<script setup lang="ts">
import { computed } from 'vue'
import type { TopNavProps, TopNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<TopNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<TopNavEmits>()

const rootClass = computed(() => [
  'vp-top-nav',
  `vp-top-nav--${props.direction}`,
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
  <nav :class="rootClass" :style="style" role="navigation">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-top-nav__item', { 'vp-top-nav__item--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >{{ item.label }}</button>
  </nav>
</template>
