<script setup lang="ts">
import { computed } from 'vue'
import type { EmptyProps } from './types'
import { useLocale } from '@amg-webui/hooks'
import './style.scss'

const props = defineProps<EmptyProps>()
const { t } = useLocale()

const defaultDescription = computed(() => t('common.noData'))
const resolvedDescription = computed(() => props.description ?? defaultDescription.value)
</script>

<template>
  <div :class="['vp-empty', props.class]" :style="style">
    <div class="vp-empty__image">
      <slot name="image">
        <img v-if="image" :src="image" alt="" class="vp-empty__img" />
        <svg
          v-else
          class="vp-empty__placeholder"
          viewBox="0 0 64 41"
          aria-hidden="true"
        >
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="var(--surface-2)" cx="32" cy="33" rx="32" ry="7" />
            <g fill="var(--surface-3)" stroke="var(--border-color)">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46V12.76z" />
              <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" />
            </g>
          </g>
        </svg>
      </slot>
    </div>
    <p v-if="$slots.description || resolvedDescription" class="vp-empty__description">
      <slot name="description">{{ resolvedDescription }}</slot>
    </p>
    <div v-if="$slots.default" class="vp-empty__footer">
      <slot />
    </div>
  </div>
</template>
