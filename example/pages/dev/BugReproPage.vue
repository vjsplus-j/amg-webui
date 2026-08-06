<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { Button, Card, Checkbox, InputText, Tag, Textarea } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

type Partition = 'issue' | 'pr'
type Build = 'reported' | 'candidate' | 'fixed'
type RunStatus = 'idle' | 'running' | 'passed' | 'failed' | 'warning'

interface ReproStep {
  id: string
  titleKey?: string
  title?: string
  expectedKey?: string
  expected?: string
}

interface ReproCase {
  id: string
  partition: Partition
  reference: string
  component: string
  titleKey?: string
  title?: string
  custom?: boolean
  steps: ReproStep[]
}

interface RunState {
  steps: RunStatus[]
  hard: RunStatus
  soft: RunStatus
  perf: RunStatus
  a11y: RunStatus
  metric: number | null
  violations: number | null
}

interface RunLog {
  id: number
  at: number
  status: RunStatus
  subject: string
}

const STORAGE_KEY = 'amg-webui:bug-repro:v1'
const REPORT_SCHEMA = 'amg-webui-bug-repro-report'
const PERF_BUDGET = 16
const BUILDS: Build[] = ['reported', 'candidate', 'fixed']
const BROWSERS = ['Chromium', 'Firefox', 'WebKit'] as const
const VIEWPORTS = ['1280 × 800', '390 × 844'] as const
const DATASETS = [100, 1000, 10000] as const
const { t, tDyn, locale } = useLocale()

const sharedSteps = (): ReproStep[] => [
  { id: 'setup', titleKey: 'page.dev.bugRepro.step.setup', expectedKey: 'page.dev.bugRepro.c2' },
  { id: 'reproduce', titleKey: 'page.dev.bugRepro.step.reproduce', expectedKey: 'page.dev.bugRepro.c2' },
  { id: 'cross', titleKey: 'page.dev.bugRepro.step.cross', expectedKey: 'page.dev.bugRepro.c2' }
]

const builtins: ReproCase[] = [
  { id: 'issue-1842', partition: 'issue', reference: 'ISSUE-1842', component: 'Select', titleKey: 'page.dev.bugRepro.case.selectFocus', steps: sharedSteps() },
  { id: 'pr-932', partition: 'pr', reference: 'PR-932', component: 'Dialog', titleKey: 'page.dev.bugRepro.case.dialogMotion', steps: sharedSteps() },
  { id: 'issue-2077', partition: 'issue', reference: 'ISSUE-2077', component: 'VirtualList', titleKey: 'page.dev.bugRepro.case.virtualCross', steps: sharedSteps() }
]

const customCases = ref<ReproCase[]>([])
const cases = computed(() => [...builtins, ...customCases.value])
const selectedId = ref(builtins[0].id)
const activeCase = computed(() => cases.value.find((item) => item.id === selectedId.value) ?? cases.value[0])
const groups = computed(() => ({
  issue: cases.value.filter((item) => item.partition === 'issue'),
  pr: cases.value.filter((item) => item.partition === 'pr')
}))

const environment = reactive({
  build: 'reported' as Build,
  browser: 'Chromium',
  viewport: '1280 × 800',
  dataset: 1000,
  reducedMotion: false,
  highContrast: false
})

const runs = reactive<Record<string, RunState>>({})
const logs = ref<RunLog[]>([])
const running = ref(false)
const creating = ref(false)
const hydrated = ref(false)
const importInput = ref<HTMLInputElement | null>(null)
const noticeKey = ref('')
let runToken = 0
let logId = 0
let lastRunAt = Date.now()

const draft = reactive({
  partition: 'issue' as Partition,
  reference: '',
  title: '',
  component: '',
  steps: '',
  expected: ''
})

const newState = (count: number): RunState => ({
  steps: Array.from({ length: count }, () => 'idle' as RunStatus),
  hard: 'idle',
  soft: 'idle',
  perf: 'idle',
  a11y: 'idle',
  metric: null,
  violations: null
})

