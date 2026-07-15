<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PrintProps, PrintEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PrintProps>(), {
  disabled: false
})

const emit = defineEmits<PrintEmits>()
const { t } = useLocale()
const regionRef = ref<HTMLElement | null>(null)

function printRegion() {
  if (props.disabled || !regionRef.value) return
  const region = regionRef.value.innerHTML
  const win = window.open('', '_blank', 'noopener,noreferrer')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><title>${props.title ?? t('common.print')}</title></head><body>${region}</body></html>`)
  win.document.close()
  win.focus()
  win.print()
  win.close()
  emit('print')
}

defineExpose({ print: printRegion })
</script>

<template>
  <div :class="['vp-print', props.class]" :style="style" data-component="Print">
    <div class="vp-print__toolbar">
      <button type="button" class="vp-print__btn" :disabled="disabled" @click="printRegion">
        {{ t('common.print') }}
      </button>
      <slot name="toolbar" />
    </div>
    <div ref="regionRef" class="vp-print__region">
      <slot />
    </div>
  </div>
</template>
