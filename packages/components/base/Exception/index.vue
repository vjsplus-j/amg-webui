<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ExceptionProps, ExceptionEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ExceptionProps>(), {
  status: '404'
})
const emit = defineEmits<ExceptionEmits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.error.notFound))
const leadText = computed(() => props.description ?? t('component.exception.lead'))
</script>

<template>
  <div :class="['vp-exception', `vp-exception--${status}`, props.class]" :style="style" role="alert">
    <p class="vp-exception__code" aria-hidden="true">{{ status }}</p>
    <h1 class="vp-exception__title">{{ titleText }}</h1>
    <p class="vp-exception__lead">{{ leadText }}</p>
    <div class="vp-exception__actions">
      <slot>
        <button type="button" class="vp-exception__btn" @click="emit('action', $event)">
          {{ t(LocaleKeys.button.continue) }}
        </button>
      </slot>
    </div>
  </div>
</template>