function stateFor(item = activeCase.value) {
  if (!runs[item.id] || runs[item.id].steps.length !== item.steps.length) runs[item.id] = newState(item.steps.length)
  return runs[item.id]
}

const currentState = computed(() => stateFor())
const nextStep = computed(() => currentState.value.steps.findIndex((status) => status === 'idle'))
const overallStatus = computed<RunStatus>(() => {
  const state = currentState.value
  if (running.value || state.steps.includes('running')) return 'running'
  if (state.hard === 'failed' || state.perf === 'failed' || state.a11y === 'failed') return 'failed'
  if (state.steps.every((status) => status === 'passed')) return state.soft === 'warning' || state.perf === 'warning' ? 'warning' : 'passed'
  if (state.steps.some((status) => status === 'warning')) return 'warning'
  return 'idle'
})

const statusKeys: Record<RunStatus, string> = {
  idle: LocaleKeys.common.noData,
  running: LocaleKeys.common.loading,
  passed: LocaleKeys.common.success,
  failed: 'page.dev.bugRepro.failed',
  warning: 'component.result.warning'
}

const statusSeverity = (status: RunStatus) => ({
  idle: 'default', running: 'info', passed: 'success', failed: 'danger', warning: 'warning'
} as const)[status]
const caseTitle = (item: ReproCase) => item.titleKey ? tDyn(item.titleKey) : item.title ?? tDyn(LocaleKeys.common.unknown)
const stepTitle = (step: ReproStep) => step.titleKey ? tDyn(step.titleKey) : step.title ?? tDyn(LocaleKeys.common.unknown)
const expectedText = (step: ReproStep) => step.expectedKey ? tDyn(step.expectedKey) : step.expected ?? tDyn(LocaleKeys.common.noData)
const edgeEnvironment = () =>
  environment.browser === 'WebKit' ||
  environment.viewport.startsWith('390') ||
  environment.reducedMotion ||
  environment.highContrast

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function applyEnvironment(value: unknown) {
  if (!isRecord(value)) return
  if (BUILDS.includes(value.build as Build)) environment.build = value.build as Build
  if (BROWSERS.includes(value.browser as (typeof BROWSERS)[number])) {
    environment.browser = value.browser as (typeof BROWSERS)[number]
  }
  if (VIEWPORTS.includes(value.viewport as (typeof VIEWPORTS)[number])) {
    environment.viewport = value.viewport as (typeof VIEWPORTS)[number]
  }
  if (DATASETS.includes(value.dataset as (typeof DATASETS)[number])) {
    environment.dataset = value.dataset as (typeof DATASETS)[number]
  }
  if (typeof value.reducedMotion === 'boolean') environment.reducedMotion = value.reducedMotion
  if (typeof value.highContrast === 'boolean') environment.highContrast = value.highContrast
}

function parseCase(value: unknown, fallbackId: string): ReproCase | null {
  if (!isRecord(value) || !Array.isArray(value.steps) || !value.steps.length) return null
  if (typeof value.reference !== 'string' || typeof value.component !== 'string') return null
  const steps = value.steps.flatMap((raw, index) => {
    if (!isRecord(raw)) return []
    const title = typeof raw.title === 'string' ? raw.title : undefined
    const expected = typeof raw.expected === 'string' ? raw.expected : undefined
    if (!title || !expected) return []
    return [{ id: `${fallbackId}-${index}`, title, expected }]
  })
  if (steps.length !== value.steps.length) return null
  return {
    id: fallbackId,
    custom: true,
    partition: value.partition === 'pr' ? 'pr' : 'issue',
    reference: value.reference,
    component: value.component,
    title: typeof value.title === 'string' ? value.title : value.reference,
    steps
  }
}

function addLog(status: RunStatus, subject: string) {
  logs.value.unshift({ id: ++logId, at: Date.now(), status, subject })
  logs.value = logs.value.slice(0, 80)
}

