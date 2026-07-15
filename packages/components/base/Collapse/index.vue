<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Icon from '../Icon/index.vue'
import type { CollapsePanel } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    panels?: CollapsePanel[]
    accordion?: boolean
    disabled?: boolean
    title?: string
    bordered?: boolean
    ghost?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    panels: () => [],
    accordion: true,
    disabled: false,
    bordered: true,
    ghost: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
  change: [value: string | string[]]
  expand: [payload: { key: string; activeKeys: string | string[] }]
  collapse: [payload: { key: string; activeKeys: string | string[] }]
}>()

function toSet(v: string | string[] | undefined): Set<string> {
  if (v == null) return new Set()
  return new Set(Array.isArray(v) ? v : [v])
}

const openKeys = ref<Set<string>>(toSet(props.modelValue))

watch(
  () => props.modelValue,
  (v) => {
    openKeys.value = toSet(v)
  }
)

const items = computed<CollapsePanel[]>(() => {
  if (props.panels?.length) return props.panels
  return []
})

function toEmitValue(next: Set<string>): string | string[] {
  const arr = [...next]
  return props.accordion ? (arr[0] ?? '') : arr
}

function emitOpen(next: Set<string>, key: string, wasOpen: boolean) {
  const value = toEmitValue(next)
  trackEmit({
    component: 'Collapse',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value }
  })
  trackEmit({
    component: 'Collapse',
    type: wasOpen ? 'collapse' : 'expand',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { key, activeKeys: value }
  })
  emit('update:modelValue', value)
  emit('change', value)
  if (wasOpen) emit('collapse', { key, activeKeys: value })
  else emit('expand', { key, activeKeys: value })
}

function toggle(key: string, panelDisabled?: boolean) {
  if (props.disabled || panelDisabled) return
  const wasOpen = openKeys.value.has(key)
  const next = new Set(openKeys.value)
  if (wasOpen) next.delete(key)
  else {
    if (props.accordion) next.clear()
    next.add(key)
  }
  openKeys.value = next
  emitOpen(next, key, wasOpen)
}

const titleText = computed(() => props.title)

const rootClass = computed(() => [
  'vp-collapse',
  {
    'vp-collapse--disabled': props.disabled,
    'vp-collapse--bordered': props.bordered && !props.ghost,
    'vp-collapse--ghost': props.ghost
  },
  props.class
])
</script>

<template>
  <div :class="rootClass" :style="style">
    <h3 v-if="titleText" class="vp-collapse__heading">{{ titleText }}</h3>
    <div
      v-for="panel in items"
      :key="panel.key"
      class="vp-collapse__item"
      :class="{ 'vp-collapse__item--open': openKeys.has(panel.key) }"
    >
      <button
        type="button"
        class="vp-collapse__trigger"
        :aria-expanded="openKeys.has(panel.key)"
        :disabled="disabled || panel.disabled"
        @click="toggle(panel.key, panel.disabled)"
      >
        <span class="vp-collapse__title">{{ panel.title }}</span>
        <Icon
          class="vp-collapse__icon"
          name="ChevronDown"
          size="sm"
          aria-hidden="true"
        />
      </button>
      <div
        v-show="openKeys.has(panel.key)"
        class="vp-collapse__content"
        role="region"
        :aria-label="panel.title"
      >
        <slot :name="panel.key" :panel="panel">
          {{ panel.content }}
        </slot>
      </div>
    </div>
    <slot />
  </div>
</template>
