<script setup lang="ts">
import { createMockMediaAdapter, type MediaAdapter } from '@amg-webui/utils'
import { computed, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { PTZControlProps, PTZControlEmits, PtzCommand, PtzCommandPayload } from './types'
import './style.scss'

const props = withDefaults(defineProps<PTZControlProps>(), {
  disabled: false,
  speed: 4,
  minSpeed: 1,
  maxSpeed: 8,
  step: 1,
  keyboard: true,
  showAdvanced: true,
  presets: () => []
})
const emit = defineEmits<PTZControlEmits>()
const { t } = useLocale()

const minSpeed = computed(() => Math.max(1, props.minSpeed))
const maxSpeed = computed(() => Math.max(minSpeed.value, props.maxSpeed))
const speedValue = computed(() =>
  Math.min(maxSpeed.value, Math.max(minSpeed.value, Number(props.speed) || minSpeed.value))
)

const padButtons = computed(() => [
  { command: 'upLeft' as const, label: '↖', aria: `${t('industry.ptz.up')} ${t('industry.ptz.left')}` },
  { command: 'up' as const, label: '▲', aria: t('industry.ptz.up') },
  { command: 'upRight' as const, label: '↗', aria: `${t('industry.ptz.up')} ${t('industry.ptz.right')}` },
  { command: 'left' as const, label: '◀', aria: t('industry.ptz.left') },
  { command: 'stop' as const, label: '■', aria: t('industry.ptz.stop') },
  { command: 'right' as const, label: '▶', aria: t('industry.ptz.right') },
  { command: 'downLeft' as const, label: '↙', aria: `${t('industry.ptz.down')} ${t('industry.ptz.left')}` },
  { command: 'down' as const, label: '▼', aria: t('industry.ptz.down') },
  { command: 'downRight' as const, label: '↘', aria: `${t('industry.ptz.down')} ${t('industry.ptz.right')}` }
])

function send(cmd: PtzCommand, source: PtzCommandPayload['source'] = 'button', preset?: number) {
  if (props.disabled) return
  const payload: PtzCommandPayload = { command: cmd, speed: speedValue.value, source, preset }
  emit('update:modelValue', cmd === 'stop' ? null : cmd)
  emit('command', cmd, payload)
  emit('change', payload)
}

function updateSpeed(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:speed', Math.min(maxSpeed.value, Math.max(minSpeed.value, Number(target.value))))
}

function onKeydown(event: KeyboardEvent) {
  if (!props.keyboard || props.disabled) return
  const map: Record<string, PtzCommand | undefined> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Escape: 'stop'
  }
  const command = map[event.key]
  if (!command) return
  event.preventDefault()
  send(command, 'keyboard')
}

defineExpose({ send })

const mediaAdapter: MediaAdapter = createMockMediaAdapter()
onBeforeUnmount(() => {
  mediaAdapter.destroy()
})
</script>

<template>
  <div
    :class="['vp-ptz-control', { 'vp-ptz-control--disabled': disabled }, props.class]"
    :style="style"
    data-component="PTZControl"
    role="group"
    :aria-label="t('component.ptz-control.title')"
    :aria-disabled="disabled || undefined"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="vp-ptz-control__pad" role="group" :aria-label="t('industry.ptz.stop')">
      <button
        v-for="item in padButtons"
        :key="item.command"
        type="button"
        class="vp-ptz-control__btn vp-ptz-control__btn--pad"
        :class="{
          'vp-ptz-control__btn--stop': item.command === 'stop',
          'vp-ptz-control__btn--active': modelValue === item.command
        }"
        :disabled="disabled"
        :aria-label="item.aria"
        :aria-pressed="modelValue === item.command"
        @click="send(item.command)"
      >
        {{ item.label }}
      </button>
    </div>
    <label class="vp-ptz-control__speed">
      <span class="vp-ptz-control__muted">{{ t('industry.ptz.speed') }}</span>
      <input
        class="vp-ptz-control__range"
        type="range"
        :min="minSpeed"
        :max="maxSpeed"
        :step="step"
        :value="speedValue"
        :disabled="disabled"
        :aria-label="t('industry.ptz.speed')"
        @input="updateSpeed"
      />
      <span class="vp-ptz-control__badge">{{ speedValue }}</span>
    </label>
    <div class="vp-ptz-control__toolbar" role="toolbar" :aria-label="t('component.ptz-control.title')">
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomIn')">{{ t('industry.ptz.zoomIn') }}</button>
      <button type="button" class="vp-ptz-control__btn" :disabled="disabled" @click="send('zoomOut')">{{ t('industry.ptz.zoomOut') }}</button>
    </div>
    <div v-if="showAdvanced" class="vp-ptz-control__toolbar" role="toolbar" :aria-label="t('industry.ptz.preset')">
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--ghost" :disabled="disabled" @click="send('focusNear')">{{ t('industry.ptz.focusNear') }}</button>
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--ghost" :disabled="disabled" @click="send('focusFar')">{{ t('industry.ptz.focusFar') }}</button>
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--ghost" :disabled="disabled" @click="send('irisOpen')">{{ t('industry.ptz.irisOpen') }}</button>
      <button type="button" class="vp-ptz-control__btn vp-ptz-control__btn--ghost" :disabled="disabled" @click="send('irisClose')">{{ t('industry.ptz.irisClose') }}</button>
    </div>
    <div v-if="presets.length" class="vp-ptz-control__presets" role="toolbar" :aria-label="t('industry.ptz.preset')">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        class="vp-ptz-control__btn vp-ptz-control__btn--ghost"
        :disabled="disabled"
        @click="send('preset', 'preset', preset)"
      >
        {{ t('industry.ptz.preset') }} {{ preset }}
      </button>
    </div>
  </div>
</template>
