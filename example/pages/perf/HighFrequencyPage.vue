<script setup lang="ts">
/**
 * Perf · High frequency lab
 * Spec: docs/APP_WORKFLOW.md §五 — Dialog thrash / input thrash / listener cleanup / re-render audit
 */
import {
  computed,
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  watch
} from 'vue'
import { Button, Card, Space, Tag } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { Dialog } from '@amg-webui/overlay'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, tDyn, locale } = useLocale()

const fps = ref(0)
const memoryMb = ref<number | null>(null)

let rafFps = 0
let frames = 0
let lastTs = 0

function sampleMemory() {
  const perf = performance as Performance & { memory?: { usedJSHeapSize: number } }
  memoryMb.value = perf.memory?.usedJSHeapSize
    ? Math.round((perf.memory.usedJSHeapSize / (1024 * 1024)) * 10) / 10
    : null
}

function fpsLoop(ts: number) {
  if (!lastTs) lastTs = ts
  frames += 1
  const elapsed = ts - lastTs
  if (elapsed >= 500) {
    fps.value = Math.round((frames * 1000) / elapsed)
    frames = 0
    lastTs = ts
    sampleMemory()
    sampleDialogHosts()
  }
  rafFps = requestAnimationFrame(fpsLoop)
}

const memoryText = computed(() => {
  void locale.value
  if (memoryMb.value == null) return tDyn('page.perf.highFrequency.memoryUnavailable')
  return tDyn('page.perf.highFrequency.memoryValue', { mb: memoryMb.value })
})

const checklist = computed(() => {
  void locale.value
  return [
    t('page.perf.highFrequency.c1'),
    t('page.perf.highFrequency.c2'),
    t('page.perf.highFrequency.c3'),
    t('page.perf.highFrequency.c4')
  ]
})

/* —— Dialog thrash —— */
const dialogVisible = ref(false)
const dialogCycles = ref(0)
const dialogHosts = ref(0)
const bursting = ref(false)
let burstTimer: number | null = null
let burstLeft = 0

function sampleDialogHosts() {
  dialogHosts.value = document.querySelectorAll('.vp-dialog, [data-vp-dialog], .vp-overlay-dialog').length
  if (dialogHosts.value === 0) {
    // Fallback: teleported dialog roots often use role=dialog
    dialogHosts.value = document.querySelectorAll('[role="dialog"]').length
  }
}

function openDialog() {
  dialogVisible.value = true
}

function closeDialog() {
  dialogVisible.value = false
}

function onDialogVisible(v: boolean) {
  dialogVisible.value = v
  if (!v) {
    dialogCycles.value += 1
    requestAnimationFrame(sampleDialogHosts)
  } else {
    requestAnimationFrame(sampleDialogHosts)
  }
}

function stopBurst() {
  bursting.value = false
  if (burstTimer != null) {
    window.clearTimeout(burstTimer)
    burstTimer = null
  }
  burstLeft = 0
  dialogVisible.value = false
  requestAnimationFrame(sampleDialogHosts)
}

function burstDialogs(n: number) {
  stopBurst()
  bursting.value = true
  burstLeft = n
  const tick = () => {
    if (!bursting.value || burstLeft <= 0) {
      stopBurst()
      return
    }
    dialogVisible.value = true
    burstTimer = window.setTimeout(() => {
      dialogVisible.value = false
      dialogCycles.value += 1
      burstLeft -= 1
      sampleDialogHosts()
      burstTimer = window.setTimeout(tick, 16)
    }, 48)
  }
  tick()
}

/* —— Input thrash —— */
const inputValue = ref('')
const inputUpdates = ref(0)
const inputThrashing = ref(false)
let inputRaf = 0
let thrashTick = 0

const InputProbe = defineComponent({
  name: 'HfInputProbe',
  props: {
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    onUpdated(() => {
      inputUpdates.value += 1
    })
    return () =>
      h(InputText, {
        modelValue: props.modelValue,
        fluid: true,
        placeholder: tDyn('page.perf.highFrequency.inputPlaceholder'),
        'onUpdate:modelValue': (v: string) => emit('update:modelValue', v)
      })
  }
})

function startInputThrash() {
  if (inputThrashing.value) return
  inputThrashing.value = true
  const loop = () => {
    if (!inputThrashing.value) return
    thrashTick += 1
    inputValue.value = ` thrash-${thrashTick}-${(thrashTick * 17) % 997}`
    inputRaf = requestAnimationFrame(loop)
  }
  inputRaf = requestAnimationFrame(loop)
}

