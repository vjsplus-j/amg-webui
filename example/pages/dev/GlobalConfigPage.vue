<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  Alert, Button, Card, ConfigProvider, InputNumber, InputText,
  Select, Switch, Tag, Textarea
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LOCALE_CODES, LOCALE_META, LocaleKeys, type LocaleCode } from '@amg-webui/locale'
import { designStyles, type DesignStyleName } from '@amg-webui/theme'
import type { Size } from '@amg-webui/types'
import type { ConfigProviderDensity, ConfigProviderDirection } from '@amg-webui/components/base/ConfigProvider'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

type Severity = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
type Guard = 'none' | 'debounce' | 'throttle'
type Effect = 'solid' | 'outlined' | 'light' | 'neon'

interface RuntimeConfig {
  size: Size
  density: ConfigProviderDensity
  direction: ConfigProviderDirection
  zIndex: number
  namespace: string
  theme: DesignStyleName
  locale: LocaleCode
  validateMessages: Record<'required' | 'minLength' | 'pattern', string>
  componentDefaults: { Dialog: { closeOnEsc: boolean; closeOnOverlay: boolean } }
  button: { severity: Severity; clickGuard: Guard; wait: number; ripple: boolean }
  tag: { severity: Severity; effect: Effect; wait: number }
}

interface LogEntry { id: number; at: string; actionKey: string; paths: string[] }
interface Notice { severity: 'success' | 'warning' | 'error'; key: string; params?: Record<string, string | number> }

const STORE_KEY = 'amg-webui:dev-global-config:v1'
const SIZES: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']
const DENSITIES: ConfigProviderDensity[] = ['compact', 'comfortable', 'spacious']
const DIRECTIONS: ConfigProviderDirection[] = ['ltr', 'rtl']
const SEVERITIES: Severity[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info']
const GUARDS: Guard[] = ['none', 'debounce', 'throttle']
const EFFECTS: Effect[] = ['solid', 'outlined', 'light', 'neon']
const { t, locale: uiLocale } = useLocale()

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T }
function defaults(): RuntimeConfig {
  return {
    size: 'md', density: 'comfortable', direction: 'ltr', zIndex: 2000,
    namespace: 'vp', theme: designStyles[0]?.name ?? 'mercedes', locale: uiLocale.value,
    validateMessages: {
      required: t(LocaleKeys.error.required),
      minLength: t(LocaleKeys.error.minLength, { min: 3 }),
      pattern: t(LocaleKeys.error.pattern)
    },
    componentDefaults: { Dialog: { closeOnEsc: true, closeOnOverlay: false } },
    button: { severity: 'primary', clickGuard: 'none', wait: 300, ripple: true },
    tag: { severity: 'info', effect: 'light', wait: 300 }
  }
}

const draft = reactive<RuntimeConfig>(defaults())
const applied = ref<RuntimeConfig>(clone(draft))
const jsonSource = ref('')
const jsonEditing = ref(false)
const configFileInput = ref<HTMLInputElement | null>(null)
const logs = ref<LogEntry[]>([])
const notice = ref<Notice | null>(null)
let logId = 0

