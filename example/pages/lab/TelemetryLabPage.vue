<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Button, Card, CopyText, Tag, TelemetryProvider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import {
  TelemetryService,
  consoleSink,
  summarizeHabits,
  findAlerts,
  findErrors,
  type VpTelemetryCategory,
  type VpTelemetryEvent
} from '@amg-webui/telemetry'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const enabled = ref(false)
const includePayload = ref(false)
const filter = ref<VpTelemetryCategory | 'all'>('all')
const events = ref<VpTelemetryEvent[]>([])
let unsub: (() => void) | undefined

function refreshBuffer() {
  events.value = TelemetryService.getBuffer().slice().reverse()
}

function applyConfig() {
  TelemetryService.configure({
    enabled: enabled.value,
    includePayload: includePayload.value,
    appId: 'example-lab',
    sinks: enabled.value ? [consoleSink({ level: 'debug' })] : [],
    getRoute: () =>
      typeof location !== 'undefined' ? location.pathname : undefined,
    getLocale: () =>
      typeof document !== 'undefined'
        ? document.documentElement.getAttribute('data-locale') || undefined
        : undefined
  })
  if (enabled.value) TelemetryService.enable()
  else TelemetryService.disable()
}

watch([enabled, includePayload], () => {
  applyConfig()
})

onMounted(() => {
  applyConfig()
  refreshBuffer()
  unsub = TelemetryService.subscribe(() => {
    refreshBuffer()
  })
})

onUnmounted(() => {
  unsub?.()
  TelemetryService.disable()
  TelemetryService.clear()
})

const filtered = computed(() => {
  if (filter.value === 'all') return events.value
  return events.value.filter((e) => e.category === filter.value)
})

const habits = computed(() => summarizeHabits(TelemetryService.getBuffer()))
const alerts = computed(() => findAlerts(TelemetryService.getBuffer()))
const errors = computed(() => findErrors(TelemetryService.getBuffer()))

function clearAll() {
  TelemetryService.clear()
  refreshBuffer()
}

