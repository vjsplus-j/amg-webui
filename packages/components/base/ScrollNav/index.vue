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
    /** Soft fade on overflow edges (horizontal). Default true. */
    fadeEdges?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    items: () => [],
    direction: 'horizontal',
    fadeEdges: true,
    disabled: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
}>()

const { selectItem, isActive } = useNavSelection(props, emit, 'ScrollNav')

const rootClass = computed(() => [
  'vp-scroll-nav',
  `vp-scroll-nav--${props.direction}`,
  {
    'vp-scroll-nav--disabled': props.disabled,
    'vp-scroll-nav--fade': props.fadeEdges && props.direction === 'horizontal'
  },
  props.class
])
</script>

<template>
  <nav :class="rootClass" :style="style" role="navigation" data-component="ScrollNav">
    <div class="vp-scroll-nav__track">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        :class="['vp-scroll-nav__item', { 'vp-scroll-nav__item--active': isActive(item) }]"
        :disabled="disabled || item.disabled"
        @click="selectItem(item, $event)"
      >{{ item.label }}</button>
    </div>
  </nav>
</template>
