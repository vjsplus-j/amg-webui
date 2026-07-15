<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Business404Props, Business404Emits } from './types'
import './style.scss'

const props = defineProps<Business404Props>()
const emit = defineEmits<Business404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.business404.lead'))
</script>

<template>
  <div :class="['vp-business404', 'vp-business404__panel', props.class]" :style="style" data-variant="business404">
    <div class="vp-business404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <div class="vp-business404__bars" aria-hidden="true"><span class="vp-business404__bar" style="height:60%" /><span class="vp-business404__bar" style="height:90%" /><span class="vp-business404__bar" style="height:40%" /><span class="vp-business404__bar" style="height:75%" /></div>
      <h1 class="vp-business404__title">{{ titleText }}</h1>
      <p class="vp-business404__muted">{{ leadText }}</p>
      <div class="vp-business404__toolbar">
        <slot>
          <button type="button" class="vp-business404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