function exportJson() {
  const blob = new Blob(
    [JSON.stringify(TelemetryService.getBuffer(), null, 2)],
    { type: 'application/json' }
  )
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vp-telemetry-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const categories: (VpTelemetryCategory | 'all')[] = [
  'all',
  'interaction',
  'alert',
  'error',
  'habit',
  'lifecycle'
]
</script>

<template>
  <TelemetryProvider :enabled="enabled" :config="{ includePayload, appId: 'example-lab' }">
    <div class="vp-telemetry-lab">
      <ExamplePageHero
        title-key="page.lab.telemetry.title"
        lead-key="page.lab.telemetry.lead"
      />

      <Card :header="t('page.lab.telemetry.controls')">
        <div class="vp-toolbar">
          <Button
            :label="enabled ? t('page.lab.telemetry.enabled') : t('page.lab.telemetry.disabled')"
            :severity="enabled ? 'warning' : 'primary'"
            track-id="lab.telemetry.toggle"
            @click="enabled = !enabled"
          />
          <Button
            :label="includePayload ? t('page.lab.telemetry.payloadOn') : t('page.lab.telemetry.payloadOff')"
            :variant="includePayload ? 'solid' : 'outlined'"
            track-id="lab.telemetry.payload"
            @click="includePayload = !includePayload"
          />
          <Button
            :label="t('page.lab.telemetry.clear')"
            variant="outlined"
            track-id="lab.telemetry.clear"
            @click="clearAll"
          />
          <Button
            :label="t('page.lab.telemetry.export')"
            variant="outlined"
            track-id="lab.telemetry.export"
            @click="exportJson"
          />
          <Tag :label="String(events.length)" severity="info" effect="light" />
        </div>
        <p class="vp-telemetry-lab__hint">{{ t('page.lab.telemetry.hint') }}</p>
      </Card>

      <div class="vp-telemetry-lab__grid">
        <Card :header="t('page.lab.telemetry.hint')">
          <div class="vp-toolbar">
            <Button
              :label="t('page.lab.telemetry.sampleClick')"
              track-id="lab.telemetry.demo.click"
              severity="primary"
            />
            <Button
              :label="t('page.lab.telemetry.sampleDisabled')"
              track-id="lab.telemetry.demo.disabled"
              disabled
            />
            <CopyText text="AMG-WebUI" track-id="lab.telemetry.demo.copy" />
          </div>
        </Card>

        <Card :header="t('page.lab.telemetry.analysis')">
          <h3 class="vp-telemetry-lab__sub">{{ t('page.lab.telemetry.habits') }}</h3>
          <ul v-if="habits.length" class="vp-telemetry-lab__list">
            <li v-for="h in habits.slice(0, 12)" :key="h.key">
              <code>{{ h.key }}</code>
              <span>×{{ h.count }}</span>
            </li>
          </ul>
          <p v-else class="vp-telemetry-lab__empty">{{ t('page.lab.telemetry.empty') }}</p>

          <h3 class="vp-telemetry-lab__sub">{{ t('page.lab.telemetry.alerts') }}</h3>
          <ul v-if="alerts.length" class="vp-telemetry-lab__list">
            <li v-for="(a, i) in alerts.slice(0, 8)" :key="`a-${i}`">
              <Tag :label="a.kind" size="sm" severity="warning" effect="light" />
              <span>{{ a.message }}</span>
            </li>
          </ul>
          <p v-else class="vp-telemetry-lab__empty">{{ t('page.lab.telemetry.empty') }}</p>

          <h3 class="vp-telemetry-lab__sub">{{ t('page.lab.telemetry.errors') }}</h3>
          <ul v-if="errors.length" class="vp-telemetry-lab__list">
            <li v-for="e in errors.slice(0, 8)" :key="e.id">
              <Tag label="error" size="sm" severity="danger" effect="light" />
              <span>{{ e.component }}.{{ e.type }}</span>
            </li>
          </ul>
          <p v-else class="vp-telemetry-lab__empty">{{ t('page.lab.telemetry.empty') }}</p>
        </Card>
      </div>

      <Card :header="t('page.lab.telemetry.stream')">
        <div class="vp-toolbar vp-telemetry-lab__filters">
          <Button
            v-for="cat in categories"
            :key="cat"
            :label="cat === 'all' ? t('page.lab.telemetry.analysis') : cat"
            size="sm"
            :variant="filter === cat ? 'solid' : 'outlined'"
            :track-id="`lab.telemetry.filter.${cat}`"
            @click="filter = cat"
          />
        </div>
        <div class="vp-telemetry-lab__stream" role="log">
          <p v-if="!filtered.length" class="vp-telemetry-lab__empty">
            {{ t('page.lab.telemetry.empty') }}
          </p>
          <article
            v-for="ev in filtered.slice(0, 80)"
            :key="ev.id"
            class="vp-telemetry-lab__event"
          >
            <Tag :label="ev.category" size="sm" effect="light" />
            <code>{{ ev.component }}.{{ ev.type }}</code>
            <span v-if="ev.trackId" class="vp-telemetry-lab__track">{{ ev.trackId }}</span>
            <time>{{ new Date(ev.ts).toLocaleTimeString() }}</time>
          </article>
        </div>
      </Card>
    </div>
  </TelemetryProvider>
</template>

<style scoped lang="scss">
.vp-telemetry-lab {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
  padding: var(--theme-page-pad);
}

.vp-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-md);
}

.vp-telemetry-lab__hint {
  margin: var(--spacing-md) 0 0;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.vp-telemetry-lab__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: var(--theme-section-gap);
}

.vp-telemetry-lab__sub {
  margin: var(--spacing-md) 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
}

.vp-telemetry-lab__list {
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

.vp-telemetry-lab__empty {
  margin: 0;
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
}

.vp-telemetry-lab__filters {
  margin-bottom: var(--spacing-md);
}

.vp-telemetry-lab__stream {
  max-height: 24rem;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  padding: var(--theme-card-pad);
  background: var(--surface-1);
}

.vp-telemetry-lab__event {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

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

.vp-telemetry-lab__track {
  font-size: var(--font-size-xs);
  color: var(--ds-accent);
}
</style>
