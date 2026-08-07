<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PrintEmits, PrintProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<PrintProps>(), {
  disabled: false,
  showToolbar: true,
  copyStyles: true,
  autoClose: true,
  windowFeatures: 'noopener,noreferrer'
})

const emit = defineEmits<PrintEmits>()
const { t } = useLocale()
const regionRef = ref<HTMLElement | null>(null)
const printing = ref(false)
const isPrinting = computed(() => props.modelValue ?? printing.value)

function setPrinting(value: boolean) {
  printing.value = value
  emit('update:modelValue', value)
}

function collectStyles() {
  if (!props.copyStyles) return ''
  return Array.from(document.querySelectorAll('style,link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('')
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
    return map[char]
  })
}

function printRegion() {
  if (props.disabled || isPrinting.value || !regionRef.value) return
  setPrinting(true)
  try {
    emit('before-print')
    const region = regionRef.value.innerHTML
    const title = escapeHtml(props.title ?? t('common.print'))
    const bodyClass = props.printClass ? ` class="${escapeHtml(props.printClass)}"` : ''
    const styles = `${collectStyles()}${props.pageStyle ? `<style>${props.pageStyle}</style>` : ''}`
    const win = window.open('', '_blank', props.windowFeatures)
    if (!win) throw new Error('print window unavailable')
    win.document.write(
      `<!DOCTYPE html><html><head><title>${title}</title>${styles}</head><body${bodyClass}>${region}</body></html>`
    )
    win.document.close()
    win.focus()
    win.print()
    if (props.autoClose) win.close()
    emit('print')
    emit('after-print')
  } catch (error) {
    emit('error', error instanceof Error ? error : new Error(String(error)))
  } finally {
    setPrinting(false)
  }
}

defineExpose({ print: printRegion })
</script>

<template>
  <div :class="['vp-print', props.class]" :style="style" data-component="Print">
    <div v-if="showToolbar" class="vp-print__toolbar" role="toolbar" :aria-label="t('common.print')">
      <button
        type="button"
        class="vp-print__btn"
        :disabled="disabled || isPrinting"
        :aria-label="t('common.print')"
        :aria-busy="isPrinting || undefined"
        @click="printRegion"
      >
        {{ isPrinting ? (pendingLabel ?? t('common.loading')) : t('common.print') }}
      </button>
      <slot name="toolbar" :print="printRegion" :printing="isPrinting" />
    </div>
    <div ref="regionRef" class="vp-print__region" role="region" :aria-label="title ?? t('common.print')">
      <slot :print="printRegion" :printing="isPrinting" />
    </div>
  </div>
</template>
