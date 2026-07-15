<script setup lang="ts">
import { computed } from 'vue'
import type { StepNavProps, StepNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<StepNavProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<StepNavEmits>()

const rootClass = computed(() => [
  'vp-step-nav',
  `vp-step-nav--${props.direction}`,
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
    <ol class="vp-step-nav__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :class="['vp-step-nav__step', { 'vp-step-nav__step--active': i === Number(modelValue ?? 0), 'vp-step-nav__step--done': i < Number(modelValue ?? 0) }]"
      >
        <button type="button" class="vp-step-nav__dot" :disabled="disabled || item.disabled" @click="selectItem({ ...item, value: i }, $event)">
          {{ i + 1 }}
        </button>
        <span class="vp-step-nav__label">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
