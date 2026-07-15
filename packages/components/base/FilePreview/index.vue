<script setup lang="ts">
import { computed, ref, toRef, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { FilePreviewProps, FilePreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FilePreviewProps>(), {
  src: null,
  mime: '',
  height: '16rem'
})

const emit = defineEmits<FilePreviewEmits>()
const { t } = useLocale()
const url = ref('')

const srcRef = toRef(props, 'src')

watch(
  srcRef,
  (val) => {
    if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
    url.value = ''
    if (!val) return
    if (typeof val === 'string') url.value = val
    else url.value = URL.createObjectURL(val)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
})

const isImage = computed(() => {
  const m = props.mime || (typeof props.src === 'object' && props.src && 'type' in props.src ? (props.src as File).type : '')
  return /^image\//.test(m) || /\.(png|jpe?g|gif|webp|svg)$/i.test(url.value)
})

const isPdf = computed(() => {
  const m = props.mime || (typeof props.src === 'object' && props.src && 'type' in props.src ? (props.src as File).type : '')
  return m === 'application/pdf' || /\.pdf$/i.test(url.value)
})
</script>

<template>
  <div :class="['vp-file-preview', props.class]" :style="style" data-component="FilePreview">
    <template v-if="url">
      <img v-if="isImage" :src="url" class="vp-file-preview__img" :style="{ maxHeight: height }" alt="" @load="emit('load')" @error="emit('error', new Error('load'))" />
      <iframe v-else-if="isPdf" :src="url" class="vp-file-preview__frame" :style="{ height }" :title="t('component.file-preview.title')" @load="emit('load')" />
      <iframe v-else :src="url" class="vp-file-preview__frame" :style="{ height }" :title="t('component.file-preview.title')" @load="emit('load')" />
    </template>
    <p v-else class="vp-file-preview__muted">{{ t('component.file-preview.lead') }}</p>
    <slot />
  </div>
</template>
