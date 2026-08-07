<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@amg-webui/core'
import { Slider, Switch } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'

export interface MotionLiveState {
  spin: boolean
  pulse: boolean
  heartbeat: boolean
  bounce: boolean
  blink: boolean
  breathe: boolean
  glow: boolean
  marqueeLeft: boolean
  marqueeRight: boolean
  scrollUp: boolean
  scrollDown: boolean
  dampOut: boolean
  rotate: number
  flipH: boolean
  flipV: boolean
}

const EMPTY_FLAGS: Pick<
  MotionLiveState,
  | 'spin'
  | 'pulse'
  | 'heartbeat'
  | 'bounce'
  | 'blink'
  | 'breathe'
  | 'glow'
  | 'marqueeLeft'
  | 'marqueeRight'
  | 'scrollUp'
  | 'scrollDown'
  | 'dampOut'
> = {
  spin: false,
  pulse: false,
  heartbeat: false,
  bounce: false,
  blink: false,
  breathe: false,
  glow: false,
  marqueeLeft: false,
  marqueeRight: false,
  scrollUp: false,
  scrollDown: false,
  dampOut: false
}

const props = withDefaults(
  defineProps<{
    modelValue: MotionLiveState
    /** Icon glyph transforms (rotate / flip) */
    showFlipRotate?: boolean
    /**
     * Shared opacity pulse. Badge uses dedicated ring `pulse` — set false there
     * and pass `badgePulse` instead.
     */
    showPulse?: boolean
    /** Sharp flash / fluorescent / breathe / marquee / scroll / damp-out */
    showTextFx?: boolean
    /** Marquee + scroll + dampOut (defaults follow showTextFx) */
    showTickerFx?: boolean
    /** Badge mark ring/brightness pulse */
    showBadgePulse?: boolean
    badgePulse?: boolean
  }>(),
  {
    showFlipRotate: false,
    showPulse: true,
    showTextFx: true,
    showTickerFx: undefined,
    showBadgePulse: false,
    badgePulse: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: MotionLiveState]
  'update:badgePulse': [value: boolean]
}>()

const { t } = useLocale()

const state = computed({
  get: () => props.modelValue,
  set: (v: MotionLiveState) => emit('update:modelValue', v)
})

function patch(partial: Partial<MotionLiveState>) {
  emit('update:modelValue', { ...state.value, ...partial })
}

function reset() {
  emit('update:modelValue', {
    ...EMPTY_FLAGS,
    rotate: 0,
    flipH: false,
    flipV: false
  })
  if (props.showBadgePulse) emit('update:badgePulse', false)
}

function setExclusive(
  key: keyof typeof EMPTY_FLAGS,
  value: boolean
) {
  const on = Boolean(value)
  patch({
    ...EMPTY_FLAGS,
    [key]: on
  })
}

function onRotate(value: number | [number, number]) {
  patch({ rotate: typeof value === 'number' ? value : value[0] })
}

function onFlipH(value: boolean) {
  patch({ flipH: Boolean(value) })
}

function onFlipV(value: boolean) {
  patch({ flipV: Boolean(value) })
}

function onBadgePulse(value: boolean) {
  emit('update:badgePulse', Boolean(value))
}

const showTicker = computed(() =>
  props.showTickerFx === undefined ? props.showTextFx : props.showTickerFx
)

const rotateLabel = computed(() =>
  t('example.doc.icon.demo.motionRotateValue', { value: state.value.rotate })
)

const debugText = computed(() => {
  const s = state.value
  const parts = [
    ...(props.showFlipRotate ? [`rotate=${s.rotate}`] : []),
    `spin=${s.spin}`,
    ...(props.showPulse ? [`pulse=${s.pulse}`] : []),
    ...(props.showBadgePulse ? [`badgePulse=${props.badgePulse}`] : []),
    `heartbeat=${s.heartbeat}`,
    `bounce=${s.bounce}`,
    ...(props.showTextFx
      ? [`blink=${s.blink}`, `breathe=${s.breathe}`, `glow=${s.glow}`]
      : []),
    ...(showTicker.value
      ? [
          `marqueeLeft=${s.marqueeLeft}`,
          `marqueeRight=${s.marqueeRight}`,
          `scrollUp=${s.scrollUp}`,
          `scrollDown=${s.scrollDown}`,
          `dampOut=${s.dampOut}`
        ]
      : []),
    ...(props.showFlipRotate ? [`flipH=${s.flipH}`, `flipV=${s.flipV}`] : [])
  ]
  return parts.join(' · ')
})

const panelTitle = computed(() => t('example.doc.icon.demo.motion'))
</script>

