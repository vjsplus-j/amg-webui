<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PrintProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<PrintProps>(), {
  disabled: false,
  showToolbar: true
})

const emit = defineEmits<{
  (e: 'print'): void
  (e: 'before-print'): void
  (e: 'after-print'): void
}>()
const { t } = useLocale()
const regionRef = ref<HTMLElement | null>(null)

function printRegion() {
  if (props.disabled || !regionRef.value) return
  emit('before-print')
  const region = regionRef.value.innerHTML
  const bodyClass = props.printClass ? ` class="${props.printClass}"` : ''
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  win.document.write(
    `<!DOCTYPE html><html><head><title>${props.title ?? t('common.print')}</title></head><body${bodyClass}>${region}</body></html>`
  )
  win.document.close()
  win.focus()
  win.print()
  win.close()
  emit('print')
  emit('after-print')
}

defineExpose({ print: printRegion })
</script>

<template>
  <div :class="['vp-print', props.class]" :style="style" data-component="Print">
    <div v-if="showToolbar" class="vp-print__toolbar" role="toolbar" :aria-label="t('common.print')">
      <button
        type="button"
        class="vp-print__btn"
        :disabled="disabled"
        :aria-label="t('common.print')"
        @click="printRegion"
      >
        {{ t('common.print') }}
      </button>
      <slot name="toolbar" />
    </div>
    <div ref="regionRef" class="vp-print__region" :aria-label="title ?? t('common.print')">
      <slot />
    </div>
  </div>
</template>
