<script setup lang="ts">
import { computed } from 'vue'
import type { VerticalStepNavProps, VerticalStepNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<VerticalStepNavProps>(), {
  items: () => [],
  direction: 'vertical',
  disabled: false
})
const emit = defineEmits<VerticalStepNavEmits>()

const rootClass = computed(() => [
  'vp-vertical-step-nav',
  `vp-vertical-step-nav--${props.direction}`,
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
    <ol class="vp-vertical-step-nav__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :class="['vp-vertical-step-nav__step', { 'vp-vertical-step-nav__step--active': i === Number(modelValue ?? 0), 'vp-vertical-step-nav__step--done': i < Number(modelValue ?? 0) }]"
      >
        <button type="button" class="vp-vertical-step-nav__dot" :disabled="disabled || item.disabled" @click="selectItem({ ...item, value: i }, $event)">
          {{ i + 1 }}
        </button>
        <span class="vp-vertical-step-nav__label">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
