<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { PdfPreviewProps, PdfPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PdfPreviewProps>(), {
  src: null,
  height: '20rem',
  loading: false,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<PdfPreviewEmits>()
const { t } = useLocale()
const url = ref('')

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.pdf-preview.title'))
const isPdf = computed(
  () =>
    /\.pdf(\?|#|$)/i.test(url.value) ||
    /^data:application\/pdf/i.test(url.value)
)

function onLoad() {
  emit('load')
  trackEmit({ component: 'PdfPreview', type: 'load', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  if (props.disabled) return
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'PdfPreview', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-pdf-preview', 'vp-pdf-preview__panel', props.class]" :style="style" role="region" aria-labelledby="vp-pdf-preview-title" data-component="PdfPreview">
    <header class="vp-pdf-preview__header">
      <h3 id="vp-pdf-preview-title" class="vp-pdf-preview__title">{{ titleText }}</h3>
      <div class="vp-pdf-preview__toolbar">
        <button type="button" class="vp-pdf-preview__btn vp-pdf-preview__btn--ghost" :disabled="disabled || !url" @click="clearPreview">{{ t(LocaleKeys.button.reset) }}</button>
      </div>
    </header>
    <div v-if="loading" class="vp-pdf-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-pdf-preview__body">
      <iframe v-if="url && isPdf" :src="url" class="vp-pdf-preview__frame" :style="{ height }" :title="titleText" @load="onLoad" />
      <p v-else-if="url && !isPdf" class="vp-pdf-preview__empty">{{ t('component.pdf-preview.lead') }}</p>
      <p v-else class="vp-pdf-preview__empty">{{ t('component.pdf-preview.lead') }}</p>
      <slot />
    </div>
  </section>
</template>
