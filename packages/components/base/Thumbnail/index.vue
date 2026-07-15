<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ThumbnailProps, ThumbnailEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ThumbnailProps & { src?: string; alt?: string }>(), {
  src: '',
  alt: '',
  disabled: false
})
const emit = defineEmits<ThumbnailEmits>()
const { t } = useLocale()
const preview = ref(false)
const errored = ref(false)

const imageSrc = computed(() => {
  if (props.src) return props.src
  if (typeof props.data === 'string') return props.data
  return ''
})

function openPreview() {
  if (props.disabled || errored.value || !imageSrc.value) return
  preview.value = true
  emit('click', new MouseEvent('click'))
}

function closePreview() {
  preview.value = false
}

const titleText = computed(() => props.title ?? t('component.thumbnail.title'))
</script>

<template>
  <div :class="['vp-thumbnail', 'vp-thumbnail__panel', { 'vp-thumbnail--disabled': disabled }, props.class]" :style="style">
    <h3 v-if="title" class="vp-thumbnail__heading">{{ titleText }}</h3>
    <figure class="vp-thumbnail__figure" @click="openPreview">
      <img
        v-if="imageSrc && !errored"
        class="vp-thumbnail__image"
        :src="imageSrc"
        :alt="alt || titleText"
        loading="lazy"
        @error="errored = true"
      />
      <div v-else class="vp-thumbnail__fallback">{{ t('common.noData') }}</div>
    </figure>
    <div v-if="preview" class="vp-thumbnail__overlay" @click="closePreview">
      <img class="vp-thumbnail__preview" :src="imageSrc" :alt="alt || titleText" />
      <button type="button" class="vp-thumbnail__close" :aria-label="t('common.close')" @click.stop="closePreview">×</button>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-thumbnail__figure {
  margin: var(--spacing-md) 0 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--theme-card-radius);
  border: 1px solid var(--ds-border);
}
.vp-thumbnail__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-normal, 0.2s);
}
.vp-thumbnail__figure:hover .vp-thumbnail__image {
  transform: scale(1.04);
}
.vp-thumbnail__fallback {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
  background: var(--surface-2);
}
.vp-thumbnail__overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--surface-0) 20%, transparent);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.vp-thumbnail__preview {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-lg);
}
.vp-thumbnail__close {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  appearance: none;
  border: none;
  background: var(--surface-1);
  border-radius: var(--border-radius-full, 50%);
  width: var(--height-md);
  height: var(--height-md);
  cursor: pointer;
  font-size: var(--font-size-lg);
}
</style>
