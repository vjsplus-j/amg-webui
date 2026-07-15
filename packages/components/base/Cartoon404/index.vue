<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Cartoon404Props, Cartoon404Emits } from './types'
import './style.scss'

const props = defineProps<Cartoon404Props>()
const emit = defineEmits<Cartoon404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.cartoon404.lead'))
</script>

<template>
  <div :class="['vp-cartoon404', 'vp-cartoon404__panel', props.class]" :style="style" data-variant="cartoon404">
    <div class="vp-cartoon404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <div class="vp-cartoon404__art" aria-hidden="true"><span class="vp-cartoon404__blob vp-cartoon404__blob--a" /><span class="vp-cartoon404__blob vp-cartoon404__blob--b" /><span class="vp-cartoon404__code">404</span></div>
      <h1 class="vp-cartoon404__title">{{ titleText }}</h1>
      <p class="vp-cartoon404__muted">{{ leadText }}</p>
      <div class="vp-cartoon404__toolbar">
        <slot>
          <button type="button" class="vp-cartoon404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
