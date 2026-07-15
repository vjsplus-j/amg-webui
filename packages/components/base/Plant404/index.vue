<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Plant404Props, Plant404Emits } from './types'
import './style.scss'

const props = defineProps<Plant404Props>()
const emit = defineEmits<Plant404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.plant404.lead'))
</script>

<template>
  <div :class="['vp-plant404', 'vp-plant404__panel', props.class]" :style="style" data-variant="plant404">
    <div class="vp-plant404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <div class="vp-plant404__leaf" aria-hidden="true" /><p class="vp-plant404__code" aria-hidden="true">404</p>
      <h1 class="vp-plant404__title">{{ titleText }}</h1>
      <p class="vp-plant404__muted">{{ leadText }}</p>
      <div class="vp-plant404__toolbar">
        <slot>
          <button type="button" class="vp-plant404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
