<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import { detectBrowser } from '@amg-webui/utils'
import type { BrowserDetectProps, BrowserDetectEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BrowserDetectProps>(), { loading: false, telemetry: undefined })
const emit = defineEmits<BrowserDetectEmits>()
const { t } = useLocale()
const tick = ref(0)
const info = computed(() => detectBrowser(props.userAgent))
const titleText = computed(() => props.title ?? t('component.browser-detect.browser'))

function refresh() {
  tick.value++
  emit('detected', info.value)
  emit('refresh')
  trackEmit({ component: 'BrowserDetect', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

onMounted(() => refresh())
</script>

<template>
  <section :class="['vp-browser-detect', 'vp-browser-detect__panel', props.class]" :style="style" role="region" aria-labelledby="vp-browser-detect-title" data-component="BrowserDetect">
    <header class="vp-browser-detect__header">
      <h3 id="vp-browser-detect-title" class="vp-browser-detect__title">{{ titleText }}</h3>
      <div class="vp-browser-detect__status" role="status">{{ info.browser }} {{ info.version }}</div>
    </header>
    <div v-if="loading" class="vp-browser-detect__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-browser-detect__body">
      <dl class="vp-browser-detect__list">
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.browser') }}</dt><dd>{{ info.browser }} {{ info.version }}</dd></div>
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.os') }}</dt><dd>{{ info.os }}</dd></div>
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.device') }}</dt><dd>{{ info.device }}</dd></div>
      </dl>
      <div class="vp-browser-detect__toolbar">
        <button type="button" class="vp-browser-detect__btn vp-browser-detect__btn--ghost" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
