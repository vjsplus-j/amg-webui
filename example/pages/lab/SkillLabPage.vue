<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Button, Card, Tag } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import {
  createPipelineDebugger,
  createSkillInspector,
  createSkillPipeline,
  createSkillPipelineExecutor,
  createSkillRuntime,
  createSkillTelemetryBridge,
  registerOfficialBuiltins,
  type SkillInspectorSnapshot
} from '@amg-webui/skill'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const inspector = createSkillInspector({ maxEvents: 200 })
const pipelineDbg = createPipelineDebugger(inspector)
const runtime = createSkillRuntime({ observers: [inspector.observer] })
registerOfficialBuiltins(runtime)

const mockUsers = [
  { id: 1, name: 'Alice', status: 'active' },
  { id: 2, name: 'Bob', status: 'inactive' },
  { id: 3, name: 'Carol', status: 'active' }
]

runtime.registerAdapter({
  name: 'search',
  async execute(input: { keyword?: string; page: number; pageSize: number }) {
    const kw = (input.keyword ?? '').toLowerCase()
    const filtered = mockUsers.filter((u) => !kw || u.name.toLowerCase().includes(kw))
    const start = (input.page - 1) * input.pageSize
    return {
      list: filtered.slice(start, start + input.pageSize),
      total: filtered.length,
      page: input.page,
      pageSize: input.pageSize
    }
  }
})
runtime.registerAdapter({
  name: 'dict',
  async execute() {
    return { map: { active: '启用', inactive: '停用' } }
  }
})
runtime.registerAdapter({
  name: 'submit',
  async execute(input: { values: Record<string, unknown> }) {
    return { ok: true, id: `id-${Date.now()}`, values: input.values }
  }
})
runtime.registerAdapter({
  name: 'request',
  async execute(input: unknown) {
    return { echo: input, at: Date.now() }
  }
})

const keyword = ref('')
const lastResult = ref<unknown>(null)
const lastError = ref('')
const snapshot = ref<SkillInspectorSnapshot>(inspector.getSnapshot())
const bridgeOn = ref(false)
const telemetryLog = reactive<{ lines: string[] }>({ lines: [] })

let unsub: (() => void) | undefined
let bridgeUnsub: (() => void) | undefined

function refresh() {
  snapshot.value = inspector.getSnapshot()
}

onMounted(() => {
  unsub = inspector.subscribe(refresh)
})

onUnmounted(() => {
  unsub?.()
  bridgeUnsub?.()
  void runtime.dispose()
})

const eventLines = computed(() =>
  snapshot.value.events
    .slice()
    .reverse()
    .slice(0, 40)
    .map((e) => {
      if (e.kind === 'skill') {
        return `${e.phase} · ${e.skillName}#${e.instanceId.slice(0, 8)}`
      }
      return `${e.phase} · pipeline#${e.pipelineId.slice(0, 8)}`
    })
)

const pipelineLines = computed(() =>
  pipelineDbg.getTraces().map((e) => `${e.phase} · ${e.pipelineName ?? e.pipelineId}`)
)

async function runBuiltin(name: string, config: Record<string, unknown>) {
  lastError.value = ''
  try {
    const handle = runtime.mount(name, config)
    lastResult.value = await handle.ready
    await handle.dispose()
  } catch (err) {
    lastError.value = err instanceof Error ? err.message : String(err)
    lastResult.value = null
  }
  refresh()
}

function runSearch() {
  return runBuiltin('table-search', {
    keyword: keyword.value,
    page: 1,
    pageSize: 10
  })
}

function runDict() {
  return runBuiltin('dict-mapping', {
    dict: 'user.status',
    values: ['active', 'inactive']
  })
}

function runSubmit() {
  return runBuiltin('form-submit', {
    values: { name: keyword.value || 'demo' }
  })
}

function runExport() {
  return runBuiltin('table-export', {
    rows: mockUsers,
    format: 'csv',
    filename: 'users.csv'
  })
}

function runRequest() {
  return runBuiltin('request-wrapper', {
    input: { path: '/demo' },
    maxAttempts: 2,
    delayMs: 10
  })
}

async function runPipeline() {
  lastError.value = ''
  try {
    const pipeline = createSkillPipeline({
      version: 1,
      name: 'lab-demo',
      items: [
        { type: 'skill', name: 'dict-mapping', config: { dict: 'user.status', values: ['active'] } },
        {
          type: 'skill',
          name: 'table-search',
          config: { keyword: keyword.value, page: 1, pageSize: 5 }
        }
      ]
    })
    const executor = createSkillPipelineExecutor(runtime)
    const scope = runtime.createScope('lab')
    const handle = executor.start(pipeline, { scope })
    lastResult.value = await handle.ready
    await handle.dispose()
    await scope.dispose()
  } catch (err) {
    lastError.value = err instanceof Error ? err.message : String(err)
  }
  refresh()
}

