<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CarouselProps, CarouselEmits } from './types'
import './style.scss'

interface Slide {
  id?: string | number
  title?: string
  image?: string
  content?: string
}

const props = withDefaults(defineProps<CarouselProps & { slides?: Slide[]; interval?: number; autoplay?: boolean }>(), {
  slides: () => [],
  interval: 4000,
  autoplay: true,
  disabled: false
})
const emit = defineEmits<CarouselEmits>()
const { t } = useLocale()

const index = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const items = computed<Slide[]>(() => {
  if (props.slides?.length) return props.slides
  if (Array.isArray(props.data)) return props.data as Slide[]
  return [{ title: t('component.carousel.title'), content: t('component.carousel.lead') }]
})

function go(i: number) {
  const len = items.value.length
  if (!len) return
  index.value = ((i % len) + len) % len
  emit('update:modelValue', index.value)
  emit('change', index.value)
}

function next() {
  go(index.value + 1)
}

function prev() {
  go(index.value - 1)
}

function startAutoplay() {
  stopAutoplay()
  if (!props.autoplay || props.disabled || paused.value) return
  timer = setInterval(next, props.interval)
}

function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch([() => props.autoplay, paused, items], startAutoplay, { immediate: true })
onUnmounted(stopAutoplay)

const titleText = computed(() => props.title ?? t('component.carousel.title'))
</script>

<template>
  <div
    :class="['vp-carousel', 'vp-carousel__panel', { 'vp-carousel--disabled': disabled }, props.class]"
    :style="style"
    @mouseenter="paused = true; stopAutoplay()"
    @mouseleave="paused = false; startAutoplay()"
  >
    <div class="vp-carousel__frame">
      <article v-for="(slide, i) in items" :key="slide.id ?? i" class="vp-carousel__slide" :class="{ 'vp-carousel__slide--active': i === index }">
        <img v-if="slide.image" class="vp-carousel__image" :src="slide.image" :alt="slide.title ?? titleText" />
        <div class="vp-carousel__caption">
          <h3 v-if="slide.title" class="vp-carousel__slide-title">{{ slide.title }}</h3>
          <p v-if="slide.content" class="vp-carousel__slide-text">{{ slide.content }}</p>
        </div>
      </article>
      <button type="button" class="vp-carousel__arrow vp-carousel__arrow--prev" :aria-label="t('common.previous')" :disabled="disabled" @click="prev">‹</button>
      <button type="button" class="vp-carousel__arrow vp-carousel__arrow--next" :aria-label="t('common.next')" :disabled="disabled" @click="next">›</button>
    </div>
    <div class="vp-carousel__dots">
      <button
        v-for="(slide, i) in items"
        :key="'dot-' + (slide.id ?? i)"
        type="button"
        class="vp-carousel__dot"
        :class="{ 'vp-carousel__dot--active': i === index }"
        :aria-label="`${i + 1}`"
        @click="go(i)"
      />
    </div>
    <button type="button" class="vp-carousel__toggle" :disabled="disabled" @click="paused = !paused; paused ? stopAutoplay() : startAutoplay()">
      {{ paused ? t('common.play') : t('common.pause') }}
    </button>
    <slot />
  </div>
</template>

<style scoped>
.vp-carousel__frame {
  position: relative;
  overflow: hidden;
  border-radius: var(--theme-card-radius);
  min-height: 10rem;
  background: var(--surface-2);
}
.vp-carousel__slide {
  display: none;
  padding: var(--theme-card-pad);
}
.vp-carousel__slide--active {
  display: block;
}
.vp-carousel__image {
  width: 100%;
  max-height: 12rem;
  object-fit: cover;
  border-radius: var(--theme-card-radius);
}
.vp-carousel__arrow {
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
.vp-carousel__arrow--prev {
  left: var(--spacing-md);
}
.vp-carousel__arrow--next {
  right: var(--spacing-md);
}
.vp-carousel__dots {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}
.vp-carousel__dot {
  width: var(--spacing-sm);
  height: var(--spacing-sm);
  border-radius: var(--border-radius-full, 50%);
  border: none;
  background: var(--ds-border);
  cursor: pointer;
  padding: 0;
}
.vp-carousel__dot--active {
  background: var(--primary-500);
}
.vp-carousel__toggle {
  margin-top: var(--spacing-sm);
  appearance: none;
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  border-radius: var(--theme-btn-radius);
  height: var(--height-sm);
  padding: 0 var(--spacing-md);
  cursor: pointer;
}
</style>
