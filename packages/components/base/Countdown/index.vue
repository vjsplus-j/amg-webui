<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { CountdownProps, CountdownEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CountdownProps>(), {
  format: 'HH:mm:ss',
  millisecond: false,
  autoStart: true,
  paused: false,
  interval: undefined,
  showControls: false
})

const emit = defineEmits<CountdownEmits>()
const { t } = useLocale()

const remaining = ref(0)
const running = ref(false)
const finishedEmitted = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function toTimestamp(val: number | Date): number {
  if (val instanceof Date) return val.getTime()
  return val
}

function pad(n: number, len = 2): string {
  return String(n).padStart(len, '0')
}

function formatTime(ms: number): string {
  if (ms <= 0) {
    return props.format.replace(/HH|mm|ss|SSS/g, (token) => {
      if (token === 'HH') return '00'
      if (token === 'mm') return '00'
      if (token === 'ss') return '00'
      if (token === 'SSS') return '000'
      return token
    })
  }

  const totalSec = Math.floor(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  const millis = ms % 1000

  return props.format
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds))
    .replace('SSS', pad(millis, 3))
}

const displayText = computed(() => formatTime(remaining.value))
const finished = computed(() => remaining.value <= 0)
const intervalMs = computed(() => props.interval ?? (props.millisecond ? 50 : 1000))

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function tick() {
  const target = toTimestamp(props.value)
  const diff = target - Date.now()
  remaining.value = Math.max(0, diff)
  emit('update:modelValue', remaining.value)
  emit('tick', remaining.value)

  if (diff <= 0) {
    clearTimer()
    running.value = false
    if (!finishedEmitted.value) {
      finishedEmitted.value = true
      emit('finish')
    }
  }
}

function startTimer() {
  clearTimer()
  finishedEmitted.value = false
  tick()
  if (props.paused || remaining.value <= 0) return
  running.value = true
  timer = setInterval(tick, intervalMs.value)
  emit('start', remaining.value)
}

function pause() {
  if (!running.value) return
  clearTimer()
  running.value = false
  emit('pause', remaining.value)
}

function resume() {
  if (running.value || finished.value) return
  running.value = true
  timer = setInterval(tick, intervalMs.value)
  emit('resume', remaining.value)
}

function reset() {
  clearTimer()
  finishedEmitted.value = false
  remaining.value = Math.max(0, toTimestamp(props.value) - Date.now())
  emit('update:modelValue', remaining.value)
  emit('reset', remaining.value)
  if (props.autoStart && !props.paused) resume()
}

watch(() => props.value, () => {
  if (props.autoStart) startTimer()
  else reset()
}, { immediate: true })
watch(() => [props.millisecond, props.interval] as const, () => {
  if (running.value) startTimer()
})
watch(() => props.paused, (paused) => {
  if (paused) pause()
  else if (props.autoStart) resume()
})

onUnmounted(() => {
  clearTimer()
})

defineExpose({ start: startTimer, pause, resume, reset })
</script>

<template>
  <component
    :is="showControls ? 'div' : 'span'"
    :class="['vp-countdown', { 'vp-countdown--finished': finished }, props.class]"
    :style="style"
    role="timer"
    aria-live="polite"
    :aria-label="displayText"
  >
    <span v-if="prefix" class="vp-countdown__affix">{{ prefix }}</span>
    <slot :formatted="displayText" :remaining="remaining" :running="running">{{ displayText }}</slot>
    <span v-if="suffix" class="vp-countdown__affix">{{ suffix }}</span>
    <span v-if="showControls" class="vp-countdown__controls" role="group" :aria-label="displayText">
      <button type="button" class="vp-countdown__btn" :disabled="finished" @click="running ? pause() : resume()">
        {{ running ? t('common.pause') : t('common.play') }}
      </button>
      <button type="button" class="vp-countdown__btn vp-countdown__btn--ghost" @click="reset">
        {{ t('button.reset') }}
      </button>
    </span>
  </component>
</template>