function toggleBridge() {
  bridgeUnsub?.()
  bridgeUnsub = undefined
  bridgeOn.value = !bridgeOn.value
  if (bridgeOn.value) {
    const bridge = createSkillTelemetryBridge({
      enabled: true,
      appId: 'skill-lab',
      track: (ev) => {
        telemetryLog.lines.unshift(`${ev.type} · ${ev.component ?? ''}`)
        if (telemetryLog.lines.length > 30) telemetryLog.lines.length = 30
      }
    })
    bridgeUnsub = runtime.observe(bridge)
  }
}

function clearInspector() {
  inspector.clear()
  telemetryLog.lines = []
  refresh()
}
</script>

<template>
  <div class="skill-lab">
    <ExamplePageHero
      :title="t('page.lab.skill.title')"
      :lead="t('page.lab.skill.lead')"
    />

    <div class="skill-lab__grid">
      <Card :title="t('page.lab.skill.builtins')">
        <div class="skill-lab__row">
          <label class="skill-lab__label" for="skill-kw">{{ t('page.lab.skill.keyword') }}</label>
          <input id="skill-kw" v-model="keyword" class="skill-lab__input" type="text" />
        </div>
        <div class="skill-lab__actions">
          <Button size="sm" @click="runSearch">table-search</Button>
          <Button size="sm" @click="runDict">dict-mapping</Button>
          <Button size="sm" @click="runSubmit">form-submit</Button>
          <Button size="sm" @click="runExport">table-export</Button>
          <Button size="sm" @click="runRequest">request-wrapper</Button>
          <Button size="sm" variant="solid" @click="runPipeline">{{
            t('page.lab.skill.runPipeline')
          }}</Button>
        </div>
        <p v-if="lastError" class="skill-lab__error" role="alert">{{ lastError }}</p>
        <pre v-if="lastResult" class="skill-lab__pre">{{ JSON.stringify(lastResult, null, 2) }}</pre>
      </Card>

      <Card :title="t('page.lab.skill.inspector')">
        <div class="skill-lab__actions">
          <Button size="sm" @click="toggleBridge">
            {{
              bridgeOn
                ? t('page.lab.skill.bridgeOn')
                : t('page.lab.skill.bridgeOff')
            }}
          </Button>
          <Button size="sm" @click="clearInspector">{{ t('page.lab.skill.clear') }}</Button>
        </div>
        <div class="skill-lab__tags">
          <Tag
            v-for="s in snapshot.activeSkills"
            :key="s.instanceId"
            severity="info"
          >
            {{ s.skillName }} · {{ s.phase }}
          </Tag>
        </div>
        <h3 class="skill-lab__sub">{{ t('page.lab.skill.events') }}</h3>
        <ul class="skill-lab__list">
          <li v-for="(line, i) in eventLines" :key="i">{{ line }}</li>
        </ul>
        <h3 class="skill-lab__sub">{{ t('page.lab.skill.pipeline') }}</h3>
        <ul class="skill-lab__list">
          <li v-for="(line, i) in pipelineLines" :key="i">{{ line }}</li>
        </ul>
        <h3 class="skill-lab__sub">{{ t('page.lab.skill.telemetry') }}</h3>
        <ul class="skill-lab__list">
          <li v-for="(line, i) in telemetryLog.lines" :key="i">{{ line }}</li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skill-lab {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-xs) * 4);
}

.skill-lab__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: calc(var(--spacing-xs) * 4);
}

.skill-lab__row {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing-xs) * 1);
  margin-bottom: calc(var(--spacing-xs) * 3);
}

.skill-lab__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.skill-lab__input {
  padding: calc(var(--spacing-xs) * 2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-elevated);
  color: var(--color-text);
}

.skill-lab__actions {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing-xs) * 2);
  margin-bottom: calc(var(--spacing-xs) * 3);
}

.skill-lab__error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}

.skill-lab__pre {
  margin: 0;
  padding: calc(var(--spacing-xs) * 3);
  max-height: 240px;
  overflow: auto;
  font-size: var(--font-size-sm);
  background: var(--color-bg-muted);
  border-radius: var(--radius-sm);
}

.skill-lab__tags {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--spacing-xs) * 1);
  margin-bottom: calc(var(--spacing-xs) * 2);
}

.skill-lab__sub {
  margin: calc(var(--spacing-xs) * 2) 0 calc(var(--spacing-xs) * 1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.skill-lab__list {
  margin: 0;
  padding-inline-start: calc(var(--spacing-xs) * 4);
  max-height: 160px;
  overflow: auto;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
