<script setup lang="ts">
import { computed } from 'vue'
import type { ResultProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info'
})

const iconChar = computed(() => {
  switch (props.status) {
    case 'success':
      return 'v'
    case 'warning':
      return '!'
    case 'error':
      return '×'
    default:
      return 'i'
  }
})
</script>

<template>
  <div :class="['vp-result', props.class]" :style="style">
    <div :class="['vp-result__icon', `vp-result__icon--${status}`]" aria-hidden="true">
      <slot name="icon">{{ iconChar }}</slot>
    </div>
    <h3 v-if="title || $slots.title" class="vp-result__title">
      <slot name="title">{{ title }}</slot>
    </h3>
    <p v-if="subTitle || $slots.subTitle" class="vp-result__subtitle">
      <slot name="subTitle">{{ subTitle }}</slot>
    </p>
    <div v-if="$slots.extra" class="vp-result__extra">
      <slot name="extra" />
    </div>
    <div v-if="$slots.default">
      <slot />
    </div>
  </div>
</template>