const option = <T extends string>(values: T[]) => values.map((value) => ({ value, label: value }))
const sizeOptions = SIZES.map((value) => ({ value, label: value.toUpperCase() }))
const densityOptions = option(DENSITIES)
const directionOptions = DIRECTIONS.map((value) => ({ value, label: value.toUpperCase() }))
const severityOptions = option(SEVERITIES)
const guardOptions = option(GUARDS)
const effectOptions = option(EFFECTS)
const themeOptions = designStyles.map(({ name, label }) => ({ value: name, label }))
const localeOptions = LOCALE_CODES.map((value) => ({ value, label: LOCALE_META[value].label }))
const draftJson = computed(() => JSON.stringify(draft, null, 2))
const dirty = computed(() => draftJson.value !== JSON.stringify(applied.value, null, 2))
const noticeText = computed(() => notice.value ? t(notice.value.key, notice.value.params) : '')

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'string')
}
function check(value: unknown): { config?: RuntimeConfig; path?: string } {
  if (!isRecord(value)) return { path: '$' }
  const button = value.button
  const tag = value.tag
  const componentDefaults = value.componentDefaults
  if (!SIZES.includes(value.size as Size)) return { path: 'size' }
  if (!DENSITIES.includes(value.density as ConfigProviderDensity)) return { path: 'density' }
  if (!DIRECTIONS.includes(value.direction as ConfigProviderDirection)) return { path: 'direction' }
  if (!Number.isInteger(value.zIndex) || Number(value.zIndex) < 0) return { path: 'zIndex' }
  if (typeof value.namespace !== 'string' || !/^[a-z][a-z0-9-]*$/.test(value.namespace)) return { path: 'namespace' }
  if (!designStyles.some(({ name }) => name === value.theme)) return { path: 'theme' }
  if (!LOCALE_CODES.includes(value.locale as LocaleCode)) return { path: 'locale' }
  if (!isStringRecord(value.validateMessages)) return { path: 'validateMessages' }
  if (typeof value.validateMessages.required !== 'string' || typeof value.validateMessages.minLength !== 'string' || typeof value.validateMessages.pattern !== 'string') return { path: 'validateMessages' }
  if (!isRecord(componentDefaults) || !isRecord(componentDefaults.Dialog)) return { path: 'componentDefaults' }
  if (typeof componentDefaults.Dialog.closeOnEsc !== 'boolean' || typeof componentDefaults.Dialog.closeOnOverlay !== 'boolean') return { path: 'componentDefaults.Dialog' }
  if (!isRecord(button) || !SEVERITIES.includes(button.severity as Severity)) return { path: 'button.severity' }
  if (!GUARDS.includes(button.clickGuard as Guard) || !Number.isInteger(button.wait) || Number(button.wait) < 0) return { path: 'button' }
  if (typeof button.ripple !== 'boolean') return { path: 'button.ripple' }
  if (!isRecord(tag) || !SEVERITIES.includes(tag.severity as Severity)) return { path: 'tag.severity' }
  if (!EFFECTS.includes(tag.effect as Effect) || !Number.isInteger(tag.wait) || Number(tag.wait) < 0) return { path: 'tag' }
  return { config: clone(value) as unknown as RuntimeConfig }
}
function parse(source: string) {
  try {
    const raw = JSON.parse(source) as unknown
    return check(isRecord(raw) && 'config' in raw ? raw.config : raw)
  } catch { return {} }
}
function paths(before: RuntimeConfig, after: RuntimeConfig) {
  return Object.keys(before).filter((key) => JSON.stringify(before[key as keyof RuntimeConfig]) !== JSON.stringify(after[key as keyof RuntimeConfig]))
}
function addLog(actionKey: string, changed: string[]) {
  logs.value.unshift({ id: ++logId, at: new Date().toISOString(), actionKey, paths: changed })
  logs.value = logs.value.slice(0, 12)
}
function done(actionKey: string) {
  notice.value = { severity: 'success', key: 'page.dev.config.status.completed', params: { action: t(actionKey) } }
}
function invalid(path?: string) {
  notice.value = path
    ? { severity: 'error', key: 'page.dev.config.json.invalidAt', params: { path } }
    : { severity: 'error', key: 'page.dev.config.json.invalid' }
}
function saveLocal() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ config: applied.value, logs: logs.value })) }
  catch { notice.value = { severity: 'error', key: LocaleKeys.error.generic } }
}
function applyDraft() {
  const result = check(clone(draft))
  if (!result.config) return invalid(result.path)
  const changed = paths(applied.value, result.config)
  applied.value = clone(result.config)
  addLog('page.dev.config.action.apply', changed)
  saveLocal()
  done('page.dev.config.action.apply')
}
function discardDraft() {
  Object.assign(draft, clone(applied.value))
  jsonEditing.value = false
  jsonSource.value = JSON.stringify(applied.value, null, 2)
  done(LocaleKeys.button.cancel)
}
function resetDraft() {
  const next = defaults()
  addLog(LocaleKeys.button.reset, paths(clone(draft), next))
  Object.assign(draft, clone(next))
  jsonEditing.value = false
  jsonSource.value = JSON.stringify(next, null, 2)
  done(LocaleKeys.button.reset)
}
function validateJson() {
  const result = parse(jsonSource.value)
  result.config ? done('page.dev.config.action.validate') : invalid(result.path)
}
function importJson() {
  const result = parse(jsonSource.value)
  if (!result.config) return invalid(result.path)
  addLog('page.dev.config.action.import', paths(clone(draft), result.config))
  Object.assign(draft, clone(result.config))
  jsonEditing.value = false
  done('page.dev.config.action.import')
}
function exportJson() {
  const payload = JSON.stringify({ schemaVersion: 1, exportedAt: new Date().toISOString(), config: applied.value }, null, 2)
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `vp-global-config-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  done(LocaleKeys.common.export)
}
async function copyJson() {
  try {
    await navigator.clipboard.writeText(jsonSource.value)
    done(LocaleKeys.common.copy)
  } catch {
    notice.value = { severity: 'error', key: LocaleKeys.error.generic }
  }
}
async function importJsonFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    jsonSource.value = await file.text()
    jsonEditing.value = true
    importJson()
  } catch {
    notice.value = { severity: 'error', key: LocaleKeys.error.validation }
  } finally {
    input.value = ''
  }
}
function formatTime(value: string) {
  return new Intl.DateTimeFormat(uiLocale.value, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value))
}

watch(draft, () => { if (!jsonEditing.value) jsonSource.value = draftJson.value }, { deep: true, immediate: true })
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const stored = JSON.parse(raw) as unknown
      if (isRecord(stored)) {
        const result = check(stored.config)
        if (result.config) {
          applied.value = clone(result.config)
          Object.assign(draft, clone(result.config))
          if (Array.isArray(stored.logs)) logs.value = (stored.logs as LogEntry[]).slice(0, 12)
        }
      }
    }
  } catch { notice.value = { severity: 'warning', key: 'page.dev.config.json.invalid' } }
  if (!logs.value.length) addLog('page.dev.config.history.initial', Object.keys(applied.value))
  logId = Math.max(logId, ...logs.value.map(({ id }) => id))
})
</script>

<template>
  <div class="config-page" data-testid="global-config-workbench">
    <ExamplePageHero title-key="page.dev.config.title" lead-key="page.dev.config.lead" eyebrow-key="nav.dev">
      <template #title-extra>
        <Tag :label="t(dirty ? 'page.dev.config.state.draft' : 'page.dev.config.state.applied')" :severity="dirty ? 'warning' : 'success'" />
      </template>
      <template #actions>
        <Button :label="t('page.dev.config.action.apply')" :disabled="!dirty" data-testid="apply-config" @click="applyDraft" />
        <Button :label="t(LocaleKeys.button.cancel)" variant="outlined" :disabled="!dirty" @click="discardDraft" />
        <Button :label="t(LocaleKeys.button.reset)" variant="text" @click="resetDraft" />
      </template>
    </ExamplePageHero>

    <Alert v-if="notice" :severity="notice.severity" :title="notice.severity === 'success' ? t(LocaleKeys.common.success) : t(LocaleKeys.error.validation)" :description="noticeText" @close="notice = null" />

    <div class="config-grid">
      <Card :header="t('page.dev.config.c1')">
        <div class="field-grid">
          <label><code>size</code><Select v-model="draft.size" :options="sizeOptions" fluid /></label>
          <label><code>density</code><Select v-model="draft.density" :options="densityOptions" fluid /></label>
          <label><code>direction</code><Select v-model="draft.direction" :options="directionOptions" fluid /></label>
          <label><code>zIndex</code><InputNumber v-model="draft.zIndex" :min="0" :step="100" fluid /></label>
          <label><code>namespace</code><InputText v-model="draft.namespace" fluid /></label>
          <label><code>theme</code><Select v-model="draft.theme" :options="themeOptions" fluid /></label>
          <label><code>locale</code><Select v-model="draft.locale" :options="localeOptions" fluid /></label>
        </div>
      </Card>

      <Card :header="t('page.dev.config.c2')">
        <div class="field-grid">
          <label><code>button.severity</code><Select v-model="draft.button.severity" :options="severityOptions" fluid /></label>
          <label><code>button.clickGuard</code><Select v-model="draft.button.clickGuard" :options="guardOptions" fluid /></label>
          <label><code>button.wait</code><InputNumber v-model="draft.button.wait" :min="0" :step="100" fluid /></label>
          <label class="switch-row"><code>button.ripple</code><Switch v-model="draft.button.ripple" /></label>
          <label><code>tag.severity</code><Select v-model="draft.tag.severity" :options="severityOptions" fluid /></label>
          <label><code>tag.effect</code><Select v-model="draft.tag.effect" :options="effectOptions" fluid /></label>
          <label><code>tag.wait</code><InputNumber v-model="draft.tag.wait" :min="0" :step="100" fluid /></label>
          <label class="switch-row"><code>Dialog.closeOnEsc</code><Switch v-model="draft.componentDefaults.Dialog.closeOnEsc" /></label>
          <label class="switch-row"><code>Dialog.closeOnOverlay</code><Switch v-model="draft.componentDefaults.Dialog.closeOnOverlay" /></label>
        </div>
      </Card>

      <Card :header="t('page.dev.config.c3')">
        <div class="field-grid">
          <label><code>validateMessages.required</code><InputText v-model="draft.validateMessages.required" fluid /></label>
          <label><code>validateMessages.minLength</code><InputText v-model="draft.validateMessages.minLength" fluid /></label>
          <label><code>validateMessages.pattern</code><InputText v-model="draft.validateMessages.pattern" fluid /></label>
        </div>
      </Card>
    </div>

    <Card :header="t('page.dev.config.c4')">
      <div class="preview-scope" :data-design="applied.theme">
        <ConfigProvider
          :size="applied.size" :density="applied.density" :direction="applied.direction"
          :z-index="applied.zIndex" :namespace="applied.namespace" :theme="applied.theme"
          :locale="applied.locale" :validate-messages="applied.validateMessages"
          :component-defaults="applied.componentDefaults" :button="applied.button" :tag="applied.tag"
          class="provider-preview"
        >
          <div class="preview-actions">
            <Button :label="t(LocaleKeys.chrome.primaryBtn)" />
            <Button :label="t(LocaleKeys.chrome.secondaryBtn)" variant="outlined" />
            <Tag :label="t(LocaleKeys.tip.updated)" closable />
            <InputText :size="applied.size" :placeholder="t(LocaleKeys.chrome.sampleInput)" fluid />
          </div>
          <dl class="resolved">
            <div v-for="key in ['size', 'density', 'direction', 'zIndex', 'namespace', 'theme', 'locale']" :key="key">
              <dt><code>{{ key }}</code></dt><dd>{{ applied[key as keyof RuntimeConfig] }}</dd>
            </div>
            <div><dt><code>validateMessages.required</code></dt><dd>{{ applied.validateMessages.required }}</dd></div>
          </dl>
        </ConfigProvider>
      </div>
    </Card>

    <Card :header="t('page.dev.config.json.title')" data-testid="config-json-editor">
      <p class="hint">{{ t('page.dev.config.json.hint') }}</p>
      <Textarea v-model="jsonSource" :rows="12" fluid class="json-editor" @input="jsonEditing = true" />
      <div class="toolbar">
        <Button :label="t('page.dev.config.action.validate')" variant="outlined" @click="validateJson" />
        <Button :label="t('page.dev.config.action.import')" @click="importJson" />
        <Button :label="t(LocaleKeys.common.file)" variant="outlined" @click="configFileInput?.click()" />
        <Button :label="t(LocaleKeys.common.export)" variant="outlined" @click="exportJson" />
        <Button :label="t(LocaleKeys.common.copy)" variant="text" @click="copyJson" />
        <input ref="configFileInput" class="file-input" type="file" accept="application/json,.json" :aria-label="t('page.dev.config.action.import')" @change="importJsonFile" />
      </div>
    </Card>

    <Card :header="t('page.dev.config.history.title')">
      <p v-if="!logs.length" class="hint">{{ t(LocaleKeys.common.noData) }}</p>
      <ol v-else class="log-list">
        <li v-for="entry in logs" :key="entry.id">
          <div><Tag :label="t(entry.actionKey)" size="sm" /><time :datetime="entry.at">{{ formatTime(entry.at) }}</time></div>
          <span>{{ t('page.dev.config.history.changed', { count: entry.paths.length }) }}</span>
          <code v-if="entry.paths.length">{{ entry.paths.join(', ') }}</code>
        </li>
      </ol>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.config-page { display: flex; flex-direction: column; gap: var(--theme-section-gap); width: 100%; min-width: 0; padding: var(--theme-page-pad); }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--spacing-2xl) * 9)), 1fr)); gap: var(--theme-section-gap); align-items: start; }
.field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--spacing-2xl) * 6)), 1fr)); gap: var(--spacing-lg); }
.field-grid label { display: flex; min-width: 0; flex-direction: column; gap: var(--spacing-sm); }
.field-grid label > code { color: var(--text-secondary); font-family: var(--font-family-mono); font-size: var(--font-size-xs); }
.field-grid .switch-row { flex-direction: row; align-items: center; justify-content: space-between; min-height: var(--height-md); padding: var(--spacing-sm) var(--spacing-md); border: 1px solid var(--ds-border); border-radius: var(--border-radius-md); }
.preview-scope { width: 100%; min-width: 0; }
.provider-preview { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--spacing-2xl) * 7)), 1fr)); gap: var(--vp-config-density-gap); padding: var(--theme-card-pad); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); background: var(--ds-surface-raised); }
.preview-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--vp-config-density-gap); }
.resolved { display: grid; gap: var(--spacing-xs); margin: 0; padding: var(--spacing-md); border: 1px solid var(--ds-border); border-radius: var(--border-radius-md); background: var(--ds-surface); }
.resolved div { display: flex; justify-content: space-between; gap: var(--spacing-md); }
.resolved dt, .resolved dd { margin: 0; min-width: 0; overflow-wrap: anywhere; font-size: var(--font-size-xs); }
.resolved dt { color: var(--text-secondary); } .resolved dd { color: var(--text-primary); text-align: end; }
.hint { margin: 0 0 var(--spacing-md); color: var(--text-secondary); font-size: var(--font-size-sm); }
.json-editor { width: 100%; }
.file-input { display: none; }
.json-editor :deep(textarea) { width: 100%; min-height: calc(var(--height-xl) * 5); resize: vertical; font-family: var(--font-family-mono); font-size: var(--font-size-sm); }
.toolbar { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.log-list { display: flex; flex-direction: column; gap: var(--spacing-sm); margin: 0; padding: 0; list-style: none; }
.log-list li { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-md); border: 1px solid var(--ds-border); border-radius: var(--border-radius-md); background: var(--ds-surface); color: var(--text-secondary); font-size: var(--font-size-sm); }
.log-list li > div { display: flex; align-items: center; gap: var(--spacing-sm); }
.log-list time { color: var(--text-muted); font-size: var(--font-size-xs); }
.log-list li > code { flex-basis: 100%; overflow-wrap: anywhere; color: var(--text-primary); font-family: var(--font-family-mono); font-size: var(--font-size-xs); }
</style>
