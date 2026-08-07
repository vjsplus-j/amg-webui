<script setup lang="ts">
/**
 * Lab · Interaction Observation (Vp Telemetry)
 * Spec: docs/TELEMETRY.md — default off · trackEmit side-path · buffer/sink · analyze
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Button, Card, CopyText, Space, Tag, TelemetryProvider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import {
  TelemetryService,
  consoleSink,
  trackEmit,
  summarizeHabits,
  findAlerts,
  findErrors,
  type VpTelemetryCategory,
  type VpTelemetryEvent
} from '@amg-webui/telemetry'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t, tDyn, locale } = useLocale()

const enabled = ref(false)
const includePayload = ref(false)
const filter = ref<VpTelemetryCategory | 'all'>('all')
const events = ref<VpTelemetryEvent[]>([])
const selectedId = ref<string | null>(null)
let unsub: (() => void) | undefined

const providerConfig = computed(() => ({
  includePayload: includePayload.value,
  appId: 'example-lab-telemetry',
  sinks: enabled.value ? [consoleSink({ level: 'debug' })] : [],
  getRoute: () => (typeof location !== 'undefined' ? location.pathname : undefined),
  getLocale: () =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-locale') || undefined
      : undefined,
  getDesign: () =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-design') || undefined
      : undefined
}))

function refreshBuffer() {
  events.value = TelemetryService.getBuffer().slice().reverse()
  if (selectedId.value && !events.value.some((e) => e.id === selectedId.value)) {
    selectedId.value = events.value[0]?.id ?? null
  }
}

onMounted(() => {
  refreshBuffer()
  unsub = TelemetryService.subscribe(() => refreshBuffer())
})

onUnmounted(() => {
  unsub?.()
})

watch(enabled, () => {
  // Provider syncs Service; refresh after toggle
  requestAnimationFrame(refreshBuffer)
})

const filtered = computed(() => {
  if (filter.value === 'all') return events.value
  return events.value.filter((e) => e.category === filter.value)
})

const selected = computed(() => events.value.find((e) => e.id === selectedId.value) ?? null)

const habits = computed(() => {
  void events.value
  void locale.value
  return summarizeHabits(TelemetryService.getBuffer())
})

const alerts = computed(() => {
  void events.value
  return findAlerts(TelemetryService.getBuffer())
})

const errors = computed(() => {
  void events.value
  return findErrors(TelemetryService.getBuffer())
})

const checklist = computed(() => {
  void locale.value
  return [
    tDyn('page.lab.telemetry.c1'),
    tDyn('page.lab.telemetry.c2'),
    tDyn('page.lab.telemetry.c3'),
    tDyn('page.lab.telemetry.c4')
  ]
})

const categories: (VpTelemetryCategory | 'all')[] = [
  'all',
  'interaction',
  'alert',
  'error',
  'lifecycle',
  'habit'
]

function clearAll() {
  TelemetryService.clear()
  selectedId.value = null
  refreshBuffer()
}

function exportJson() {
  const blob = new Blob([JSON.stringify(TelemetryService.getBuffer(), null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vp-telemetry-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function injectAlert() {
  trackEmit({
    component: 'TelemetryLab',
    type: 'permissionDenied',
    trackId: 'lab.telemetry.inject.alert',
    category: 'alert',
    name: 'lab-inject-alert'
  })
}

function injectError() {
  trackEmit({
    component: 'TelemetryLab',
    type: 'loadError',
    trackId: 'lab.telemetry.inject.error',
    category: 'error',
    name: 'lab-inject-error',
    payload: includePayload.value ? { reason: 'simulated' } : undefined
  })
}

function burstClicks() {
  // Programmatic trackEmit burst to demonstrate rapidClick analysis without relying on pointer spam.
  for (let i = 0; i < 4; i += 1) {
    trackEmit({
      component: 'Button',
      type: 'click',
      trackId: 'lab.telemetry.demo.burst',
      name: 'burst'
    })
  }
}

function selectEvent(ev: VpTelemetryEvent) {
  selectedId.value = ev.id
}

function filterLabel(cat: VpTelemetryCategory | 'all') {
  if (cat === 'all') return tDyn('page.lab.telemetry.filterAll')
  return cat
}
</script>

<template>
  <TelemetryProvider
    :enabled="enabled"
    :config="providerConfig"
    :restore-on-unmount="true"
    :track-lifecycle="true"
  >
    <div class="page vp-tel-lab">
      <ExamplePageHero title-key="page.lab.telemetry.title" lead-key="page.lab.telemetry.lead" />

      <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.whatTitle')">
        <p class="vp-tel-lab__body">{{ tDyn('page.lab.telemetry.whatBody') }}</p>
        <p class="vp-tel-lab__hint">{{ t('page.lab.telemetry.hint') }}</p>
        <ul class="vp-tel-lab__checklist">
          <li v-for="(item, i) in checklist" :key="i">{{ item }}</li>
        </ul>
      </Card>

      <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.pipelineTitle')">
        <ol class="vp-tel-lab__pipeline">
          <li>{{ tDyn('page.lab.telemetry.pipelineStep1') }}</li>
          <li>{{ tDyn('page.lab.telemetry.pipelineStep2') }}</li>
          <li>{{ tDyn('page.lab.telemetry.pipelineStep3') }}</li>
          <li>{{ tDyn('page.lab.telemetry.pipelineStep4') }}</li>
        </ol>
      </Card>

      <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.controlsTitle')">
        <p class="vp-tel-lab__status" :data-on="enabled ? '1' : '0'">
          {{ enabled ? tDyn('page.lab.telemetry.statusOn') : tDyn('page.lab.telemetry.statusOff') }}
        </p>
        <div class="vp-tel-lab__metrics">
          <Tag size="sm" :label="`${tDyn('page.lab.telemetry.metricBuffer')}: ${events.length}`" />
          <Tag size="sm" :label="`${tDyn('page.lab.telemetry.metricHabits')}: ${habits.length}`" />
          <Tag size="sm" severity="warning" :label="`${tDyn('page.lab.telemetry.metricAlerts')}: ${alerts.length}`" />
          <Tag size="sm" severity="danger" :label="`${tDyn('page.lab.telemetry.metricErrors')}: ${errors.length}`" />
        </div>
        <Space wrap>
          <Button
            size="sm"
            :severity="enabled ? 'warning' : 'primary'"
            :label="enabled ? tDyn('page.lab.telemetry.disable') : tDyn('page.lab.telemetry.enable')"
            track-id="lab.telemetry.toggle"
            @click="enabled = !enabled"
          />
          <Button
            size="sm"
            :variant="includePayload ? 'solid' : 'outlined'"
            :label="
              includePayload
                ? tDyn('page.lab.telemetry.payloadFull')
                : tDyn('page.lab.telemetry.payloadMeta')
            "
            track-id="lab.telemetry.payload"
            @click="includePayload = !includePayload"
          />
          <Button
            size="sm"
            variant="outlined"
            :label="tDyn('page.lab.telemetry.clear')"
            track-id="lab.telemetry.clear"
            @click="clearAll"
          />
          <Button
            size="sm"
            variant="outlined"
            :label="tDyn('page.lab.telemetry.export')"
            track-id="lab.telemetry.export"
            @click="exportJson"
          />
        </Space>
      </Card>

      <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.playgroundTitle')">
        <p class="vp-tel-lab__desc">{{ tDyn('page.lab.telemetry.playgroundDesc') }}</p>
        <Space wrap>
          <Button
            size="sm"
            severity="primary"
            :label="tDyn('page.lab.telemetry.actionTracked')"
            track-id="lab.telemetry.demo.click"
          />
          <Button
            size="sm"
            variant="outlined"
            :label="tDyn('page.lab.telemetry.actionOptOut')"
            track-id="lab.telemetry.demo.optout"
            :telemetry="false"
          />
          <CopyText
            :text="tDyn('page.lab.telemetry.copyText')"
            track-id="lab.telemetry.demo.copy"
          />
          <Button
            size="sm"
            severity="secondary"
            :label="tDyn('page.lab.telemetry.actionBurst')"
            track-id="lab.telemetry.demo.burst"
            @click="burstClicks"
          />
          <Button
            size="sm"
            severity="warning"
            :label="tDyn('page.lab.telemetry.actionAlert')"
            track-id="lab.telemetry.inject.alert.btn"
            @click="injectAlert"
          />
          <Button
            size="sm"
            severity="danger"
            :label="tDyn('page.lab.telemetry.actionError')"
            track-id="lab.telemetry.inject.error.btn"
            @click="injectError"
          />
        </Space>
      </Card>

      <div class="vp-tel-lab__split">
        <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.streamTitle')">
          <div class="vp-tel-lab__filters">
            <Button
              v-for="cat in categories"
              :key="cat"
              size="sm"
              :variant="filter === cat ? 'solid' : 'outlined'"
              :label="filterLabel(cat)"
              :track-id="`lab.telemetry.filter.${cat}`"
              @click="filter = cat"
            />
          </div>
          <div class="vp-tel-lab__stream" role="log">
            <p v-if="!filtered.length" class="vp-tel-lab__empty">{{ tDyn('page.lab.telemetry.empty') }}</p>
            <button
              v-for="ev in filtered.slice(0, 100)"
              :key="ev.id"
              type="button"
              class="vp-tel-lab__event"
              :data-active="selectedId === ev.id ? '1' : '0'"
              @click="selectEvent(ev)"
            >
              <Tag :label="ev.category" size="sm" effect="light" />
              <code>{{ ev.component }}.{{ ev.type }}</code>
              <span v-if="ev.trackId" class="vp-tel-lab__track">{{ ev.trackId }}</span>
              <time>{{ new Date(ev.ts).toLocaleTimeString() }}</time>
            </button>
          </div>
        </Card>

        <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.inspectorTitle')">
          <p v-if="!selected" class="vp-tel-lab__empty">{{ tDyn('page.lab.telemetry.inspectorEmpty') }}</p>
          <pre v-else class="vp-tel-lab__json">{{ JSON.stringify(selected, null, 2) }}</pre>
        </Card>
      </div>

      <Card class="vp-tel-lab__card" :header="tDyn('page.lab.telemetry.analysisTitle')">
        <section class="vp-tel-lab__analysis">
          <h3>{{ tDyn('page.lab.telemetry.habitsTitle') }}</h3>
          <p class="vp-tel-lab__desc">{{ tDyn('page.lab.telemetry.habitsDesc') }}</p>
          <ul v-if="habits.length" class="vp-tel-lab__list">
            <li v-for="h in habits.slice(0, 16)" :key="h.key">
              <code>{{ h.key }}</code>
              <span>×{{ h.count }}</span>
            </li>
          </ul>
          <p v-else class="vp-tel-lab__empty">{{ tDyn('page.lab.telemetry.empty') }}</p>
        </section>

        <section class="vp-tel-lab__analysis">
          <h3>{{ tDyn('page.lab.telemetry.alertsTitle') }}</h3>
          <p class="vp-tel-lab__desc">{{ tDyn('page.lab.telemetry.alertsDesc') }}</p>
          <ul v-if="alerts.length" class="vp-tel-lab__list">
            <li v-for="(a, i) in alerts.slice(0, 12)" :key="`a-${i}`">
              <Tag :label="a.kind" size="sm" severity="warning" effect="light" />
              <span>{{ a.message }}</span>
            </li>
          </ul>
          <p v-else class="vp-tel-lab__empty">{{ tDyn('page.lab.telemetry.empty') }}</p>
        </section>

        <section class="vp-tel-lab__analysis">
          <h3>{{ tDyn('page.lab.telemetry.errorsTitle') }}</h3>
          <p class="vp-tel-lab__desc">{{ tDyn('page.lab.telemetry.errorsDesc') }}</p>
          <ul v-if="errors.length" class="vp-tel-lab__list">
            <li v-for="e in errors.slice(0, 12)" :key="e.id">
              <Tag label="error" size="sm" severity="danger" effect="light" />
              <code>{{ e.component }}.{{ e.type }}</code>
              <span v-if="e.trackId">{{ e.trackId }}</span>
            </li>
          </ul>
          <p v-else class="vp-tel-lab__empty">{{ tDyn('page.lab.telemetry.empty') }}</p>
        </section>
      </Card>
    </div>
  </TelemetryProvider>
</template>

<style scoped lang="scss">
.vp-tel-lab {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-tel-lab__card {
  width: 100%;
}

.vp-tel-lab__body,
.vp-tel-lab__desc,
.vp-tel-lab__hint {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-tel-lab__checklist {
  margin: 0;
  padding-inline-start: var(--spacing-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}

.vp-tel-lab__pipeline {
  margin: 0;
  padding-inline-start: var(--spacing-xl);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.vp-tel-lab__status {
  margin: 0 0 var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--theme-radius-md);
  border: 1px solid var(--ds-border);
  background: var(--surface-1);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);

  &[data-on='1'] {
    border-color: var(--primary-500);
    color: var(--text-primary);
  }
}

.vp-tel-lab__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-tel-lab__split {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
}

.vp-tel-lab__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.vp-tel-lab__stream {
  max-height: 22rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--spacing-sm);
  background: var(--surface-1);
}

.vp-tel-lab__event {
  appearance: none;
  width: 100%;
  text-align: start;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--theme-radius-md);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;

  &[data-active='1'] {
    border-color: var(--primary-500);
    background: var(--surface-0);
  }

  code {
    color: var(--text-primary);
    font-size: var(--font-size-xs);
  }

  time {
    margin-inline-start: auto;
    font-size: var(--font-size-xs);
    color: var(--text-tertiary);
  }
}

.vp-tel-lab__track {
  font-size: var(--font-size-xs);
  color: var(--ds-accent);
}

.vp-tel-lab__json {
  margin: 0;
  max-height: 22rem;
  overflow: auto;
  padding: var(--spacing-md);
  border-radius: var(--theme-radius-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border);
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-body);
  white-space: pre-wrap;
  word-break: break-word;
}

.vp-tel-lab__analysis {
  & + & {
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--ds-border);
  }

  h3 {
    margin: 0 0 var(--spacing-xs);
    font-size: var(--font-size-md);
    color: var(--text-primary);
  }
}

.vp-tel-lab__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-sm);
  }

  code {
    font-size: var(--font-size-xs);
    color: var(--text-primary);
  }
}

.vp-tel-lab__empty {
  margin: 0;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}
</style>
