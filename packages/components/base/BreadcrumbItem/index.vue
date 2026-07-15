<script setup lang="ts">
import { inject } from 'vue'
import type { BreadcrumbItemProps } from './types'
import { BREADCRUMB_INJECTION_KEY } from '../Breadcrumb/types'
import './style.scss'

const props = defineProps<BreadcrumbItemProps>()

const ctx = inject(BREADCRUMB_INJECTION_KEY, { separator: '/' })
</script>

<template>
  <li :class="['vp-breadcrumb-item', props.class]" :style="style">
    <a v-if="href || to" :href="href ?? to" class="vp-breadcrumb-item__link">
      <slot />
    </a>
    <span v-else class="vp-breadcrumb-item__text">
      <slot />
    </span>
    <span class="vp-breadcrumb-item__separator" aria-hidden="true">{{ ctx.separator }}</span>
  </li>
</template>