<template>
  <div class="vp-motion-live">
    <div
      class="vp-motion-live__preview"
      role="list"
      :aria-label="panelTitle"
    >
      <slot name="preview" :state="state" />
    </div>

    <div class="vp-motion-live__panel">
      <header class="vp-motion-live__head">
        <h4 class="vp-motion-live__title">{{ panelTitle }}</h4>
        <Button
          icon="RotateCcw"
          size="sm"
          shape="square"
          variant="outlined"
          :aria-label="t('example.doc.icon.demo.motionReset')"
          :title="t('example.doc.icon.demo.motionReset')"
          @click="reset"
        />
      </header>

      <p class="vp-motion-live__debug" aria-live="polite">{{ debugText }}</p>

      <div v-if="showFlipRotate" class="vp-motion-live__row vp-motion-live__row--stack">
        <div class="vp-motion-live__meta">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionRotate') }}</span>
          <span class="vp-motion-live__value">{{ rotateLabel }}</span>
        </div>
        <Slider
          class="vp-motion-live__slider"
          :model-value="state.rotate"
          :min="0"
          :max="360"
          :step="15"
          @update:model-value="onRotate"
        />
      </div>

      <div class="vp-motion-live__row">
        <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionSpin') }}</span>
        <Switch
          class="vp-motion-live__switch"
          :model-value="state.spin"
          @update:model-value="(v) => setExclusive('spin', Boolean(v))"
        />
      </div>

      <div v-if="showPulse" class="vp-motion-live__row">
        <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionPulse') }}</span>
        <Switch
          class="vp-motion-live__switch"
          :model-value="state.pulse"
          @update:model-value="(v) => setExclusive('pulse', Boolean(v))"
        />
      </div>

      <div v-if="showBadgePulse" class="vp-motion-live__row">
        <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionPulse') }}</span>
        <Switch
          class="vp-motion-live__switch"
          :model-value="badgePulse"
          @update:model-value="onBadgePulse"
        />
      </div>

      <div class="vp-motion-live__row">
        <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionHeartbeat') }}</span>
        <Switch
          class="vp-motion-live__switch"
          :model-value="state.heartbeat"
          @update:model-value="(v) => setExclusive('heartbeat', Boolean(v))"
        />
      </div>

      <div class="vp-motion-live__row">
        <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionBounce') }}</span>
        <Switch
          class="vp-motion-live__switch"
          :model-value="state.bounce"
          @update:model-value="(v) => setExclusive('bounce', Boolean(v))"
        />
      </div>

      <template v-if="showTextFx">
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionBlink') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.blink"
            @update:model-value="(v) => setExclusive('blink', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionBreathe') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.breathe"
            @update:model-value="(v) => setExclusive('breathe', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionGlow') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.glow"
            @update:model-value="(v) => setExclusive('glow', Boolean(v))"
          />
        </div>
      </template>

      <template v-if="showTicker">
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionMarqueeLeft') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.marqueeLeft"
            @update:model-value="(v) => setExclusive('marqueeLeft', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionMarqueeRight') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.marqueeRight"
            @update:model-value="(v) => setExclusive('marqueeRight', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionScrollUp') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.scrollUp"
            @update:model-value="(v) => setExclusive('scrollUp', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionScrollDown') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.scrollDown"
            @update:model-value="(v) => setExclusive('scrollDown', Boolean(v))"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionDampOut') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.dampOut"
            @update:model-value="(v) => setExclusive('dampOut', Boolean(v))"
          />
        </div>
      </template>

      <template v-if="showFlipRotate">
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionFlipH') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.flipH"
            @update:model-value="onFlipH"
          />
        </div>
        <div class="vp-motion-live__row">
          <span class="vp-motion-live__label">{{ t('example.doc.icon.demo.motionFlipV') }}</span>
          <Switch
            class="vp-motion-live__switch"
            :model-value="state.flipV"
            @update:model-value="onFlipV"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.vp-motion-live {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 18rem);
  gap: var(--theme-section-gap);
  width: 100%;
  align-items: start;
}

.vp-motion-live__preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  min-height: 8rem;
  padding: var(--spacing-xl);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-2);
  color: var(--text-primary);
}

.vp-motion-live__panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}

.vp-motion-live__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-motion-live__title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-motion-live__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-motion-live__row--stack {
  flex-direction: column;
  align-items: stretch;
}

.vp-motion-live__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-motion-live__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-motion-live__value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.vp-motion-live__debug {
  margin: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--theme-input-radius);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  line-height: var(--line-height-body);
  word-break: break-all;
}

.vp-motion-live__slider,
.vp-motion-live__switch {
  flex-shrink: 0;
}

@media (max-width: 48rem) {
  .vp-motion-live {
    grid-template-columns: 1fr;
  }
}
</style>