function resetRuntime(item = activeCase.value) {
  runToken += 1
  running.value = false
  runs[item.id] = newState(item.steps.length)
}

function syncAssertions(item: ReproCase, index: number) {
  const state = stateFor(item)
  const hardSteps = state.steps.slice(0, Math.max(1, item.steps.length - 1))
  state.hard = hardSteps.some((status) => status === 'failed') ? 'failed'
    : hardSteps.some((status) => status === 'warning') ? 'warning'
      : hardSteps.every((status) => status === 'passed') ? 'passed' : 'idle'

  if (index >= 1) {
    state.soft = environment.build === 'reported' ? 'idle'
      : environment.build === 'candidate' && edgeEnvironment() ? 'warning' : 'passed'
  }
  if (index === item.steps.length - 1) {
    const started = typeof performance !== 'undefined' ? performance.now() : 0
    let checksum = 0
    for (let i = 0; i < environment.dataset; i += 1) checksum = (checksum + i) % 997
    const elapsed = typeof performance !== 'undefined' ? performance.now() - started : 0
    state.metric = Number((elapsed + environment.dataset / 500 + checksum / 10000).toFixed(2))
    state.perf = state.metric > PERF_BUDGET * 2 ? 'failed' : state.metric > PERF_BUDGET ? 'warning' : 'passed'
    state.violations = environment.build === 'reported' ? 1
      : environment.build === 'candidate' && environment.highContrast ? 1 : 0
    state.a11y = state.violations ? 'failed' : 'passed'
  }
}

async function executeStep(item: ReproCase, index: number, token: number) {
  const state = stateFor(item)
  state.steps[index] = 'running'
  addLog('running', `${item.reference} · ${stepTitle(item.steps[index])}`)
  await new Promise<void>((resolve) => window.setTimeout(resolve, 120))
  if (token !== runToken) return
  let result: RunStatus = 'passed'
  if (index === 1) {
    if (environment.build === 'reported') result = 'failed'
    else if (environment.build === 'candidate' && edgeEnvironment()) result = 'warning'
  }
  state.steps[index] = result
  syncAssertions(item, index)
  lastRunAt = Date.now()
  addLog(result, `${item.reference} · ${stepTitle(item.steps[index])}`)
}

async function runSingle(index: number) {
  if (running.value || index < 0) return
  const item = activeCase.value
  const token = ++runToken
  running.value = true
  try { await executeStep(item, index, token) } finally { if (token === runToken) running.value = false }
}

async function runAll() {
  if (running.value) return
  const item = activeCase.value
  resetRuntime(item)
  const token = ++runToken
  running.value = true
  try {
    for (let index = 0; index < item.steps.length && token === runToken; index += 1) await executeStep(item, index, token)
  } finally { if (token === runToken) running.value = false }
}

function selectCase(id: string) {
  if (running.value) return
  selectedId.value = id
  stateFor()
}

function createCase() {
  const stepLines = draft.steps.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  const expectedLines = draft.expected.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
  if (!draft.reference.trim() || !draft.title.trim() || !draft.component.trim() || !stepLines.length || !expectedLines.length) {
    noticeKey.value = LocaleKeys.error.required
    return
  }
  const id = `custom-${Date.now()}`
  customCases.value.push({
    id, custom: true, partition: draft.partition,
    reference: draft.reference.trim(), title: draft.title.trim(), component: draft.component.trim(),
    steps: stepLines.map((title, index) => ({ id: `${id}-${index}`, title, expected: expectedLines[index] ?? expectedLines.at(-1) }))
  })
  Object.assign(draft, { partition: 'issue', reference: '', title: '', component: '', steps: '', expected: '' })
  selectedId.value = id
  creating.value = false
  noticeKey.value = LocaleKeys.tip.created
}

