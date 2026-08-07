<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { EmptyProps, EmptyImageSize } from './types'
import type { Size } from '@amg-webui/types'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(defineProps<EmptyProps>(), {
  telemetry: undefined,
  imageSize: 'md'
})

/** Inline — imported `EmptyEmits` is not expanded into runtime emits. */
const emit = defineEmits<{
  imageError: [event: Event]
}>()
const { t } = useLocale()

const imageFailed = ref(false)

watch(
  () => props.image,
  () => {
    imageFailed.value = false
  }
)

const defaultDescription = computed(() => t('common.noData'))
const resolvedDescription = computed(() => props.description ?? defaultDescription.value)

const SIZE_TOKEN: Record<Size, string> = {
  xs: 'var(--height-sm)',
  sm: 'var(--height-md)',
  md: 'var(--height-xl)',
  lg: 'calc(var(--height-xl) * 1.5)',
  xl: 'calc(var(--height-xl) * 2)'
}

const SPACE_STEPS = [
  'var(--spacing-xs)',
  'var(--spacing-sm)',
  'var(--spacing-md)',
  'var(--spacing-lg)',
  'var(--spacing-xl)'
] as const

function resolveImageSize(raw: EmptyImageSize | undefined): string {
  if (raw == null || raw === '') return SIZE_TOKEN.md
  if (typeof raw === 'number') {
    const idx = Math.min(Math.max(Math.floor(raw), 0), SPACE_STEPS.length - 1)
    return `calc(${SPACE_STEPS[idx]} * 8)`
  }
  const s = String(raw)
  if (s in SIZE_TOKEN) return SIZE_TOKEN[s as Size]
  return s
}

const sizeTokenKey = computed(() => {
  const raw = props.imageSize
  if (typeof raw === 'string' && raw in SIZE_TOKEN) return raw as Size
  return null
})

const rootClass = computed(() => [
  'vp-empty',
  sizeTokenKey.value ? `vp-empty--${sizeTokenKey.value}` : '',
  props.class
])

const rootStyle = computed(() => ({
  ...(props.style ?? {}),
  '--vp-empty-image-size': resolveImageSize(props.imageSize)
}))

const imageHostStyle = computed(() => ({
  ...(props.imageStyle ?? {})
}))

const showCustomImage = computed(() => Boolean(props.image) && !imageFailed.value)

const resolvedImageAlt = computed(
  () => props.imageAlt ?? props.title ?? resolvedDescription.value
)

function onImageError(event: Event) {
  imageFailed.value = true
  trackEmit({
    component: 'Empty',
    type: 'imageError',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { src: props.image }
  })
  emit('imageError', event)
}
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    role="status"
    aria-live="polite"
  >
    <div class="vp-empty__image" :style="imageHostStyle">
      <slot name="image">
        <img
          v-if="showCustomImage"
          :src="image"
          :alt="resolvedImageAlt"
          class="vp-empty__img"
          @error="onImageError"
        />
        <svg
          v-else
          class="vp-empty__placeholder"
          viewBox="0 0 64 41"
          aria-hidden="true"
          focusable="false"
        >
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="var(--surface-2)" cx="32" cy="33" rx="32" ry="7" />
            <g fill="var(--surface-3)" stroke="var(--border-color)">
              <path
                d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46V12.76z"
              />
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
              />
            </g>
          </g>
        </svg>
      </slot>
    </div>

    <div v-if="$slots.title || title" class="vp-empty__title">
      <slot name="title">{{ title }}</slot>
    </div>

    <p
      v-if="$slots.description || resolvedDescription"
      class="vp-empty__description"
    >
      <slot name="description">{{ resolvedDescription }}</slot>
    </p>

    <div v-if="$slots.default" class="vp-empty__footer">
      <slot />
    </div>
  </div>
</template>
