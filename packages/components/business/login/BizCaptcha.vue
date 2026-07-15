<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { BizCaptchaEmits, BizCaptchaProps } from './types'

const props = withDefaults(defineProps<BizCaptchaProps>(), {
  mode: 'checkbox',
  modelValue: '',
  label: undefined,
  disabled: false
})

const emit = defineEmits<BizCaptchaEmits>()
const { t } = useLocale()

const checked = ref(false)
const dragging = ref(false)
const offset = ref(0)
const trackEl = ref<HTMLElement | null>(null)
const failed = ref(false)

const passed = computed(() => Boolean(props.modelValue))
const checkLabel = computed(() => props.label ?? t(LocaleKeys.auth.notRobot))

watch(
  () => props.modelValue,
  (v) => {
    if (!v) {
      checked.value = false
      offset.value = 0
      failed.value = false
    } else {
      checked.value = true
      offset.value = 100
    }
  }
)

function mintToken() {
  return `vp-cap_${Date.now().toString(36)}`
}

function succeed() {
  const token = mintToken()
  failed.value = false
  emit('update:modelValue', token)
  emit('verify', token)
}

function fail() {
  failed.value = true
  checked.value = false
  offset.value = 0
  emit('update:modelValue', '')
  emit('fail')
}

function onCheck() {
  if (props.disabled || props.mode !== 'checkbox') return
  if (checked.value && passed.value) return
  checked.value = true
  succeed()
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || props.mode !== 'slider' || passed.value) return
  dragging.value = true
  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  move(e)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  move(e)
}

function onPointerUp() {
  if (!dragging.value) return
  dragging.value = false
  if (offset.value >= 92) {
    offset.value = 100
    succeed()
  } else {
    fail()
  }
}

function move(e: PointerEvent) {
  const el = trackEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = Math.min(Math.max(e.clientX - rect.left - 18, 0), rect.width - 36)
  offset.value = Math.round((x / (rect.width - 36)) * 100)
}

function refresh() {
  checked.value = false
  offset.value = 0
  failed.value = false
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="biz-captcha" :class="{ 'is-passed': passed, 'is-failed': failed }">
    <template v-if="mode === 'checkbox'">
      <button
        type="button"
        class="biz-captcha__check"
        :disabled="disabled"
        :aria-pressed="passed"
        @click="onCheck"
      >
        <span class="biz-captcha__box" :class="{ 'is-on': passed || checked }" />
        <span class="biz-captcha__label">
          {{ passed ? t(LocaleKeys.auth.captchaPass) : checkLabel }}
        </span>
      </button>
    </template>

    <template v-else>
      <div class="biz-captcha__slider-head">
        <span>
          {{ passed ? t(LocaleKeys.auth.captchaPass) : t(LocaleKeys.auth.slideToVerify) }}
        </span>
        <button type="button" class="biz-captcha__refresh" :disabled="disabled" @click="refresh">
          {{ t(LocaleKeys.auth.captchaRefresh) }}
        </button>
      </div>
      <div
        ref="trackEl"
        class="biz-captcha__track"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div class="biz-captcha__fill" :style="{ width: offset + '%' }" />
        <div
          class="biz-captcha__knob"
          :style="{ left: `calc(${offset}% - ${offset > 0 ? 18 : 0}px)` }"
          role="slider"
          :aria-valuenow="offset"
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <span v-if="!passed" class="biz-captcha__hint">{{ t(LocaleKeys.auth.captchaHint) }}</span>
      </div>
    </template>
  </div>
</template>
