<script setup lang="ts">
import { computed } from 'vue'
import type { FooterNavProps, FooterNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<FooterNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<FooterNavEmits>()

const rootClass = computed(() => [
  'vp-footer-nav',
  `vp-footer-nav--${props.direction}`,
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
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="item.href ?? item.to ?? '#'"
      :class="['vp-footer-nav__link', { 'vp-footer-nav__link--active': (item.value ?? item.label) === modelValue }]"
      @click.prevent="selectItem(item, $event)"
    >{{ item.label }}</a>
  </nav>
</template>
