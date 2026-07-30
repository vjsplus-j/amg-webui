<script setup lang="ts">
import { computed, ref, toRef, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { FilePreviewProps, FilePreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FilePreviewProps>(), {
  src: null, mime: '', height: '16rem', loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<FilePreviewEmits>()
const { t } = useLocale()
const url = ref('')

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.file-preview.title'))
const isImage = computed(() => /^image\//.test(props.mime) || /\.(png|jpe?g|gif|webp|svg)$/i.test(url.value))
const isPdf = computed(() => props.mime === 'application/pdf' || /\.pdf$/i.test(url.value))

function onLoad() {
  emit('load')
  trackEmit({ component: 'FilePreview', type: 'load', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  if (props.disabled) return
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'FilePreview', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-file-preview', 'vp-file-preview__panel', props.class]" :style="style" role="region" aria-labelledby="vp-file-preview-title" data-component="FilePreview">
    <header class="vp-file-preview__header">
      <h3 id="vp-file-preview-title" class="vp-file-preview__title">{{ titleText }}</h3>
      <button type="button" class="vp-file-preview__btn vp-file-preview__btn--ghost" :disabled="disabled || !url" @click="clearPreview">{{ t(LocaleKeys.button.reset) }}</button>
    </header>
    <div v-if="loading" class="vp-file-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-file-preview__body">
      <template v-if="url">
        <img v-if="isImage" :src="url" class="vp-file-preview__img" :style="{ maxHeight: height }" alt="" @load="onLoad" @error="emit('error', new Error('load'))" />
        <iframe v-else-if="isPdf" :src="url" class="vp-file-preview__frame" :style="{ height }" :title="titleText" @load="onLoad" />
        <iframe v-else :src="url" class="vp-file-preview__frame" :style="{ height }" :title="titleText" @load="onLoad" />
      </template>
      <p v-else class="vp-file-preview__empty">{{ t('component.file-preview.lead') }}</p>
      <slot />
    </div>
  </section>
</template>
