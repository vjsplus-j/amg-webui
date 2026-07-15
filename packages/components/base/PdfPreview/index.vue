<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PdfPreviewProps, PdfPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PdfPreviewProps>(), {
  src: null,
  height: '20rem'
})

const emit = defineEmits<PdfPreviewEmits>()
const { t } = useLocale()
const url = ref('')

watch(
  toRef(props, 'src'),
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
</script>

<template>
  <div :class="['vp-pdf-preview', props.class]" :style="style" data-component="PdfPreview">
    <object v-if="url" :data="url" type="application/pdf" class="vp-pdf-preview__obj" :style="{ height }" @load="emit('load')">
      <iframe :src="url" class="vp-pdf-preview__frame" :style="{ height }" :title="t('component.pdf-preview.title')" />
    </object>
    <p v-else class="vp-pdf-preview__muted">{{ t('component.pdf-preview.lead') }}</p>
    <slot />
  </div>
</template>