function deleteActive() {
  if (!activeCase.value.custom) return
  customCases.value = customCases.value.filter((item) => item.id !== activeCase.value.id)
  selectedId.value = builtins[0].id
  noticeKey.value = LocaleKeys.tip.deleted
}

function reportObject() {
  const item = activeCase.value
  const state = currentState.value
  return {
    schema: REPORT_SCHEMA, version: 1, generatedAt: new Date(lastRunAt).toISOString(),
    case: { partition: item.partition, reference: item.reference, component: item.component, title: caseTitle(item), steps: item.steps.map((step, index) => ({ title: stepTitle(step), expected: expectedText(step), status: state.steps[index] })) },
    environment: { ...environment },
    assertions: { hard: state.hard, soft: state.soft, perf: state.perf, a11y: state.a11y, durationMs: state.metric, violations: state.violations },
    logs: logs.value.map((entry) => ({ at: new Date(entry.at).toISOString(), status: entry.status, subject: entry.subject }))
  }
}

const reportText = computed(() => JSON.stringify(reportObject(), null, 2))

async function copyReport() {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(reportText.value)
    else {
      const textarea = document.createElement('textarea')
      textarea.value = reportText.value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    noticeKey.value = LocaleKeys.tip.copied
  } catch { noticeKey.value = LocaleKeys.error.generic }
}

function exportReport() {
  const blob = new Blob([reportText.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${activeCase.value.reference.toLowerCase()}-repro.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

async function importReport(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const data = JSON.parse(await file.text()) as unknown
    if (!isRecord(data) || data.schema !== REPORT_SCHEMA) throw new Error('invalid')
    const id = `import-${Date.now()}`
    const imported = parseCase(data.case, id)
    if (!imported) throw new Error('invalid')
    customCases.value.push(imported)
    applyEnvironment(data.environment)
    selectedId.value = id
    noticeKey.value = LocaleKeys.tip.created
  } catch { noticeKey.value = LocaleKeys.error.validation } finally { input.value = '' }
}

function persist() {
  if (!hydrated.value) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customCases: customCases.value, selectedId: selectedId.value, environment }))
  } catch { noticeKey.value = LocaleKeys.error.generic }
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as unknown
    if (isRecord(saved) && Array.isArray(saved.customCases)) {
      customCases.value = saved.customCases.flatMap((item, index) => {
        const id = isRecord(item) && typeof item.id === 'string' ? item.id : `saved-${index}`
        const parsed = parseCase(item, id)
        return parsed ? [parsed] : []
      })
    }
    if (isRecord(saved)) applyEnvironment(saved.environment)
    if (isRecord(saved) && typeof saved.selectedId === 'string' && cases.value.some((item) => item.id === saved.selectedId)) selectedId.value = saved.selectedId
  } catch { noticeKey.value = LocaleKeys.error.validation }
  hydrated.value = true
  stateFor()
})

watch([customCases, selectedId, environment], persist, { deep: true })
</script>

