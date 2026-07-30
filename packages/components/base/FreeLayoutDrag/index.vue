<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { FreeLayoutDragProps, FreeLayoutDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FreeLayoutDragProps>(), { enabled: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<FreeLayoutDragEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const on = ref(props.enabled)
const titleText = computed(() => props.title ?? t('component.free-layout-drag.title'))

watch(() => props.enabled, (v) => { on.value = v; if (v && editor) { editor.mode.value = 'free'; emit('mode', 'free') } }, { immediate: true })

function toggle() {
  if (props.disabled) return
  on.value = !on.value
  if (on.value && editor) editor.mode.value = 'free'
  emit('toggle', on.value)
  trackEmit({ component: 'FreeLayoutDrag', type: 'toggle', trackId: props.trackId, telemetry: props.telemetry, payload: { enabled: on.value } })
}
</script>

<template>
  <section :class="['vp-free-layout-drag', { 'vp-free-layout-drag--active': on }, props.class]" :style="style" role="region" aria-labelledby="vp-free-layout-drag-title" data-component="FreeLayoutDrag">
    <header class="vp-free-layout-drag__header"><h3 id="vp-free-layout-drag-title" class="vp-free-layout-drag__title">{{ titleText }}</h3><span class="vp-free-layout-drag__badge" :class="on ? 'vp-free-layout-drag__badge--on' : 'vp-free-layout-drag__badge--off'">{{ on ? 'free' : 'off' }}</span></header>
    <div v-if="loading" class="vp-free-layout-drag__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-free-layout-drag__body"><slot /><button type="button" class="vp-free-layout-drag__btn vp-free-layout-drag__btn--ghost" :disabled="disabled" @click="toggle">{{ t(LocaleKeys.button.confirm) }}</button></div>
  </section>
</template>
