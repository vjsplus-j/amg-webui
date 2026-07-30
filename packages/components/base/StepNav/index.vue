<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import type { NavItem } from '@amg-webui/utils/nav'
import type { StepNavProps, StepNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<StepNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<StepNavEmits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-step-nav',
  `vp-step-nav--${props.direction}`,
  { 'vp-step-nav--disabled': props.disabled },
  props.class
])

const ariaLabel = computed(() => t('component.step-nav.title'))

function stepValue(item: NavItem, index: number) {
  return item.value ?? index
}

function isActive(item: NavItem, index: number) {
  return props.modelValue === stepValue(item, index)
}

function isDone(index: number) {
  if (typeof props.modelValue === 'number') return index < props.modelValue
  const idx = props.items.findIndex((it, i) => stepValue(it, i) === props.modelValue)
  return idx >= 0 && index < idx
}

function selectItem(item: NavItem, index: number, e: MouseEvent) {
  if (item.disabled || props.disabled) return
  const v = stepValue(item, index)
  trackEmit({
    component: 'StepNav',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value: v, index }
  })
  emit('update:modelValue', v)
  emit('change', v)
  emit('select', { ...item, value: v }, e)
}
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    role="navigation"
    data-component="StepNav"
    :aria-label="ariaLabel"
  >
    <div
      v-for="(item, i) in items"
      :key="i"
      :class="[
        'vp-step-nav__step',
        {
          'vp-step-nav__step--active': isActive(item, i),
          'vp-step-nav__step--done': isDone(i)
        }
      ]"
    >
      <button
        type="button"
        class="vp-step-nav__dot"
        :disabled="disabled || item.disabled"
        :aria-current="isActive(item, i) ? 'step' : undefined"
        :aria-label="item.label"
        @click="selectItem(item, i, $event)"
      >
        {{ i + 1 }}
      </button>
      <span class="vp-step-nav__label">{{ item.label }}</span>
    </div>
  </nav>
</template>