<template>
  <div class="bug-repro page" data-testid="bug-repro-page">
    <ExamplePageHero title-key="page.dev.bugRepro.title" lead-key="page.dev.bugRepro.lead">
      <template #actions>
        <Button icon="Plus" :label="t(LocaleKeys.button.create)" data-testid="new-case" @click="creating = !creating" />
        <Button icon="Copy" variant="outlined" :label="t(LocaleKeys.common.copy)" data-testid="copy-report" @click="copyReport" />
        <Button icon="Download" variant="outlined" :label="t(LocaleKeys.common.export)" data-testid="export-report" @click="exportReport" />
        <Button icon="Upload" variant="outlined" :label="t('component.canvas-io.import')" data-testid="import-report" @click="importInput?.click()" />
        <input ref="importInput" class="bug-repro__file" type="file" accept="application/json" :aria-label="t('component.canvas-io.import')" data-testid="import-file" @change="importReport" />
      </template>
    </ExamplePageHero>

    <p v-if="noticeKey" class="bug-repro__notice" role="status" aria-live="polite">{{ tDyn(noticeKey) }}</p>

    <div class="bug-repro__layout">
      <Card class="bug-repro__cases" :header="t('page.dev.bugRepro.c1')">
        <section v-for="partition in (['issue', 'pr'] as Partition[])" :key="partition" class="bug-repro__group" :data-partition="partition">
          <h2>{{ partition === 'issue' ? 'Issue' : 'PR' }} <Tag :label="String(groups[partition].length)" size="sm" /></h2>
          <button v-for="item in groups[partition]" :key="item.id" type="button" class="bug-repro__case" :class="{ 'is-active': item.id === activeCase.id }" :disabled="running" :data-case-id="item.id" data-testid="case-item" @click="selectCase(item.id)">
            <span><code>{{ item.reference }}</code><strong>{{ caseTitle(item) }}</strong></span>
            <small>{{ item.component }}</small>
          </button>
        </section>

        <form v-if="creating" class="bug-repro__create" data-testid="create-form" @submit.prevent="createCase">
          <select v-model="draft.partition" class="bug-repro__control" :aria-label="t('page.dev.bugRepro.c1')"><option value="issue">Issue</option><option value="pr">PR</option></select>
          <InputText v-model="draft.reference" fluid :placeholder="t('page.dev.bugRepro.reference')" />
          <InputText v-model="draft.title" fluid :placeholder="t('page.dev.bugRepro.caseTitle')" />
          <InputText v-model="draft.component" fluid :placeholder="t(LocaleKeys.page.componentsTitle)" />
          <Textarea v-model="draft.steps" fluid :placeholder="t('page.dev.bugRepro.c2')" />
          <Textarea v-model="draft.expected" fluid :placeholder="t('page.dev.bugRepro.expected')" />
          <div class="bug-repro__actions"><Button type="submit" :label="t(LocaleKeys.button.save)" /><Button variant="outlined" :label="t(LocaleKeys.button.cancel)" @click="creating = false" /></div>
        </form>
      </Card>

      <main class="bug-repro__workspace">
        <Card :header="t('page.dev.bugRepro.environment')">
          <div class="bug-repro__env" data-testid="environment-controls">
            <label>{{ t('page.dev.bugRepro.build') }}<select v-model="environment.build" class="bug-repro__control" data-testid="env-build"><option value="reported">{{ t('page.dev.bugRepro.buildReported') }}</option><option value="candidate">{{ t('page.dev.bugRepro.buildCandidate') }}</option><option value="fixed">{{ t('page.dev.bugRepro.buildFixed') }}</option></select></label>
            <label>{{ t('component.browser-detect.browser') }}<select v-model="environment.browser" class="bug-repro__control" data-testid="env-browser"><option v-for="browser in BROWSERS" :key="browser">{{ browser }}</option></select></label>
            <label>{{ t('page.dev.bugRepro.viewport') }}<select v-model="environment.viewport" class="bug-repro__control"><option v-for="viewport in VIEWPORTS" :key="viewport">{{ viewport }}</option></select></label>
            <label>{{ t('page.dev.bugRepro.dataset') }}<select v-model.number="environment.dataset" class="bug-repro__control"><option v-for="size in DATASETS" :key="size" :value="size">{{ size.toLocaleString(locale) }}</option></select></label>
            <Checkbox v-model="environment.reducedMotion" :label="t('page.dev.bugRepro.reducedMotion')" />
            <Checkbox v-model="environment.highContrast" :label="t('page.dev.bugRepro.highContrast')" />
          </div>
        </Card>

        <Card :header="`${activeCase.reference} · ${caseTitle(activeCase)}`" data-testid="repro-scenario">
          <template #extra><Tag :label="tDyn(statusKeys[overallStatus])" :severity="statusSeverity(overallStatus)" effect="light" :data-status="overallStatus" /></template>
          <p class="bug-repro__component"><code>{{ activeCase.component }}</code></p>
          <ol class="bug-repro__steps">
            <li v-for="(step, index) in activeCase.steps" :key="step.id" :data-status="currentState.steps[index]" data-testid="repro-step">
              <div><strong>{{ index + 1 }}. {{ stepTitle(step) }}</strong><Tag :label="tDyn(statusKeys[currentState.steps[index]])" :severity="statusSeverity(currentState.steps[index])" size="sm" effect="light" /></div>
              <p><span>{{ t('page.dev.bugRepro.expected') }}</span>{{ expectedText(step) }}</p>
              <Button size="sm" variant="outlined" icon="Play" :label="t(LocaleKeys.common.play)" :disabled="running" :data-step-index="index" data-testid="run-step" @click="runSingle(index)" />
            </li>
          </ol>
          <template #footer><div class="bug-repro__actions"><Button :label="t(LocaleKeys.common.next)" :disabled="running || nextStep < 0" data-testid="run-next" @click="runSingle(nextStep)" /><Button :label="t('page.dev.bugRepro.runAll')" :loading="running" data-testid="run-all" @click="runAll" /><Button variant="outlined" :label="t(LocaleKeys.button.reset)" data-testid="reset-run" @click="resetRuntime()" /><Button v-if="activeCase.custom" severity="danger" variant="outlined" :label="t(LocaleKeys.button.delete)" @click="deleteActive" /></div></template>
        </Card>

        <Card :header="t('page.dev.bugRepro.c3')">
          <p class="bug-repro__cross-hint">{{ t('page.dev.bugRepro.c4') }}</p>
          <div class="bug-repro__assertions">
            <article v-for="assertion in [{ id: 'hard', label: t('page.dev.bugRepro.hardAssert'), status: currentState.hard }, { id: 'soft', label: t('page.dev.bugRepro.c3'), status: currentState.soft }, { id: 'perf', label: 'Perf', status: currentState.perf }, { id: 'a11y', label: 'A11y', status: currentState.a11y }]" :key="assertion.id" :data-assertion="assertion.id" :data-status="assertion.status" data-testid="assertion">
              <strong>{{ assertion.label }}</strong><Tag :label="tDyn(statusKeys[assertion.status])" :severity="statusSeverity(assertion.status)" effect="light" />
              <small v-if="assertion.id === 'perf' && currentState.metric != null">{{ currentState.metric }} ms / {{ PERF_BUDGET }} ms</small>
              <small v-if="assertion.id === 'a11y' && currentState.violations != null">{{ currentState.violations }}</small>
            </article>
          </div>
        </Card>

        <div class="bug-repro__bottom">
          <Card :header="t('page.dev.bugRepro.logs')"><template #extra><Button size="sm" variant="text" :label="tDyn(LocaleKeys.button.delete)" @click="logs = []" /></template><div class="bug-repro__logs" role="log" data-testid="run-log"><p v-if="!logs.length">{{ tDyn(LocaleKeys.common.noData) }}</p><p v-for="entry in logs" :key="entry.id" :data-status="entry.status"><time>{{ new Date(entry.at).toLocaleTimeString(locale) }}</time><Tag :label="tDyn(statusKeys[entry.status])" :severity="statusSeverity(entry.status)" size="sm" effect="light" /><span>{{ entry.subject }}</span></p></div></Card>
          <Card :header="t('page.dev.bugRepro.report')"><pre class="bug-repro__report" data-testid="report-preview">{{ reportText }}</pre></Card>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bug-repro { display: flex; flex-direction: column; gap: var(--theme-section-gap); padding: var(--theme-page-pad); width: 100%; min-width: 0; box-sizing: border-box; }
