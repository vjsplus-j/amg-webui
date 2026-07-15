<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Ink404Props, Ink404Emits } from './types'
import './style.scss'

const props = defineProps<Ink404Props>()
const emit = defineEmits<Ink404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.ink404.lead'))
</script>

<template>
  <div :class="['vp-ink404', 'vp-ink404__panel', props.class]" :style="style" data-variant="ink404">
    <div class="vp-ink404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <p class="vp-ink404__code" aria-hidden="true">404</p>
      <h1 class="vp-ink404__title">{{ titleText }}</h1>
      <p class="vp-ink404__muted">{{ leadText }}</p>
      <div class="vp-ink404__toolbar">
        <slot>
          <button type="button" class="vp-ink404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
