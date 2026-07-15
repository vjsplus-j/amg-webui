<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { NoticeBarProps, NoticeBarEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<NoticeBarProps>(), {
  severity: 'info',
  closable: true,
  scrollable: true
})
const emit = defineEmits<NoticeBarEmits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-notice-bar',
  `vp-notice-bar--${props.severity}`,
  { 'vp-notice-bar--scroll': props.scrollable },
  props.class
])

function close() {
  emit('close')
}
</script>

<template>
  <div :class="rootClass" :style="style" role="status">
    <div class="vp-notice-bar__track">
      <span class="vp-notice-bar__text">
        <slot>{{ message }}</slot>
      </span>
    </div>
    <button
      v-if="closable"
      type="button"
      class="vp-notice-bar__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >×</button>
  </div>
</template>
