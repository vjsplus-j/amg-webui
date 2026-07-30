<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderPadding } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    sticky?: boolean
    fixed?: boolean
    bordered?: boolean
    size?: 'sm' | 'md' | 'lg'
    padding?: HeaderPadding
    translucent?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    sticky: false,
    fixed: false,
    bordered: true,
    size: 'md',
    padding: 'page',
    translucent: true
  }
)

const padMap: Record<HeaderPadding, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  page: 'var(--vp-layout-chrome-pad-x, var(--theme-page-pad))'
}

const rootClass = computed(() => [
  'vp-header',
  `vp-header--${props.size}`,
  `vp-header--pad-${props.padding}`,
  {
    'vp-header--sticky': props.sticky && !props.fixed,
    'vp-header--fixed': props.fixed,
    'vp-header--bordered': props.bordered,
    'vp-header--translucent': props.translucent,
    'vp-header--solid': !props.translucent
  },
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  '--vp-header-pad-x': padMap[props.padding] ?? padMap.page
}))
</script>

<template>
  <header :class="rootClass" :style="rootStyle" data-component="Header" role="banner">
    <div v-if="$slots.title || $slots.default" class="vp-header__title">
      <slot name="title">
        <slot />
      </slot>
    </div>
    <div v-if="$slots.extra" class="vp-header__extra">
      <slot name="extra" />
    </div>
    <div v-if="$slots.actions" class="vp-header__actions">
      <slot name="actions" />
    </div>
  </header>
</template>
