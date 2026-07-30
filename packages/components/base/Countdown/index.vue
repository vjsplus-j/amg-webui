<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { CountdownProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<CountdownProps>(), {
  format: 'HH:mm:ss',
  millisecond: false
})

const emit = defineEmits<{
  (e: 'finish'): void
  (e: 'tick', remainingMs: number): void
}>()

const remaining = ref(0)
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
  emit('tick', remaining.value)

  if (diff <= 0) {
    clearTimer()
    emit('finish')
  }
}

function startTimer() {
  clearTimer()
  tick()
  const interval = props.millisecond ? 50 : 1000
  timer = setInterval(tick, interval)
}

watch(() => props.value, startTimer, { immediate: true })
watch(() => props.millisecond, startTimer)

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <span
    :class="['vp-countdown', { 'vp-countdown--finished': finished }, props.class]"
    :style="style"
    role="timer"
    aria-live="polite"
    :aria-label="displayText"
  >
    <slot :formatted="displayText">{{ displayText }}</slot>
  </span>
</template>
