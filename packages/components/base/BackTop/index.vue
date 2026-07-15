<script setup lang="ts">
import { computed } from 'vue'
import type { BackTopProps, BackTopEmits } from './types'
import { useLocale } from '@amg-webui/hooks'
import { useBackTop } from './useBackTop'
import './style.scss'

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 200
})

const emit = defineEmits<BackTopEmits>()
const { t } = useLocale()
const { visible, scrollToTop } = useBackTop(props)

const backTopLabel = computed(() => t('common.backTop'))

const backTopStyle = computed(() => ({
  ...props.style,
  ...(props.right ? { '--vp-backtop-right': props.right } : {}),
  ...(props.bottom ? { '--vp-backtop-bottom': props.bottom } : {})
}))

const handleClick = (event: MouseEvent) => {
  scrollToTop()
  emit('click', event)
}
</script>

<template>
  <Transition name="vp-backtop-fade">
    <button
      v-if="visible"
      type="button"
      class="vp-backtop"
      :class="props.class"
      :style="backTopStyle"
      :aria-label="backTopLabel"
      @click="handleClick"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>
