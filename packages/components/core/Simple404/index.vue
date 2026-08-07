<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Simple404Action, Simple404Props, Simple404Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<Simple404Props>(), {
  code: 404,
  actions: () => [],
  retryable: false,
  disabled: false,
  loading: false
})
const emit = defineEmits<Simple404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.simple404.lead'))
const rootClass = computed(() => [
  'vp-simple404',
  'vp-simple404__panel',
  {
    'vp-simple404--disabled': props.disabled,
    'vp-simple404--loading': props.loading
  },
  props.class
])
const resolvedActions = computed<Simple404Action[]>(() => {
  if (props.actions.length) return props.actions
  return [{ key: 'continue', label: t('button.continue') }]
})

function runAction(action: Simple404Action, event: MouseEvent) {
  if (props.disabled || props.loading || action.disabled) return
  emit('update:modelValue', action.key)
  emit('change', action.key)
  emit('action', action, event)
  emit('click', event)
}

function goHome(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('home', event)
}

function retry(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('retry', event)
}
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    data-component="Simple404"
    data-variant="simple404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-simple404__body">
      <p class="vp-simple404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-simple404__title">{{ titleText }}</h1>
      <p class="vp-simple404__muted">{{ leadText }}</p>
      <div class="vp-simple404__toolbar">
        <slot :actions="resolvedActions" :retry="retry">
          <button
            v-for="action in resolvedActions"
            :key="action.key"
            type="button"
            class="vp-simple404__action"
            :class="{ 'vp-simple404__action--active': modelValue === action.key }"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a v-if="homeHref" class="vp-simple404__action vp-simple404__action--ghost" :href="homeHref" @click="goHome">
            {{ t('button.continue') }}
          </a>
          <button v-if="retryable" type="button" class="vp-simple404__action vp-simple404__action--ghost" :disabled="disabled || loading" @click="retry">
            {{ t('button.refresh') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
