<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import { isClient, getDocument, getWindow } from '@amg-webui/utils/env'
import type { TourProps, TourEmits, TourPlacement } from './types'
import './style.scss'

const GAP = 12

const props = withDefaults(defineProps<TourProps>(), {
  modelValue: undefined,
  current: 0,
  steps: () => [],
  open: false,
  mask: true,
  type: 'default',
  telemetry: undefined
})

const emit = defineEmits<TourEmits>()
const { t } = useLocale()

const highlightStyle = ref<Record<string, string>>({})
const popoverStyle = ref<Record<string, string>>({})
const maskStyle = ref<Record<string, string>>({})
const targetMissing = ref(false)

const stepIndex = computed(() =>
  props.modelValue !== undefined ? props.modelValue : (props.current ?? 0)
)

const currentStep = computed(() => props.steps[stepIndex.value])
const isFirst = computed(() => stepIndex.value <= 0)
const isLast = computed(() => stepIndex.value >= props.steps.length - 1)

const popoverClass = computed(() => [
  'vp-tour__popover',
  { 'vp-tour__popover--primary': props.type === 'primary' }
])

function setStep(index: number) {
  const clamped = Math.max(0, Math.min(props.steps.length - 1, index))
  emit('update:current', clamped)
  emit('update:modelValue', clamped)
  emit('change', clamped)
  trackEmit({
    component: 'Tour',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { step: clamped }
  })
}

function closeTour(type: 'close' | 'skip' | 'finish') {
  emit('update:open', false)
  if (type === 'skip') emit('skip')
  else if (type === 'finish') emit('finish')
  else emit('close')
  trackEmit({
    component: 'Tour',
    type,
    trackId: props.trackId,
    telemetry: props.telemetry
  })
}

function prevStep() {
  if (!isFirst.value) setStep(stepIndex.value - 1)
}

function nextStep() {
  if (isLast.value) closeTour('finish')
  else setStep(stepIndex.value + 1)
}

function resolveTarget(selector: string): HTMLElement | null {
  const doc = getDocument()
  if (!doc || !selector) return null
  return doc.querySelector<HTMLElement>(selector)
}

function placePopover(
  rect: DOMRect,
  placement: TourPlacement,
  popoverEl: HTMLElement | null
) {
  const popW = popoverEl?.offsetWidth ?? 280
  const popH = popoverEl?.offsetHeight ?? 160
  let top = rect.bottom + GAP
  let left = rect.left

  switch (placement) {
    case 'top':
      top = rect.top - popH - GAP
      left = rect.left + rect.width / 2 - popW / 2
      break
    case 'bottom':
      top = rect.bottom + GAP
      left = rect.left + rect.width / 2 - popW / 2
      break
    case 'left':
      top = rect.top + rect.height / 2 - popH / 2
      left = rect.left - popW - GAP
      break
    case 'right':
      top = rect.top + rect.height / 2 - popH / 2
      left = rect.right + GAP
      break
  }

  const win = getWindow()
  const maxLeft = Math.max(GAP, (win?.innerWidth ?? 0) - popW - GAP)
  const maxTop = Math.max(GAP, (win?.innerHeight ?? 0) - popH - GAP)
  left = Math.min(maxLeft, Math.max(GAP, left))
  top = Math.min(maxTop, Math.max(GAP, top))

  popoverStyle.value = {
    top: `${top}px`,
    left: `${left}px`
  }
}

function updateLayout(popoverEl?: HTMLElement | null) {
  const step = currentStep.value
  if (!step) return

  const target = resolveTarget(step.target)
  if (!target) {
    targetMissing.value = true
    highlightStyle.value = { display: 'none' }
    maskStyle.value = {}
    popoverStyle.value = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
    return
  }

  targetMissing.value = false
  const rect = target.getBoundingClientRect()
  const pad = 4
  const top = Math.max(0, rect.top - pad)
  const left = Math.max(0, rect.left - pad)
  const win = getWindow()
  const right = Math.min(win?.innerWidth ?? 0, rect.right + pad)
  const bottom = Math.min(win?.innerHeight ?? 0, rect.bottom + pad)

  highlightStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${right - left}px`,
    height: `${bottom - top}px`
  }

  maskStyle.value = {
    clipPath: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${left}px ${top}px, ${left}px ${bottom}px, ${right}px ${bottom}px, ${right}px ${top}px, ${left}px ${top}px)`
  }

  placePopover(
    new DOMRect(left, top, right - left, bottom - top),
    step.placement ?? 'bottom',
    popoverEl ?? null
  )
}

async function refreshLayout() {
  await nextTick()
  const popoverEl = getDocument()?.querySelector<HTMLElement>('.vp-tour__popover') ?? null
  updateLayout(popoverEl)
}

function onMaskClick() {
  closeTour('close')
}

function onScrollOrResize() {
  if (props.open) refreshLayout()
}

watch(
  () => [props.open, stepIndex.value, props.steps] as const,
  ([open]) => {
    if (open) refreshLayout()
  },
  { deep: true }
)

onMounted(() => {
  if (!isClient) return
  const win = getWindow()
  if (!win) return
  win.addEventListener('resize', onScrollOrResize, { passive: true })
  win.addEventListener('scroll', onScrollOrResize, true)
  if (props.open) refreshLayout()
})

onUnmounted(() => {
  const win = getWindow()
  if (!win) return
  win.removeEventListener('resize', onScrollOrResize)
  win.removeEventListener('scroll', onScrollOrResize, true)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-tour-fade">
      <div v-if="open && steps.length" class="vp-tour" data-component="Tour">
        <div
          v-if="mask"
          class="vp-tour__mask"
          :style="maskStyle"
          @click="onMaskClick"
        />
        <div
          v-if="mask && !targetMissing"
          class="vp-tour__highlight"
          :style="highlightStyle"
        />
        <div
          :class="popoverClass"
          :style="popoverStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="t(LocaleKeys.component.tour.aria)"
        >
          <h3 v-if="currentStep?.title" class="vp-tour__title">
            {{ currentStep.title }}
          </h3>
          <p v-if="currentStep?.description" class="vp-tour__description">
            {{ currentStep.description }}
          </p>
          <p v-else-if="targetMissing" class="vp-tour__description">
            {{ t(LocaleKeys.component.tour.targetMissing) }}
          </p>

          <div class="vp-tour__footer">
            <button
              type="button"
              class="vp-tour__btn vp-tour__btn--ghost"
              @click="closeTour('skip')"
            >
              {{ t(LocaleKeys.component.tour.skip) }}
            </button>
            <button
              v-if="!isFirst"
              type="button"
              class="vp-tour__btn"
              @click="prevStep"
            >
              {{ t(LocaleKeys.common.previous) }}
            </button>
            <button
              type="button"
              :class="['vp-tour__btn', { 'vp-tour__btn--primary': type === 'primary' || isLast }]"
              @click="nextStep"
            >
              {{ isLast ? t(LocaleKeys.component.tour.finish) : t(LocaleKeys.common.next) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
