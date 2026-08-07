<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsCascadePanelProps, GbsCascadePanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsCascadePanelProps>(), {
  upstream: '34020000001110000001',
  downstream: '34020000001320000002',
  disabled: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsCascadePanelEmits>()
const { t } = useLocale()
const up = ref(props.upstream ?? '')
const down = ref(props.downstream ?? '')

watch(() => props.upstream, (v) => { up.value = v ?? '' })
watch(() => props.downstream, (v) => { down.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.cascade))
const statusText = computed(() => `${t(LocaleKeys.industry.gbs.upstream)} / ${t(LocaleKeys.industry.gbs.downstream)}`)

function onUpstream(e: Event) {
  const v = (e.target as HTMLInputElement).value
  up.value = v
  emit('update:upstream', v)
}

function onDownstream(e: Event) {
  const v = (e.target as HTMLInputElement).value
  down.value = v
  emit('update:downstream', v)
}

function save() {
  if (props.disabled || props.loading) return
  emit('save')
  trackEmit({ component: 'GbsCascadePanel', type: 'save', trackId: props.trackId, telemetry: props.telemetry })
}

function reset() {
  if (props.disabled || props.loading) return
  up.value = props.upstream ?? ''
  down.value = props.downstream ?? ''
  trackEmit({ component: 'GbsCascadePanel', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-gbs-cascade-panel', 'vp-gbs-cascade-panel__panel', { 'vp-gbs-cascade-panel--disabled': disabled }, props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-cascade-panel-title"
    data-component="GbsCascadePanel"
  >
    <header class="vp-gbs-cascade-panel__header">
      <h3 id="vp-gbs-cascade-panel-title" class="vp-gbs-cascade-panel__title">{{ titleText }}</h3>
      <div class="vp-gbs-cascade-panel__status" role="status" aria-live="polite">{{ statusText }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-cascade-panel__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-cascade-panel__body">
      <label class="vp-gbs-cascade-panel__field">
        <span class="vp-gbs-cascade-panel__label">{{ t(LocaleKeys.industry.gbs.upstream) }}</span>
        <input class="vp-gbs-cascade-panel__input" :value="up" :disabled="disabled" @input="onUpstream" />
      </label>
      <label class="vp-gbs-cascade-panel__field">
        <span class="vp-gbs-cascade-panel__label">{{ t(LocaleKeys.industry.gbs.downstream) }}</span>
        <input class="vp-gbs-cascade-panel__input" :value="down" :disabled="disabled" @input="onDownstream" />
      </label>
      <div class="vp-gbs-cascade-panel__toolbar">
        <button type="button" class="vp-gbs-cascade-panel__btn" :disabled="disabled" @click="save">
          {{ t(LocaleKeys.button.save) }}
        </button>
        <button type="button" class="vp-gbs-cascade-panel__btn vp-gbs-cascade-panel__btn--ghost" :disabled="disabled" @click="reset">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
