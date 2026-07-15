<script setup lang="ts">
import { provide } from 'vue'
import type { BreadcrumbProps } from './types'
import { BREADCRUMB_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/'
})

provide(BREADCRUMB_INJECTION_KEY, {
  separator: props.separator
})
</script>

<template>
  <nav :class="['vp-breadcrumb', props.class]" :style="style" aria-label="breadcrumb">
    <ol class="vp-breadcrumb">
      <slot />
    </ol>
  </nav>
</template>
