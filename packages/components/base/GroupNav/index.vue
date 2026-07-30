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
    direction: 'vertical',
    disabled: false,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  select: [item: NavItem, event: MouseEvent]
}>()

const { selectItem, isActive } = useNavSelection(props, emit, 'GroupNav')

const rootClass = computed(() => [
  'vp-group-nav',
  `vp-group-nav--${props.direction}`,
  { 'vp-group-nav--disabled': props.disabled },
  props.class
])
</script>

<template>
  <nav :class="rootClass" :style="style" role="navigation" data-component="GroupNav">
    <section v-for="(group, gi) in items" :key="gi" class="vp-group-nav__group">
      <h4 class="vp-group-nav__heading">{{ group.label }}</h4>
      <div class="vp-group-nav__items">
        <button
          v-for="(child, ci) in group.children ?? []"
          :key="ci"
          type="button"
          :class="['vp-group-nav__item', { 'vp-group-nav__item--active': isActive(child) }]"
          :disabled="disabled || child.disabled"
          @click="selectItem(child, $event)"
        >
          {{ child.label }}
        </button>
      </div>
    </section>
  </nav>
</template>
