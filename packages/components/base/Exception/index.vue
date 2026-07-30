<script setup lang="ts">
import { computed } from 'vue'
import Button from '../Button/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(
  defineProps<{
    status?: '403' | '404' | '500' | 'offline'
    title?: string
    description?: string
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    status: '404',
    telemetry: undefined
  }
)

const emit = defineEmits<{
  action: [event: MouseEvent]
}>()
const { t } = useLocale()

const titleText = computed(
  () => props.title ?? t(`component.exception.${props.status}.title`)
)
const leadText = computed(
  () => props.description ?? t(`component.exception.${props.status}.lead`)
)

function onAction(event: MouseEvent) {
  trackEmit({
    component: 'Exception',
    type: 'action',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { status: props.status }
  })
  emit('action', event)
}
</script>

<template>
  <div
    :class="['vp-exception', `vp-exception--${status}`, props.class]"
    :style="style"
    role="alert"
  >
    <p class="vp-exception__code" aria-hidden="true">{{ status }}</p>
    <h1 class="vp-exception__title">{{ titleText }}</h1>
    <p class="vp-exception__lead">{{ leadText }}</p>
    <div class="vp-exception__actions">
      <slot>
        <Button variant="solid" severity="primary" size="md" @click="onAction">
          {{ t(LocaleKeys.button.continue) }}
        </Button>
      </slot>
    </div>
  </div>
</template>
