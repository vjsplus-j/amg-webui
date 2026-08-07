<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { BackTopProps, BackTopEmits } from './types'
import { useBackTop } from './useBackTop'
import './style.scss'

const props = withDefaults(defineProps<BackTopProps>(), {
  visibilityHeight: 200,
  teleport: true,
  icon: 'ChevronUp'
})

const emit = defineEmits<BackTopEmits>()
const { t } = useLocale()
const { visible, scrollToTop } = useBackTop(props)

const backTopLabel = computed(() => t(LocaleKeys.common.backTop))

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
  <Teleport to="body" :disabled="!teleport">
    <Transition name="vp-backtop-fade">
      <button
        v-if="visible"
        type="button"
        class="vp-backtop"
        :class="props.class"
        :style="backTopStyle"
        :aria-label="backTopLabel"
        data-component="BackTop"
        @click="handleClick"
      >
        <slot>
          <Icon :name="icon" size="md" aria-hidden="true" />
        </slot>
      </button>
    </Transition>
  </Teleport>
</template>
