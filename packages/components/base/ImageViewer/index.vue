<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { isClient, getDocument } from '@amg-webui/utils/env'
import Icon from '../Icon/index.vue'
import type { ImageViewerProps, ImageViewerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ImageViewerProps>(), {
  visible: false,
  initialIndex: 0,
  infinite: true,
  zoomRate: 1.2,
  minScale: 0.25,
  maxScale: 3,
  teleported: true
})

const emit = defineEmits<ImageViewerEmits>()
const { t } = useLocale()

const currentIndex = ref(props.initialIndex)
const scale = ref(1)
const rotation = ref(0)
let previousOverflow = ''

const currentUrl = computed(() => props.urlList[currentIndex.value] ?? '')
const hasMultiple = computed(() => props.urlList.length > 1)
const canPrev = computed(
  () => props.infinite || currentIndex.value > 0
)
const canNext = computed(
  () => props.infinite || currentIndex.value < props.urlList.length - 1
)

const imgTransform = computed(
  () => `scale(${scale.value}) rotate(${rotation.value}deg)`
)

const counterLabel = computed(() =>
  t(LocaleKeys.component.imageViewer.counter, {
    current: currentIndex.value + 1,
    total: props.urlList.length
  })
)

function close(event?: Event) {
  emit('update:visible', false)
  emit('close', event)
}

function onMaskClick(event: MouseEvent) {
  if (event.target === event.currentTarget) close(event)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.visible) return
  if (event.key === 'Escape') {
    event.preventDefault()
    close(event)
  } else if (event.key === 'ArrowLeft') {
    prev()
  } else if (event.key === 'ArrowRight') {
    next()
  }
}

function goTo(index: number) {
  if (!props.urlList.length) return
  let next = index
  if (props.infinite) {
    const len = props.urlList.length
    next = ((index % len) + len) % len
  } else {
    next = Math.max(0, Math.min(props.urlList.length - 1, index))
  }
  if (next === currentIndex.value) return
  currentIndex.value = next
  resetTransform()
  emit('switch', next)
}

function prev() {
  if (!canPrev.value && currentIndex.value <= 0) return
  goTo(currentIndex.value - 1)
}

function next() {
  if (!canNext.value && currentIndex.value >= props.urlList.length - 1) return
  goTo(currentIndex.value + 1)
}

function zoomIn() {
  scale.value = Math.min(props.maxScale, scale.value * props.zoomRate)
}

function zoomOut() {
  scale.value = Math.max(props.minScale, scale.value / props.zoomRate)
}

function rotate() {
  rotation.value = (rotation.value + 90) % 360
}

function resetTransform() {
  scale.value = 1
  rotation.value = 0
}

function lockBody(lock: boolean) {
  const doc = getDocument()
  if (!doc) return
  if (lock) {
    previousOverflow = doc.body.style.overflow
    doc.body.style.overflow = 'hidden'
  } else {
    doc.body.style.overflow = previousOverflow
  }
}

watch(
  () => props.visible,
  (visible) => {
    lockBody(Boolean(visible))
    if (visible) {
      currentIndex.value = Math.max(
        0,
        Math.min(props.urlList.length - 1, props.initialIndex)
      )
      resetTransform()
    }
  }
)

watch(
  () => props.initialIndex,
  (index) => {
    if (props.visible) {
      currentIndex.value = Math.max(0, Math.min(props.urlList.length - 1, index))
      resetTransform()
    }
  }
)

onMounted(() => {
  if (!isClient) return
  getDocument()?.addEventListener('keydown', onKeydown)
  if (props.visible) lockBody(true)
})

onUnmounted(() => {
  if (!isClient) return
  getDocument()?.removeEventListener('keydown', onKeydown)
  lockBody(false)
})
</script>

<template>
  <Teleport to="body" :disabled="!teleported">
    <Transition name="vp-image-viewer-fade">
      <div
        v-if="visible"
        :class="['vp-image-viewer', props.class]"
        :style="props.style"
        role="dialog"
        aria-modal="true"
        :aria-label="t(LocaleKeys.component.imageViewer.aria)"
        data-component="ImageViewer"
      >
        <div class="vp-image-viewer__mask" @click="onMaskClick" />

        <button
          type="button"
          class="vp-image-viewer__btn vp-image-viewer__close"
          :aria-label="t(LocaleKeys.common.close)"
          @click="close($event)"
        >
          <Icon name="X" size="md" aria-hidden="true" />
        </button>

        <div class="vp-image-viewer__toolbar">
          <button
            type="button"
            class="vp-image-viewer__btn"
            :aria-label="t(LocaleKeys.component.imageViewer.zoomOut)"
            @click.stop="zoomOut"
          >
            <Icon name="ZoomOut" size="sm" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="vp-image-viewer__btn"
            :aria-label="t(LocaleKeys.component.imageViewer.zoomIn)"
            @click.stop="zoomIn"
          >
            <Icon name="ZoomIn" size="sm" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="vp-image-viewer__btn"
            :aria-label="t(LocaleKeys.component.imageViewer.rotate)"
            @click.stop="rotate"
          >
            <Icon name="RotateCw" size="sm" aria-hidden="true" />
          </button>
          <span v-if="hasMultiple" class="vp-image-viewer__counter">{{ counterLabel }}</span>
        </div>

        <div class="vp-image-viewer__stage" @click.stop>
          <button
            v-if="hasMultiple"
            type="button"
            class="vp-image-viewer__btn vp-image-viewer__nav vp-image-viewer__nav--prev"
            :disabled="!canPrev"
            :aria-label="t(LocaleKeys.common.previous)"
            @click="prev"
          >
            <Icon name="ChevronLeft" size="md" aria-hidden="true" />
          </button>

          <img
            v-if="currentUrl"
            class="vp-image-viewer__img"
            :src="currentUrl"
            :alt="t(LocaleKeys.component.imageViewer.imageAlt, { index: currentIndex + 1 })"
            :style="{ transform: imgTransform }"
            draggable="false"
          />

          <button
            v-if="hasMultiple"
            type="button"
            class="vp-image-viewer__btn vp-image-viewer__nav vp-image-viewer__nav--next"
            :disabled="!canNext"
            :aria-label="t(LocaleKeys.common.next)"
            @click="next"
          >
            <Icon name="ChevronRight" size="md" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
