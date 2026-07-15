<script setup lang="ts">
import { useLocale } from '@amg-webui/hooks'
import type { PTZControlProps, PTZControlEmits, PtzCommand } from './types'
import './style.scss'

const props = withDefaults(defineProps<PTZControlProps>(), { disabled: false })
const emit = defineEmits<PTZControlEmits>()
const { t } = useLocale()
function send(cmd: PtzCommand) { if (!props.disabled) emit('command', cmd) }
</script>

<template>
  <div :class="['vp-ptz-control', props.class]" :style="style" data-component="PTZControl">
    <div class="vp-ptz-control__pad">
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--pad" :disabled="disabled" :aria-label="t('industry.ptz.up')" @click="send('up')">▲</button>
      <div class="vp-ptz-control__row">
        <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--pad" :disabled="disabled" :aria-label="t('industry.ptz.left')" @click="send('left')">◀</button>
        <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--pad vp-ptz-control__btn--stop" :disabled="disabled" :aria-label="t('industry.ptz.stop')" @click="send('stop')">■</button>
        <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--pad" :disabled="disabled" :aria-label="t('industry.ptz.right')" @click="send('right')">▶</button>
      </div>
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--pad" :disabled="disabled" :aria-label="t('industry.ptz.down')" @click="send('down')">▼</button>
    </div>
    <div class="vp-ptz-control__toolbar">
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomIn')">{{ t('industry.ptz.zoomIn') }}</button>
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomOut')">{{ t('industry.ptz.zoomOut') }}</button>
    </div>
  </div>
</template>
