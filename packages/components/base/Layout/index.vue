<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { LAYOUT_INJECTION_KEY } from './types'
import type { LayoutProps } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<LayoutProps>(),
  {
    hasSider: false,
    direction: 'vertical',
    shell: false,
    fill: false,
    as: 'section',
    telemetry: undefined
  }
)

const siderCount = ref(0)

function registerSider() {
  siderCount.value += 1
}

function unregisterSider() {
  siderCount.value = Math.max(0, siderCount.value - 1)
}

provide(LAYOUT_INJECTION_KEY, {
  direction: toRef(props, 'direction'),
  siderCount,
  registerSider,
  unregisterSider
})

const effectiveHasSider = computed(() => props.hasSider || siderCount.value > 0)

const rootClass = computed(() => [
  'vp-layout',
  {
    'vp-layout--shell': props.shell,
    'vp-layout--fill': props.fill,
    'vp-layout--has-sider': effectiveHasSider.value,
    'vp-layout--horizontal':
      props.direction === 'horizontal' || effectiveHasSider.value,
    'vp-layout--vertical':
      props.direction === 'vertical' && !effectiveHasSider.value
  },
  props.class
])
</script>

<template>
  <component
    :is="as"
    :class="rootClass"
    :style="style"
    data-component="Layout"
    :aria-label="ariaLabel"
  >
    <slot />
  </component>
</template>
