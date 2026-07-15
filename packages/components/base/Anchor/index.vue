<script setup lang="ts">
import { computed } from 'vue'
import type { AnchorProps, AnchorEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<AnchorProps>(), {
  items: () => [],
  direction: 'vertical',
  disabled: false
})
const emit = defineEmits<AnchorEmits>()

const rootClass = computed(() => [
  'vp-anchor',
  `vp-anchor--${props.direction}`,
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
      :href="item.href ?? ('#' + (item.value ?? item.label))"
      :class="['vp-anchor__link', { 'vp-anchor__link--active': (item.value ?? item.label) === modelValue }]"
      @click.prevent="selectItem(item, $event)"
    >{{ item.label }}</a>
  </nav>
</template>
