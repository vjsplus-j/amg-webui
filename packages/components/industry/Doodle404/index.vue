<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { Doodle404Props, Doodle404Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<Doodle404Props>(), {
  code: 404,
  actions: () => [],
  retryable: false,
  disabled: false,
  loading: false
})
const emit = defineEmits<Doodle404Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('component.doodle404.lead'))
const actionList = computed(() =>
  props.actions.length ? props.actions : [{ key: 'continue', label: t('button.continue') }]
)

function runAction(action: { key: string; label: string; href?: string; disabled?: boolean }, event: MouseEvent) {
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
    :class="['vp-doodle404', 'vp-doodle404__panel', { 'vp-doodle404--disabled': disabled, 'vp-doodle404--loading': loading }, props.class]"
    :style="style"
    data-component="Doodle404"
    data-variant="doodle404"
    role="status"
    :aria-busy="loading || undefined"
  >
    <div class="vp-doodle404__body">
      <p class="vp-doodle404__code" aria-hidden="true">{{ code }}</p>
      <h1 class="vp-doodle404__title">{{ titleText }}</h1>
      <p class="vp-doodle404__muted">{{ leadText }}</p>
      <div class="vp-doodle404__toolbar">
        <slot :actions="actionList" :retry="retry">
          <button
            v-for="action in actionList"
            :key="action.key"
            type="button"
            class="vp-doodle404__action"
            :class="{ 'vp-doodle404__action--active': modelValue === action.key }"
            :disabled="disabled || loading || action.disabled"
            @click="runAction(action, $event)"
          >
            {{ action.label }}
          </button>
          <a
            v-if="homeHref"
            class="vp-doodle404__action vp-doodle404__action--ghost"
            :href="homeHref"
            @click="goHome"
          >
            {{ t('button.continue') }}
          </a>
          <button
            v-if="retryable"
            type="button"
            class="vp-doodle404__action vp-doodle404__action--ghost"
            :disabled="disabled || loading"
            @click="retry"
          >
            {{ t('button.refresh') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
