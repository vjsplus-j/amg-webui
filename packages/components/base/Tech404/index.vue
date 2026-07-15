<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Tech404Props, Tech404Emits } from './types'
import './style.scss'

const props = defineProps<Tech404Props>()
const emit = defineEmits<Tech404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.tech404.lead'))
</script>

<template>
  <div :class="['vp-tech404', 'vp-tech404__panel', props.class]" :style="style" data-variant="tech404">
    <div class="vp-tech404__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <p class="vp-tech404__code" aria-hidden="true">404</p>
      <h1 class="vp-tech404__title">{{ titleText }}</h1>
      <p class="vp-tech404__muted">{{ leadText }}</p>
      <div class="vp-tech404__toolbar">
        <slot>
          <button type="button" class="vp-tech404__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
