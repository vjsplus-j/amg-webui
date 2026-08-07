<script setup lang="ts">
import { computed } from 'vue'
import type { FooterPadding } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    bordered?: boolean
    align?: 'start' | 'center' | 'end'
    size?: 'sm' | 'md' | 'lg'
    sticky?: boolean
    fixed?: boolean
    padding?: FooterPadding
    class?: string
    style?: Record<string, string>
  }>(),
  {
    bordered: true,
    align: 'center',
    size: 'md',
    sticky: false,
    fixed: false,
    padding: 'page'
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const padMap: Record<FooterPadding, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  page: 'var(--vp-layout-chrome-pad-x, var(--theme-page-pad))'
}

const rootClass = computed(() => [
  'vp-footer',
  `vp-footer--align-${props.align}`,
  `vp-footer--${props.size}`,
  `vp-footer--pad-${props.padding}`,
  {
    'vp-footer--bordered': props.bordered,
    'vp-footer--sticky': props.sticky && !props.fixed,
    'vp-footer--fixed': props.fixed
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  '--vp-footer-pad-x': padMap[props.padding] ?? padMap.page
}))
</script>

<template>
  <footer
    :class="rootClass"
    :style="rootStyle"
    data-component="Footer"
    role="contentinfo"
    @click="emit('click', $event)"
  >
    <div class="vp-footer__body">
      <slot></slot>
    </div>
  </footer>
</template>
