<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import ImageViewer from '../ImageViewer/index.vue'
import type { ImageProps, ImageEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  fit: 'cover',
  lazy: true,
  preview: true,
  previewSrcList: () => [],
  initialIndex: 0,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<ImageEmits>()
const { t } = useLocale()

const loading = ref(true)
const errored = ref(false)
const viewerVisible = ref(false)
const viewerIndex = ref(props.initialIndex)

const previewList = computed(() => {
  if (props.previewSrcList?.length) return props.previewSrcList
  const primary = props.previewSrc || props.src
  return primary ? [primary] : []
})

const canPreview = computed(
  () => props.preview && !props.disabled && !errored.value && previewList.value.length > 0
)

const hostStyle = computed(() => ({
  ...props.style,
  ...(props.width ? { width: props.width } : {}),
  ...(props.height ? { height: props.height } : {})
}))

const imgStyle = computed(() => ({
  objectFit: props.fit
}))

const altText = computed(() => props.alt || t(LocaleKeys.component.image.altFallback))

const fallbackText = computed(
  () => props.fallback || t(LocaleKeys.component.image.loadError)
)

watch(
  () => props.src,
  () => {
    loading.value = true
    errored.value = false
  }
)

function onLoad(event: Event) {
  loading.value = false
  errored.value = false
  emit('load', event)
}

function onError(event: Event) {
  loading.value = false
  errored.value = true
  emit('error', event)
}

function openViewer(event: MouseEvent) {
  emit('click', event)
  trackEmit({
    component: 'Image',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  if (!canPreview.value) return
  const idx = previewList.value.indexOf(props.previewSrc || props.src)
  viewerIndex.value = idx >= 0 ? idx : props.initialIndex
  viewerVisible.value = true
}

function onViewerSwitch(index: number) {
  viewerIndex.value = index
  emit('switch', index)
  trackEmit({
    component: 'Image',
    type: 'switch',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { index }
  })
}
</script>

<template>
  <div
    :class="[
      'vp-image',
      {
        'vp-image--error': errored,
        'vp-image--disabled': disabled,
        'vp-image--previewable': canPreview
      },
      props.class
    ]"
    :style="hostStyle"
    data-component="Image"
    @click="openViewer"
  >
    <div v-if="loading && !errored" class="vp-image__placeholder">
      <slot name="placeholder">{{ t(LocaleKeys.common.loading) }}</slot>
    </div>

    <img
      v-if="src && !errored"
      class="vp-image__img"
      :src="src"
      :alt="altText"
      :loading="lazy ? 'lazy' : 'eager'"
      :style="imgStyle"
      @load="onLoad"
      @error="onError"
    />

    <div v-else-if="errored" class="vp-image__fallback">
      <slot name="error">{{ fallbackText }}</slot>
    </div>

    <ImageViewer
      v-if="canPreview"
      v-model:visible="viewerVisible"
      :url-list="previewList"
      :initial-index="viewerIndex"
      @switch="onViewerSwitch"
    />
  </div>
</template>