.bug-repro__file { display: none; }
.bug-repro__notice { margin: 0; padding: var(--spacing-md); color: var(--text-primary); background: var(--theme-alert-info-bg); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); }
.bug-repro__layout { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--theme-section-gap); min-width: 0; }
.bug-repro__cases { flex: 1 1 calc(var(--width-xl) * 5); min-width: min(100%, calc(var(--width-xl) * 4)); }
.bug-repro__workspace { flex: 3 1 calc(var(--width-xl) * 9); min-width: min(100%, calc(var(--width-xl) * 5)); display: flex; flex-direction: column; gap: var(--theme-section-gap); }
.bug-repro__group + .bug-repro__group { margin-top: var(--spacing-lg); }
.bug-repro__group h2 { display: flex; align-items: center; gap: var(--spacing-sm); margin: 0 0 var(--spacing-sm); color: var(--text-secondary); font-size: var(--font-size-sm); }
.bug-repro__case { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-md); margin-top: var(--spacing-sm); padding: var(--spacing-md); color: var(--text-primary); text-align: left; background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-btn-radius); cursor: pointer; transition: border-color var(--transition-fast), background var(--transition-fast); }
.bug-repro__case.is-active { border-color: var(--ds-accent); background: var(--ds-accent-muted); }
.bug-repro__case:disabled { cursor: default; color: var(--text-muted); }
.bug-repro__case span { display: flex; flex-direction: column; gap: var(--spacing-xs); min-width: 0; }
.bug-repro__case strong, .bug-repro__case small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.bug-repro__case small, .bug-repro__component { color: var(--text-secondary); }
.bug-repro__create { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--ds-border); }
.bug-repro__control { width: 100%; min-height: var(--height-md); padding: 0 var(--spacing-md); color: var(--text-primary); background: var(--surface-1); border: 1px solid var(--ds-border); border-radius: var(--theme-btn-radius); font: inherit; }
.bug-repro__env { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--width-xl) * 3)), 1fr)); align-items: end; gap: var(--spacing-md); }
.bug-repro__env label { display: flex; flex-direction: column; gap: var(--spacing-xs); color: var(--text-secondary); font-size: var(--font-size-sm); }
.bug-repro__component { margin: 0 0 var(--spacing-md); }
.bug-repro__cross-hint { margin: 0 0 var(--spacing-md); color: var(--text-secondary); font-size: var(--font-size-sm); }
.bug-repro__steps { list-style: none; display: flex; flex-direction: column; gap: var(--spacing-md); margin: 0; padding: 0; }
.bug-repro__steps li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--spacing-sm) var(--spacing-md); padding: var(--spacing-md); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); }
.bug-repro__steps li > div { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-sm); }
.bug-repro__steps p { grid-column: 1 / -1; margin: 0; color: var(--text-secondary); font-size: var(--font-size-sm); }
.bug-repro__steps p span { margin-inline-end: var(--spacing-sm); color: var(--text-primary); font-weight: var(--font-weight-heading); }
.bug-repro__actions { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }
.bug-repro__assertions { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--width-xl) * 3)), 1fr)); gap: var(--spacing-md); }
.bug-repro__assertions article { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--spacing-sm); padding: var(--spacing-md); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); }
.bug-repro__assertions small { width: 100%; color: var(--text-secondary); }
.bug-repro__bottom { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--width-xl) * 5)), 1fr)); gap: var(--theme-section-gap); }
.bug-repro__logs, .bug-repro__report { max-height: calc(var(--height-xl) * 7); overflow: auto; }
.bug-repro__logs p { display: flex; flex-wrap: wrap; align-items: center; gap: var(--spacing-sm); margin: 0 0 var(--spacing-sm); color: var(--text-secondary); font-size: var(--font-size-sm); }
.bug-repro__logs time { font-family: var(--font-family-mono); font-size: var(--font-size-xs); }
.bug-repro__report { width: 100%; min-width: 0; box-sizing: border-box; margin: 0; padding: var(--spacing-md); white-space: pre-wrap; overflow-wrap: anywhere; color: var(--text-primary); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); font: var(--font-size-xs)/var(--line-height-body) var(--font-family-mono); }
</style>
