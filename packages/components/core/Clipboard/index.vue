<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ClipboardProps, ClipboardEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<ClipboardProps>(), {
  text: '',
  modelValue: '',
  loading: false,
  disabled: false
})

const emit = defineEmits<ClipboardEmits>()
const { t } = useLocale()
const busy = ref(false)
const tip = ref('')

const content = computed(() => props.modelValue || props.text || '')

async function copy() {
  if (props.disabled || props.loading || busy.value || !content.value) return
  busy.value = true
  tip.value = ''
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(content.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = content.value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    tip.value = t(LocaleKeys.tip.copied)
    emit('copied', content.value)
  } catch (err) {
    emit('error', err instanceof Error ? err : new Error(String(err)))
  } finally {
    busy.value = false
  }
}

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div
    :class="['vp-clipboard', { 'vp-clipboard--disabled': disabled }, props.class]"
    :style="style"
    data-component="Clipboard"
  >
    <div class="vp-clipboard__row">
      <input
        class="vp-clipboard__input"
        type="text"
        :value="content"
        :disabled="disabled || loading"
        :placeholder="t('common.value')"
        :aria-label="t('component.clipboard.title')"
        @input="onInput"
      />
      <button
        type="button"
        class="vp-clipboard__btn"
        :disabled="disabled || loading || !content"
        @click="copy"
      >
        {{ busy ? t('common.loading') : t('common.copy') }}
      </button>
    </div>
    <p v-if="tip" class="vp-clipboard__tip" role="status">{{ tip }}</p>
    <slot />
  </div>
</template>
