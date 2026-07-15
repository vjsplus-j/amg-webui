<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Pixel404Props, Pixel404Emits } from './types'
import './style.scss'

const props = defineProps<Pixel404Props>()
const emit = defineEmits<Pixel404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.pixel404.lead'))
</script>

<template>
  <div :class="['vp-pixel404', 'vp-pixel404__panel', props.class]" :style="style" data-variant="pixel404">
    <div class="vp-pixel404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <div class="vp-pixel404__grid" aria-hidden="true"><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel vp-pixel404__pixel--off" /><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel" /><span class="vp-pixel404__pixel vp-pixel404__pixel--off" /><span class="vp-pixel404__pixel" /></div>
      <h1 class="vp-pixel404__title">{{ titleText }}</h1>
      <p class="vp-pixel404__muted">{{ leadText }}</p>
      <div class="vp-pixel404__toolbar">
        <slot>
          <button type="button" class="vp-pixel404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
