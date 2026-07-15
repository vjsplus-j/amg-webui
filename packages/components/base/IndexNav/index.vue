<script setup lang="ts">
import { computed } from 'vue'
import type { IndexNavProps, IndexNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<IndexNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<IndexNavEmits>()

const rootClass = computed(() => [
  'vp-index-nav',
  `vp-index-nav--${props.direction}`,
  props.class
])

const letters = computed(() => {
  const fromItems = (props.items ?? []).map((i) => String(i.label).charAt(0).toUpperCase())
  return fromItems.length ? fromItems : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
})

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
      v-for="(letter, i) in letters"
      :key="i"
      type="button"
      :class="['vp-index-nav__item', { 'vp-index-nav__item--active': modelValue === letter }]"
      :disabled="disabled"
      @click="selectItem({ label: letter, value: letter }, $event)"
    >{{ letter }}</button>
  </nav>
</template>
