<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ImageGroupProps, ImageGroupEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ImageGroupProps & { images?: string[] }>(), {
  images: () => [],
  disabled: false
})
const emit = defineEmits<ImageGroupEmits>()
const { t } = useLocale()
const index = ref(0)
const preview = ref(false)

const list = computed<string[]>(() => {
  if (props.images?.length) return props.images
  if (Array.isArray(props.data)) return props.data as string[]
  return []
})

function go(i: number) {
  const len = list.value.length
  if (!len) return
  index.value = ((i % len) + len) % len
  emit('change', index.value)
}

const titleText = computed(() => props.title ?? t('component.image-group.title'))
</script>

<template>
  <div :class="['vp-image-group', 'vp-image-group__panel', { 'vp-image-group--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-image-group__heading">{{ titleText }}</h3>
    <div v-if="list.length" class="vp-image-group__main">
      <img class="vp-image-group__hero" :src="list[index]" :alt="titleText" @click="preview = true" />
      <button type="button" class="vp-image-group__nav" :aria-label="t('common.previous')" @click="go(index - 1)">‹</button>
      <button type="button" class="vp-image-group__nav vp-image-group__nav--next" :aria-label="t('common.next')" @click="go(index + 1)">›</button>
    </div>
    <div v-if="list.length" class="vp-image-group__thumbs">
      <button
        v-for="(src, i) in list"
        :key="i"
        type="button"
        class="vp-image-group__thumb"
        :class="{ 'vp-image-group__thumb--active': i === index }"
        @click="go(i)"
      >
        <img :src="src" :alt="`${i + 1}`" loading="lazy" />
      </button>
    </div>
    <p v-else class="vp-image-group__muted">{{ t('common.noData') }}</p>
    <div v-if="preview" class="vp-image-group__overlay" @click="preview = false">
      <img class="vp-image-group__fullscreen" :src="list[index]" :alt="titleText" />
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-image-group__main {
  position: relative;
  margin-top: var(--spacing-md);
}
.vp-image-group__hero {
  width: 100%;
  max-height: 14rem;
  object-fit: cover;
  border-radius: var(--theme-card-radius);
  cursor: pointer;
}
.vp-image-group__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--border-radius-full, 50%);
  width: var(--height-md);
  height: var(--height-md);
  cursor: pointer;
}
.vp-image-group__nav--next {
  right: var(--spacing-md);
}
.vp-image-group__thumbs {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  overflow-x: auto;
}
.vp-image-group__thumb {
  flex: 0 0 auto;
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--theme-card-radius);
  overflow: hidden;
  cursor: pointer;
  background: none;
}
.vp-image-group__thumb--active {
  border-color: var(--primary-500);
}
.vp-image-group__thumb img {
  width: 4rem;
  height: 3rem;
  object-fit: cover;
  display: block;
}
.vp-image-group__overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--surface-0) 30%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.vp-image-group__fullscreen {
  max-width: 95vw;
  max-height: 95vh;
}
</style>
