<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { OnvifRecordPlanProps, OnvifRecordPlanEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<OnvifRecordPlanProps>(), {
  slots: () => Array.from({ length: 24 }, (_, i) => i >= 8 && i < 20),
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<OnvifRecordPlanEmits>()
const { t } = useLocale()
const local = ref([...(props.slots ?? [])])

watch(() => props.slots, (v) => { local.value = [...(v ?? [])] }, { deep: true })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.onvif.recordPlan))
const activeCount = computed(() => local.value.filter(Boolean).length)

function toggleSlot(i: number) {
  if (props.disabled || props.loading) return
  local.value[i] = !local.value[i]
  emit('update:slots', [...local.value])
  emit('toggle', i, local.value[i])
  trackEmit({ component: 'OnvifRecordPlan', type: 'toggle', trackId: props.trackId, telemetry: props.telemetry })
}

function fillAll(on: boolean) {
  if (props.disabled || props.loading) return
  local.value = local.value.map(() => on)
  emit('update:slots', [...local.value])
  trackEmit({ component: 'OnvifRecordPlan', type: on ? 'fill' : 'clear', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-onvif-record-plan', 'vp-onvif-record-plan__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-onvif-record-plan-title"
    data-component="OnvifRecordPlan"
  >
    <header class="vp-onvif-record-plan__header">
      <h3 id="vp-onvif-record-plan-title" class="vp-onvif-record-plan__title">{{ titleText }}</h3>
      <div class="vp-onvif-record-plan__status" role="status" aria-live="polite">{{ activeCount }}</div>
    </header>
    <div v-if="loading" class="vp-onvif-record-plan__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-onvif-record-plan__body">
      <p class="vp-onvif-record-plan__muted">{{ t(LocaleKeys.industry.onvif.schedule) }}</p>
      <div class="vp-onvif-record-plan__toolbar">
        <button type="button" class="vp-onvif-record-plan__btn" :disabled="disabled" @click="fillAll(true)">
          {{ t(LocaleKeys.button.confirm) }}
        </button>
        <button type="button" class="vp-onvif-record-plan__btn vp-onvif-record-plan__btn--ghost" :disabled="disabled" @click="fillAll(false)">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <div class="vp-onvif-record-plan__grid-schedule" role="group" :aria-label="t(LocaleKeys.industry.onvif.schedule)">
        <button
          v-for="(on, i) in local"
          :key="i"
          type="button"
          :class="['vp-onvif-record-plan__slot', { 'vp-onvif-record-plan__slot--on': on }]"
          :disabled="disabled"
          :aria-pressed="on"
          @click="toggleSlot(i)"
        />
      </div>
      <slot />
    </div>
  </section>
</template>
