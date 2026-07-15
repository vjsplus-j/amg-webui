<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Machine404Props, Machine404Emits } from './types'
import './style.scss'

const props = defineProps<Machine404Props>()
const emit = defineEmits<Machine404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.machine404.lead'))
</script>

<template>
  <div :class="['vp-machine404', 'vp-machine404__panel', props.class]" :style="style" data-variant="machine404">
    <div class="vp-machine404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <p class="vp-machine404__gear" aria-hidden="true">⚙</p><p class="vp-machine404__code" aria-hidden="true">404</p>
      <h1 class="vp-machine404__title">{{ titleText }}</h1>
      <p class="vp-machine404__muted">{{ leadText }}</p>
      <div class="vp-machine404__toolbar">
        <slot>
          <button type="button" class="vp-machine404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
