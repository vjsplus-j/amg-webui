<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { detectBrowser } from '@amg-webui/utils'
import type { BrowserDetectProps, BrowserDetectEmits } from './types'
import './style.scss'

const props = defineProps<BrowserDetectProps>()
const emit = defineEmits<BrowserDetectEmits>()
const { t } = useLocale()

const info = computed(() => detectBrowser(props.userAgent))

onMounted(() => emit('detected', info.value))
</script>

<template>
  <dl :class="['vp-browser-detect', props.class]" :style="style" data-component="BrowserDetect">
    <div class="vp-browser-detect__item">
      <dt>{{ t('component.browser-detect.browser') }}</dt>
      <dd>{{ info.browser }} {{ info.version }}</dd>
    </div>
    <div class="vp-browser-detect__item">
      <dt>{{ t('component.browser-detect.os') }}</dt>
      <dd>{{ info.os }}</dd>
    </div>
    <div class="vp-browser-detect__item">
      <dt>{{ t('component.browser-detect.device') }}</dt>
      <dd>{{ info.device }}</dd>
    </div>
  </dl>
</template>