function stopInputThrash() {
  inputThrashing.value = false
  if (inputRaf) cancelAnimationFrame(inputRaf)
  inputRaf = 0
}

function clearInput() {
  stopInputThrash()
  inputValue.value = ''
}

/* —— scroll / resize —— */
const scrollPane = ref<HTMLElement | null>(null)
const activeListeners = ref(0)
const scrollEvents = ref(0)
const resizeEvents = ref(0)
const leakMode = ref(false)

type ListenerPair = {
  target: Window | HTMLElement
  type: string
  handler: EventListener
  options?: AddEventListenerOptions | boolean
}

const attached: ListenerPair[] = []

function onScroll() {
  scrollEvents.value += 1
}

function onResize() {
  resizeEvents.value += 1
}

function detachListeners() {
  for (const item of attached) {
    item.target.removeEventListener(item.type, item.handler, item.options)
  }
  attached.length = 0
  activeListeners.value = 0
  leakMode.value = false
}

function attachListeners(leak: boolean) {
  detachListeners()
  leakMode.value = leak
  const pane = scrollPane.value
  if (!pane) return

  const scrollHandler = onScroll as EventListener
  const resizeHandler = onResize as EventListener
  pane.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler, { passive: true })
  attached.push(
    { target: pane, type: 'scroll', handler: scrollHandler, options: { passive: true } },
    { target: window, type: 'resize', handler: resizeHandler, options: { passive: true } }
  )
  activeListeners.value = attached.length

  if (leak) {
    // Intentionally drop bookkeeping refs so "Detach" cannot find them — simulate leak.
    // Keep a hidden copy on window for intentional lab leak until detach-all in unmount uses attached only.
    // For leak mode we clear `attached` after registering so Detach appears to fail until remount cleanup.
    const leaked = attached.splice(0, attached.length)
    ;(window as Window & { __amgHfLeaked?: ListenerPair[] }).__amgHfLeaked = [
      ...((window as Window & { __amgHfLeaked?: ListenerPair[] }).__amgHfLeaked ?? []),
      ...leaked
    ]
    activeListeners.value = (
      (window as Window & { __amgHfLeaked?: ListenerPair[] }).__amgHfLeaked ?? []
    ).length
  }
}

function forceCleanupLeaks() {
  const w = window as Window & { __amgHfLeaked?: ListenerPair[] }
  for (const item of w.__amgHfLeaked ?? []) {
    item.target.removeEventListener(item.type, item.handler, item.options)
  }
  w.__amgHfLeaked = []
  detachListeners()
}

/* —— re-render audit —— */
const badRenders = ref(0)
const goodRenders = ref(0)
const pulsing = ref<'bad' | 'good' | null>(null)
let pulseRaf = 0
const badPayload = ref({ n: 0 })
const goodPayload = ref({ n: 0 })
const goodStable = { n: 0 }
/** Forces parent re-render during good-dep pulse without changing probe prop identity. */
const parentPulseFrame = ref(0)

const BadProbe = defineComponent({
  name: 'HfBadProbe',
  props: { payload: { type: Object, required: true } },
  setup() {
    onUpdated(() => {
      badRenders.value += 1
    })
    return () =>
      h(
        'div',
        { class: 'vp-hf__probe' },
        `${tDyn('page.perf.highFrequency.probeBad')} · ${badRenders.value}`
      )
  }
})

const GoodProbe = defineComponent({
  name: 'HfGoodProbe',
  props: { payload: { type: Object, required: true } },
  setup() {
    onUpdated(() => {
      goodRenders.value += 1
    })
    return () =>
      h(
        'div',
        { class: 'vp-hf__probe' },
        `${tDyn('page.perf.highFrequency.probeGood')} · ${goodRenders.value}`
      )
  }
})

function stopPulse() {
  pulsing.value = null
  if (pulseRaf) cancelAnimationFrame(pulseRaf)
  pulseRaf = 0
}

function startBadPulse() {
  stopPulse()
  pulsing.value = 'bad'
  const loop = () => {
    if (pulsing.value !== 'bad') return
    badPayload.value = { n: badPayload.value.n + 1 }
    parentPulseFrame.value += 1
    pulseRaf = requestAnimationFrame(loop)
  }
  pulseRaf = requestAnimationFrame(loop)
}

