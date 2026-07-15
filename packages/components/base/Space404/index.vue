<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Space404Props, Space404Emits } from './types'
import './style.scss'

const props = defineProps<Space404Props>()
const emit = defineEmits<Space404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.space404.lead'))
</script>

<template>
  <div :class="['vp-space404', 'vp-space404__panel', props.class]" :style="style" data-variant="space404">
    <div class="vp-space404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <div class="vp-space404__stars" aria-hidden="true" /><p class="vp-space404__code" aria-hidden="true">404</p>
      <h1 class="vp-space404__title">{{ titleText }}</h1>
      <p class="vp-space404__muted">{{ leadText }}</p>
      <div class="vp-space404__toolbar">
        <slot>
          <button type="button" class="vp-space404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
