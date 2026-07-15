<script setup lang="ts">
import { computed } from 'vue'
import type { CardNavProps, CardNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<CardNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<CardNavEmits>()

const rootClass = computed(() => [
  'vp-card-nav',
  `vp-card-nav--${props.direction}`,
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
      :class="['vp-card-nav__card', { 'vp-card-nav__card--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >
      <span class="vp-card-nav__label">{{ item.label }}</span>
      <span v-if="item.icon" class="vp-card-nav__icon">{{ item.icon }}</span>
    </button>
  </nav>
</template>
