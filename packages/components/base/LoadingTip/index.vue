<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { LoadingTipProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<LoadingTipProps>(), {
  loading: true
})
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-loading-tip',
  { 'vp-loading-tip--loading': props.loading },
  props.class
])
const label = computed(() => props.message ?? t(LocaleKeys.common.loading))
</script>

<template>
  <div :class="rootClass" :style="style" role="status" :aria-busy="loading">
    <span class="vp-loading-tip__spinner" aria-hidden="true" />
    <span class="vp-loading-tip__text">{{ label }}</span>
    <slot />
  </div>
</template>