function startGoodPulse() {
  stopPulse()
  pulsing.value = 'good'
  // Ensure probe starts with the stable object identity
  goodPayload.value = goodStable
  const loop = () => {
    if (pulsing.value !== 'good') return
    goodStable.n += 1
    // Same object reference — parent re-renders via parentPulseFrame only
    parentPulseFrame.value += 1
    pulseRaf = requestAnimationFrame(loop)
  }
  pulseRaf = requestAnimationFrame(loop)
}

function resetCounters() {
  dialogCycles.value = 0
  inputUpdates.value = 0
  scrollEvents.value = 0
  resizeEvents.value = 0
  badRenders.value = 0
  goodRenders.value = 0
  thrashTick = 0
}

onMounted(() => {
  rafFps = requestAnimationFrame(fpsLoop)
  sampleDialogHosts()
})

onUnmounted(() => {
  if (rafFps) cancelAnimationFrame(rafFps)
  stopBurst()
  stopInputThrash()
  stopPulse()
  forceCleanupLeaks()
})

watch(dialogVisible, () => {
  requestAnimationFrame(sampleDialogHosts)
})
</script>

<template>
  <div class="page vp-hf">
    <ExamplePageHero
      title-key="page.perf.highFrequency.title"
      lead-key="page.perf.highFrequency.lead"
    />

    <section class="vp-hf__metrics" aria-live="polite">
      <div class="vp-hf__metric">
        <span class="vp-hf__metric-label">{{ tDyn('page.perf.highFrequency.metricFps') }}</span>
        <strong>{{ fps }}</strong>
      </div>
      <div class="vp-hf__metric">
        <span class="vp-hf__metric-label">{{ tDyn('page.perf.highFrequency.metricMemory') }}</span>
        <strong>{{ memoryText }}</strong>
      </div>
      <div class="vp-hf__metric">
        <span class="vp-hf__metric-label">{{ tDyn('page.perf.highFrequency.metricCycles') }}</span>
        <strong>{{ dialogCycles }}</strong>
      </div>
      <div class="vp-hf__metric">
        <span class="vp-hf__metric-label">{{ tDyn('page.perf.highFrequency.metricHosts') }}</span>
        <strong>{{ dialogHosts }}</strong>
      </div>
    </section>

    <Card class="vp-hf__card" :header="tDyn('page.perf.highFrequency.checklistTitle')">
      <ul class="vp-hf__checklist">
        <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
      </ul>
      <Button
        size="sm"
        variant="text"
        :label="tDyn('page.perf.highFrequency.resetCounters')"
        @click="resetCounters"
      />
    </Card>

    <!-- 1. Dialog -->
    <Card class="vp-hf__card" :header="tDyn('page.perf.highFrequency.sectionDialog')">
      <p class="vp-hf__desc">{{ tDyn('page.perf.highFrequency.sectionDialogDesc') }}</p>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :disabled="bursting"
          :label="tDyn('page.perf.highFrequency.burstDialog', { n: 40 })"
          @click="burstDialogs(40)"
        />
        <Button
          size="sm"
          severity="primary"
          :disabled="bursting"
          :label="tDyn('page.perf.highFrequency.burstDialog', { n: 120 })"
          @click="burstDialogs(120)"
        />
        <Button
          v-if="bursting"
          size="sm"
          severity="danger"
          :label="tDyn('page.perf.highFrequency.stopBurst')"
          @click="stopBurst"
        />
        <Button size="sm" variant="outlined" :label="tDyn('page.perf.highFrequency.openOnce')" @click="openDialog" />
        <Button size="sm" variant="outlined" :label="tDyn('page.perf.highFrequency.closeOnce')" @click="closeDialog" />
      </Space>
      <Dialog
        :visible="dialogVisible"
        :title="tDyn('page.perf.highFrequency.dialogTitle', { n: dialogCycles + 1 })"
        @update:visible="onDialogVisible"
      >
        <p>{{ tDyn('page.perf.highFrequency.dialogBody') }}</p>
      </Dialog>
    </Card>

    <!-- 2. Input thrash -->
    <Card class="vp-hf__card" :header="tDyn('page.perf.highFrequency.sectionInput')">
      <p class="vp-hf__desc">{{ tDyn('page.perf.highFrequency.sectionInputDesc') }}</p>
      <div class="vp-hf__inline-metrics">
        <Tag size="sm" :label="`${tDyn('page.perf.highFrequency.metricUpdates')}: ${inputUpdates}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.highFrequency.metricChars')}: ${inputValue.length}`" />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :disabled="inputThrashing"
          :label="tDyn('page.perf.highFrequency.startInput')"
          @click="startInputThrash"
        />
        <Button
          size="sm"
          :disabled="!inputThrashing"
          :label="tDyn('page.perf.highFrequency.stopInput')"
          @click="stopInputThrash"
        />
        <Button size="sm" variant="text" :label="tDyn('page.perf.highFrequency.clearInput')" @click="clearInput" />
      </Space>
      <div class="vp-hf__input">
        <InputProbe v-model="inputValue" />
      </div>
    </Card>

    <!-- 3. scroll / resize -->
    <Card class="vp-hf__card" :header="tDyn('page.perf.highFrequency.sectionScroll')">
      <p class="vp-hf__desc">{{ tDyn('page.perf.highFrequency.sectionScrollDesc') }}</p>
      <div class="vp-hf__inline-metrics">
        <Tag
          size="sm"
          :severity="leakMode ? 'danger' : 'info'"
          :label="`${tDyn('page.perf.highFrequency.metricListeners')}: ${activeListeners}`"
        />
        <Tag size="sm" :label="`${tDyn('page.perf.highFrequency.metricScrollEvents')}: ${scrollEvents}`" />
        <Tag size="sm" :label="`${tDyn('page.perf.highFrequency.metricResizeEvents')}: ${resizeEvents}`" />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="primary"
          :label="tDyn('page.perf.highFrequency.attachClean')"
          @click="attachListeners(false)"
        />
        <Button
          size="sm"
          severity="warning"
          :label="tDyn('page.perf.highFrequency.attachLeak')"
          @click="attachListeners(true)"
        />
        <Button size="sm" :label="tDyn('page.perf.highFrequency.detach')" @click="forceCleanupLeaks" />
      </Space>
      <p class="vp-hf__hint">{{ tDyn('page.perf.highFrequency.scrollHint') }}</p>
      <div ref="scrollPane" class="vp-hf__scroll" tabindex="0">
        <div class="vp-hf__scroll-inner">
          <p v-for="i in 40" :key="i">{{ t(LocaleKeys.common.more) }} · {{ i }}</p>
        </div>
      </div>
    </Card>

    <!-- 4. re-render -->
    <Card class="vp-hf__card" :header="tDyn('page.perf.highFrequency.sectionRender')">
      <p class="vp-hf__desc">{{ tDyn('page.perf.highFrequency.sectionRenderDesc') }}</p>
      <div class="vp-hf__inline-metrics">
        <Tag size="sm" severity="danger" :label="`${tDyn('page.perf.highFrequency.metricBadRenders')}: ${badRenders}`" />
        <Tag size="sm" severity="success" :label="`${tDyn('page.perf.highFrequency.metricGoodRenders')}: ${goodRenders}`" />
      </div>
      <Space wrap>
        <Button
          size="sm"
          severity="danger"
          :disabled="pulsing === 'bad'"
          :label="tDyn('page.perf.highFrequency.startBad')"
          @click="startBadPulse"
        />
        <Button
          size="sm"
          severity="success"
          :disabled="pulsing === 'good'"
          :label="tDyn('page.perf.highFrequency.startGood')"
          @click="startGoodPulse"
        />
        <Button
          size="sm"
          :disabled="!pulsing"
          :label="tDyn('page.perf.highFrequency.stopPulse')"
          @click="stopPulse"
        />
      </Space>
      <div class="vp-hf__probes" :data-pulse-frame="parentPulseFrame">
        <BadProbe :payload="badPayload" />
        <GoodProbe :payload="goodPayload" />
      </div>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.vp-hf {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-hf__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-2xl) * 4), 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.vp-hf__metric {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--theme-card-pad);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  box-shadow: var(--shadow-sm);

  strong {
    font-size: var(--font-size-lg);
    color: var(--text-primary);
  }
}

.vp-hf__metric-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-hf__card {
  width: 100%;
}

.vp-hf__desc,
.vp-hf__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-hf__checklist {
  margin: 0 0 var(--spacing-md);
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-hf__inline-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-hf__input {
  margin-top: var(--spacing-md);
  max-width: 32rem;
}

.vp-hf__scroll {
  margin-top: var(--spacing-sm);
  height: calc(var(--spacing-2xl) * 6);
  overflow: auto;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
}

.vp-hf__scroll-inner {
  padding: var(--spacing-md);
  min-height: calc(var(--spacing-2xl) * 20);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.vp-hf__probes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.vp-hf__probe {
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}
</style>
