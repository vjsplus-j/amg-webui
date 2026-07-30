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

const { selectItem, isActive } = useNavSelection(props, emit, 'CardNav')

const rootClass = computed(() => [
  'vp-card-nav',
  `vp-card-nav--${props.direction}`,
  { 'vp-card-nav--disabled': props.disabled },
  props.class
])
</script>

<template>
  <nav :class="rootClass" :style="style"  data-component="CardNav">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-card-nav__card', { 'vp-card-nav__card--active': isActive(item) }]"
      :disabled="disabled || item.disabled"
      
      @click="selectItem(item, $event)"
    ><span class="vp-card-nav__label">{{ item.label }}</span>
      <span v-if="item.icon" class="vp-card-nav__icon">{{ item.icon }}</span></button>
  </nav>
</template>
