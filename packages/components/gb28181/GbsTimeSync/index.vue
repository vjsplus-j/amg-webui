<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { ref, watch, computed, onUnmounted, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GbsTimeSyncProps, GbsTimeSyncEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GbsTimeSyncProps>(), {
  server: 'ntp.pool.org',
  disabled: false,
  syncing: false,
  loading: false,
  telemetry: undefined
})

const emit = defineEmits<GbsTimeSyncEmits>()
const { t } = useLocale()
const srv = ref(props.server ?? '')
let syncTimer: ReturnType<typeof setTimeout> | null = null

watch(() => props.server, (v) => { srv.value = v ?? '' })

const titleText = computed(() => props.title ?? t(LocaleKeys.industry.gbs.timeSync))
const statusLabel = computed(() =>
  props.syncing || props.loading ? t(LocaleKeys.common.loading) : t(LocaleKeys.industry.gbs.syncNow)
)

function onServer(e: Event) {
  const v = (e.target as HTMLInputElement).value
  srv.value = v
  emit('update:server', v)
}

function syncNow() {
  if (props.disabled || props.loading || props.syncing) return
  emit('sync')
  trackEmit({ component: 'GbsTimeSync', type: 'sync', trackId: props.trackId, telemetry: props.telemetry })
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => { syncTimer = null }, 800)
}

function resetServer() {
  if (props.disabled || props.loading) return
  srv.value = props.server ?? ''
  trackEmit({ component: 'GbsTimeSync', type: 'reset', trackId: props.trackId, telemetry: props.telemetry })
}

onUnmounted(() => {
  if (syncTimer) clearTimeout(syncTimer)
})

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <section
    :class="['vp-gbs-time-sync', 'vp-gbs-time-sync__panel', props.class]"
    :style="style"
    role="region"
    aria-labelledby="vp-gbs-time-sync-title"
    data-component="GbsTimeSync"
  >
    <header class="vp-gbs-time-sync__header">
      <h3 id="vp-gbs-time-sync-title" class="vp-gbs-time-sync__title">{{ titleText }}</h3>
      <div class="vp-gbs-time-sync__status" role="status" aria-live="polite">{{ statusLabel }}</div>
    </header>
    <div v-if="loading" class="vp-gbs-time-sync__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-gbs-time-sync__body">
      <label class="vp-gbs-time-sync__field">
        <span class="vp-gbs-time-sync__label">{{ t(LocaleKeys.industry.gbs.sipDomain) }}</span>
        <input class="vp-gbs-time-sync__input" :value="srv" :disabled="disabled || syncing" @input="onServer" />
      </label>
      <div class="vp-gbs-time-sync__toolbar">
        <button type="button" class="vp-gbs-time-sync__btn" :disabled="disabled || syncing" @click="syncNow">
          {{ t(LocaleKeys.industry.gbs.syncNow) }}
        </button>
        <button type="button" class="vp-gbs-time-sync__btn vp-gbs-time-sync__btn--ghost" :disabled="disabled" @click="resetServer">
          {{ t(LocaleKeys.button.reset) }}
        </button>
      </div>
      <slot />
    </div>
  </section>
</template>
