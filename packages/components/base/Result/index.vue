<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import type { ResultProps, ResultStatus } from './types'
import './style.scss'

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info',
  telemetry: undefined
})

/** Inline emits — SFC compiler may fail to resolve imported call-signature Emits. */
const emit = defineEmits<{
  (e: 'extra-click', event: MouseEvent): void
}>()

const { t } = useLocale()

const ICON_MAP: Record<ResultStatus, string> = {
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  error: 'CircleX',
  info: 'Info'
}

const iconName = computed(() => ICON_MAP[props.status])
const titleText = computed(() => props.title ?? t(`component.result.${props.status}`))

function onExtraClick(e: MouseEvent) {
  emit('extra-click', e)
}
</script>

<template>
  <div
    :class="['vp-result', `vp-result--${status}`, props.class]"
    :style="style"
    role="status"
    :aria-labelledby="titleText ? 'vp-result-title' : undefined"
  >
    <div :class="['vp-result__icon', `vp-result__icon--${status}`]" aria-hidden="true">
      <slot name="icon">
        <Icon :name="iconName" size="lg" />
      </slot>
    </div>
    <h3 v-if="titleText || $slots.title" id="vp-result-title" class="vp-result__title">
      <slot name="title">{{ titleText }}</slot>
    </h3>
    <p v-if="subTitle || $slots.subTitle" class="vp-result__subtitle">
      <slot name="subTitle">{{ subTitle }}</slot>
    </p>
    <div v-if="$slots.extra" class="vp-result__extra" @click="onExtraClick">
      <slot name="extra" />
    </div>
    <div v-if="$slots.default" class="vp-result__body">
      <slot />
    </div>
  </div>
</template>
