<script setup lang="ts">
import { computed } from 'vue'
import { useNavSelection, type NavItem } from '@amg-webui/utils/nav'
import './style.scss'

const props = withDefaults(
  defineProps<{
    items?: NavItem[]
    modelValue?: string | number
    disabled?: boolean
    direction?: 'horizontal' | 'vertical'
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    direction: 'horizontal',
    disabled: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
}>()

const { selectItem, isActive } = useNavSelection(props, emit, 'TopNav')

const rootClass = computed(() => [
  'vp-top-nav',
  `vp-top-nav--${props.direction}`,
  { 'vp-top-nav--disabled': props.disabled },
  props.class
])
</script>

<template>
  <nav :class="rootClass" :style="style" role="navigation" data-component="TopNav">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-top-nav__item', { 'vp-top-nav__item--active': isActive(item) }]"
      :disabled="disabled || item.disabled"
      
      @click="selectItem(item, $event)"
    >{{ item.label }}</button>
  </nav>
</template>
