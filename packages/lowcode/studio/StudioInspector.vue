<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { InputText, Select, Switch, Textarea } from '@amg-webui/form'
import { Button, Divider } from '@amg-webui/core'
import { useLocale } from '@amg-webui/hooks'
import type { LowcodeEditor } from '../editor'
import type { ComponentRegistry } from '../types'
import { LOWCODE_BINDINGS_KEY, LOWCODE_EVENTS_KEY } from '../types'
import type { LowcodeMaterial } from '../materials'
import { DEFAULT_STYLE_SCHEMA } from '../materials'
import type { DataSourceDef, LowcodeAction, LowcodeActionType, PageRuntime } from '../runtime'

const props = defineProps<{
  editor: LowcodeEditor
  registry: ComponentRegistry
  materials: LowcodeMaterial[]
  runtime?: PageRuntime
  actions: Record<string, LowcodeAction[]>
  dataSources: DataSourceDef[]
}>()

const emit = defineEmits<{
  'update:actions': [Record<string, LowcodeAction[]>]
  'update:dataSources': [DataSourceDef[]]
}>()

const { t } = useLocale()
const tab = ref<'props' | 'style' | 'data' | 'events' | 'advanced'>('props')
const docTab = ref<'sources' | 'actions'>('sources')

const selected = computed(() => props.editor.selectedNodes.value[0] ?? null)
const material = computed(() =>
  selected.value ? props.materials.find((m) => m.type === selected.value!.type) : undefined
)
const meta = computed(() =>
  selected.value ? props.registry.get(selected.value.type) : undefined
)

const localProps = ref<Record<string, unknown>>({})
const styleBag = ref<Record<string, unknown>>({})
const bindings = ref<Record<string, string>>({})
const eventMap = ref<Record<string, string>>({})
const editingHandler = ref('')

watch(
  selected,
  (node) => {
    if (!node) {
      localProps.value = {}
      styleBag.value = {}
      bindings.value = {}
      eventMap.value = {}
      editingHandler.value = ''
      return
    }
    const { [LOWCODE_BINDINGS_KEY]: b, [LOWCODE_EVENTS_KEY]: ev, __style: st, ...rest } =
      node.props as Record<string, unknown>
    localProps.value = { ...rest }
    styleBag.value = (st && typeof st === 'object' ? { ...(st as object) } : {}) as Record<
      string,
      unknown
    >
    bindings.value = (b && typeof b === 'object' ? { ...(b as object) } : {}) as Record<
      string,
      string
    >
    eventMap.value = (ev && typeof ev === 'object' ? { ...(ev as object) } : {}) as Record<
      string,
      string
    >
    const first = Object.values(eventMap.value)[0]
    editingHandler.value = first || ''
  },
  { immediate: true }
)

function commitProps() {
  if (!selected.value) return
  props.editor.updateNode(selected.value.id, {
    props: {
      ...localProps.value,
      [LOWCODE_BINDINGS_KEY]: { ...bindings.value },
      [LOWCODE_EVENTS_KEY]: { ...eventMap.value },
      __style: { ...styleBag.value }
    },
    label:
      typeof localProps.value.label === 'string' ? localProps.value.label : selected.value.label
  })
}

function setGeom(field: 'x' | 'y' | 'w' | 'h', value: number) {
  if (!selected.value) return
  props.editor.updateNode(selected.value.id, { [field]: value })
}

const propEntries = computed(() => Object.entries(meta.value?.propsSchema ?? {}))
const styleEntries = computed(() =>
  Object.entries(material.value?.styleSchema ?? DEFAULT_STYLE_SCHEMA)
)

const actionTypes: LowcodeActionType[] = [
  'SetState',
  'CallApi',
  'OpenDialog',
  'CloseDialog',
  'ShowMessage',
  'Navigate',
  'RefreshData',
  'SubmitForm',
  'ResetForm'
]

const bindingMode = ref<'static' | 'binding'>('static')
const bindingProp = ref('modelValue')
const bindingPath = ref('state.keyword')

function applyBinding() {
  if (bindingMode.value === 'binding') {
    bindings.value = { ...bindings.value, [bindingProp.value]: bindingPath.value }
  } else {
    const next = { ...bindings.value }
    delete next[bindingProp.value]
    bindings.value = next
  }
  commitProps()
}

function ensureAction(handlerName: string) {
  const name = handlerName.trim()
  if (!name) return
  if (props.actions[name]?.length) return
  const next = {
    ...props.actions,
    [name]: [{ type: 'CallApi' as const, dataSourceId: props.dataSources[0]?.id || 'queryUsers' }]
  }
  emit('update:actions', next)
}

function setEventHandler(eventName: string, handlerName: string) {
  const name = handlerName.trim()
  eventMap.value = { ...eventMap.value, [eventName]: name }
  editingHandler.value = name
  commitProps()
  if (name) ensureAction(name)
}

const activeChain = computed(() => {
  const name = editingHandler.value.trim()
  if (!name) return [] as LowcodeAction[]
  return props.actions[name] ?? []
})

function updateChain(chain: LowcodeAction[]) {
  const name = editingHandler.value.trim()
  if (!name) return
  emit('update:actions', { ...props.actions, [name]: chain })
}

function addActionStep(type: LowcodeActionType) {
  const step: LowcodeAction = { type }
  if (type === 'CallApi' || type === 'RefreshData') {
    step.dataSourceId = props.dataSources[0]?.id || 'queryUsers'
  }
  if (type === 'SetState' || type === 'OpenDialog' || type === 'CloseDialog') {
    step.target = 'state.createOpen'
    step.value = type === 'CloseDialog' ? false : true
  }
  if (type === 'ShowMessage') {
    step.message = 'OK'
    step.severity = 'info'
  }
  if (type === 'Navigate') step.path = '/'
  updateChain([...activeChain.value, step])
}

function patchStep(index: number, patch: Partial<LowcodeAction>) {
  const next = activeChain.value.map((a, i) => (i === index ? { ...a, ...patch } : a))
  updateChain(next)
}

function removeStep(index: number) {
  updateChain(activeChain.value.filter((_, i) => i !== index))
}

function applyJsonProps(raw: string) {
  try {
    localProps.value = { ...JSON.parse(raw) }
    commitProps()
  } catch {
    /* ignore */
  }
}

const pathHints = [
  'state.keyword',
  'state.createOpen',
  'form.name',
  'data.queryUsers.list',
  'data.queryUsers.total',
  'route.query.id',
  'user.name'
]

const dsOptions = computed(() =>
  props.dataSources.map((d) => ({ label: d.name || d.id, value: d.id }))
)

const draftDs = ref<DataSourceDef>({
  id: 'queryUsers',
  type: 'mock',
  name: 'queryUsers',
  transform: 'listTotal',
  staticData: { list: [], total: 0 }
})

function saveDataSource() {
  const id = draftDs.value.id.trim()
  if (!id) return
  const list = [...props.dataSources]
  const idx = list.findIndex((d) => d.id === id)
  const item: DataSourceDef = { ...draftDs.value, id }
  if (idx >= 0) list[idx] = item
  else list.push(item)
  emit('update:dataSources', list)
  props.runtime?.registerDataSource(item)
}

function loadDsIntoDraft(id: string) {
  const found = props.dataSources.find((d) => d.id === id)
  if (found) draftDs.value = { ...found }
}

function removeDataSource(id: string) {
  emit(
    'update:dataSources',
    props.dataSources.filter((d) => d.id !== id)
  )
}
</script>

<template>
  <aside class="vp-studio-inspector" data-testid="studio-inspector">
    <!-- Document-level when nothing selected -->
    <template v-if="!selected">
      <header class="vp-studio-inspector__head">
        <strong>{{ t('lowcode.studio.inspector.document') }}</strong>
      </header>
      <nav class="vp-studio-inspector__tabs">
        <button
          type="button"
          class="vp-studio-inspector__tab"
          :class="{ 'is-active': docTab === 'sources' }"
          data-testid="inspector-doc-tab-sources"
          @click="docTab = 'sources'"
        >
          {{ t('lowcode.studio.inspector.dataSources') }}
        </button>
        <button
          type="button"
          class="vp-studio-inspector__tab"
          :class="{ 'is-active': docTab === 'actions' }"
          data-testid="inspector-doc-tab-actions"
          @click="docTab = 'actions'"
        >
          {{ t('lowcode.studio.inspector.actions') }}
        </button>
      </nav>
      <div v-show="docTab === 'sources'" class="vp-studio-inspector__body">
        <ul class="vp-studio-ds-list">
          <li v-for="d in dataSources" :key="d.id">
            <button type="button" class="vp-studio-chip" @click="loadDsIntoDraft(d.id)">
              {{ d.name || d.id }} ({{ d.type }})
            </button>
            <Button
              size="sm"
              :label="t('lowcode.studio.inspector.remove')"
              @click="removeDataSource(d.id)"
            />
          </li>
        </ul>
        <div class="vp-studio-field">
          <label>id</label>
          <span data-testid="inspector-ds-id"><InputText v-model="draftDs.id" /></span>
        </div>
        <div class="vp-studio-field">
          <label>name</label>
          <span data-testid="inspector-ds-name">
            <InputText
              :model-value="draftDs.name ?? ''"
              @update:model-value="draftDs.name = String($event)"
            />
          </span>
        </div>
        <div class="vp-studio-field">
          <label>type</label>
          <Select
            :model-value="draftDs.type"
            :options="[
              { label: 'mock', value: 'mock' },
              { label: 'static', value: 'static' },
              { label: 'rest', value: 'rest' }
            ]"
            @update:model-value="draftDs.type = $event as DataSourceDef['type']"
          />
        </div>
        <div v-if="draftDs.type === 'rest'" class="vp-studio-field">
          <label>URL</label>
          <InputText
            :model-value="draftDs.request?.url ?? ''"
            @update:model-value="
              draftDs.request = { ...(draftDs.request ?? {}), method: 'GET', url: String($event) }
            "
          />
        </div>
        <div v-else class="vp-studio-field">
          <label>static JSON</label>
          <span data-testid="inspector-ds-static">
            <Textarea
              :model-value="JSON.stringify(draftDs.staticData ?? {}, null, 2)"
              :rows="6"
              @update:model-value="
                (() => {
                  try {
                    draftDs.staticData = JSON.parse(String($event))
                  } catch {
                    /* ignore */
                  }
                })()
              "
            />
          </span>
        </div>
        <span data-testid="inspector-save-datasource">
          <Button
            severity="primary"
            :label="t('lowcode.studio.inspector.saveDs')"
            @click="saveDataSource"
          />
        </span>
      </div>
      <div v-show="docTab === 'actions'" class="vp-studio-inspector__body">
        <p class="vp-studio-hint">{{ t('lowcode.studio.inspector.actionsDocHint') }}</p>
        <pre class="vp-studio-code">{{ JSON.stringify(actions, null, 2) }}</pre>
      </div>
    </template>

    <template v-else>
      <header class="vp-studio-inspector__head">
        <strong>{{ selected.type }}</strong>
        <span class="vp-studio-inspector__id">{{ selected.id }}</span>
      </header>

      <nav class="vp-studio-inspector__tabs">
        <button
          v-for="key in (['props', 'style', 'data', 'events', 'advanced'] as const)"
          :key="key"
          type="button"
          class="vp-studio-inspector__tab"
          :class="{ 'is-active': tab === key }"
          :data-testid="`inspector-tab-${key}`"
          @click="tab = key"
        >
          {{ t(`lowcode.studio.inspector.tab.${key}`) }}
        </button>
      </nav>

      <div v-show="tab === 'props'" class="vp-studio-inspector__body">
        <div class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.geometry') }}</label>
          <div class="vp-studio-field__row">
            <InputText
              :model-value="String(selected.x)"
              @update:model-value="setGeom('x', Number($event) || 0)"
            />
            <InputText
              :model-value="String(selected.y)"
              @update:model-value="setGeom('y', Number($event) || 0)"
            />
            <InputText
              :model-value="String(selected.w)"
              @update:model-value="setGeom('w', Number($event) || 24)"
            />
            <InputText
              :model-value="String(selected.h)"
              @update:model-value="setGeom('h', Number($event) || 24)"
            />
          </div>
        </div>
        <div v-for="[key, schema] in propEntries" :key="key" class="vp-studio-field">
          <label>{{ schema.title || key }}</label>
          <Switch
            v-if="schema.type === 'boolean'"
            :model-value="Boolean(localProps[key])"
            @update:model-value="
              localProps[key] = $event;
              commitProps()
            "
          />
          <Select
            v-else-if="schema.type === 'enum' && schema.enum"
            :model-value="(localProps[key] as string) ?? ''"
            :options="schema.enum.map((v) => ({ label: String(v), value: v }))"
            @update:model-value="
              localProps[key] = $event;
              commitProps()
            "
          />
          <InputText
            v-else-if="schema.type === 'number'"
            :model-value="String(localProps[key] ?? '')"
            @update:model-value="
              localProps[key] = Number($event);
              commitProps()
            "
          />
          <InputText
            v-else
            :model-value="String(localProps[key] ?? '')"
            @update:model-value="
              localProps[key] = $event;
              commitProps()
            "
          />
        </div>
        <div v-if="!propEntries.length" class="vp-studio-field">
          <label>label</label>
          <InputText
            :model-value="String(localProps.label ?? selected.label)"
            @update:model-value="
              localProps.label = $event;
              commitProps()
            "
          />
        </div>
      </div>

      <div v-show="tab === 'style'" class="vp-studio-inspector__body">
        <div v-for="[key, schema] in styleEntries" :key="key" class="vp-studio-field">
          <label>{{ schema.title || key }}</label>
          <Select
            v-if="schema.type === 'token' && schema.tokens"
            :model-value="String(styleBag[key] ?? '')"
            :options="schema.tokens.map((v) => ({ label: v, value: v }))"
            @update:model-value="
              styleBag[key] = $event;
              commitProps()
            "
          />
          <Select
            v-else-if="schema.type === 'enum' && schema.enum"
            :model-value="String(styleBag[key] ?? '')"
            :options="schema.enum.map((v) => ({ label: v, value: v }))"
            @update:model-value="
              styleBag[key] = $event;
              commitProps()
            "
          />
          <InputText
            v-else
            :model-value="String(styleBag[key] ?? '')"
            @update:model-value="
              styleBag[key] = $event;
              commitProps()
            "
          />
        </div>
      </div>

      <div v-show="tab === 'data'" class="vp-studio-inspector__body">
        <div class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.bindingMode') }}</label>
          <div class="vp-studio-field__row">
            <Button
              :severity="bindingMode === 'static' ? 'primary' : 'default'"
              :label="t('lowcode.studio.inspector.static')"
              @click="bindingMode = 'static'"
            />
            <span data-testid="inspector-binding-mode">
              <Button
                :severity="bindingMode === 'binding' ? 'primary' : 'default'"
                :label="t('lowcode.studio.inspector.binding')"
                @click="bindingMode = 'binding'"
              />
            </span>
          </div>
        </div>
        <div class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.prop') }}</label>
          <span data-testid="inspector-binding-prop"><InputText v-model="bindingProp" /></span>
        </div>
        <div v-if="bindingMode === 'binding'" class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.path') }}</label>
          <span data-testid="inspector-binding-path"><InputText v-model="bindingPath" /></span>
          <div class="vp-studio-chips">
            <button
              v-for="hint in pathHints"
              :key="hint"
              type="button"
              class="vp-studio-chip"
              @click="bindingPath = hint"
            >
              {{ hint }}
            </button>
          </div>
        </div>
        <span data-testid="inspector-apply-binding">
          <Button
            :label="t('lowcode.studio.inspector.applyBinding')"
            severity="primary"
            @click="applyBinding"
          />
        </span>
        <Divider />
        <pre class="vp-studio-code">{{ JSON.stringify(bindings, null, 2) }}</pre>
      </div>

      <div v-show="tab === 'events'" class="vp-studio-inspector__body">
        <div v-for="ev in meta?.events ?? ['click']" :key="ev" class="vp-studio-field">
          <label>{{ ev }}</label>
          <span data-testid="inspector-event-handler">
            <InputText
              :model-value="eventMap[ev] ?? ''"
              :placeholder="t('lowcode.studio.inspector.handlerName')"
              @update:model-value="setEventHandler(ev, String($event))"
            />
          </span>
        </div>

        <Divider />
        <div class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.actionChain') }} · {{ editingHandler || '—' }}</label>
          <div
            v-for="(step, idx) in activeChain"
            :key="idx"
            class="vp-studio-action-step"
          >
            <Select
              :model-value="step.type"
              :options="actionTypes.map((a) => ({ label: a, value: a }))"
              @update:model-value="patchStep(idx, { type: $event as LowcodeActionType })"
            />
            <InputText
              v-if="step.type === 'CallApi' || step.type === 'RefreshData'"
              :model-value="step.dataSourceId ?? ''"
              :placeholder="t('lowcode.studio.inspector.dataSourceId')"
              @update:model-value="patchStep(idx, { dataSourceId: String($event) })"
            />
            <InputText
              v-if="
                step.type === 'SetState' ||
                step.type === 'OpenDialog' ||
                step.type === 'CloseDialog' ||
                step.type === 'SetValue'
              "
              :model-value="step.target ?? ''"
              placeholder="state.xxx"
              @update:model-value="patchStep(idx, { target: String($event) })"
            />
            <InputText
              v-if="step.type === 'ShowMessage'"
              :model-value="step.message ?? ''"
              @update:model-value="patchStep(idx, { message: String($event) })"
            />
            <InputText
              v-if="step.type === 'Navigate'"
              :model-value="step.path ?? ''"
              @update:model-value="patchStep(idx, { path: String($event) })"
            />
            <Button
              size="sm"
              :label="t('lowcode.studio.inspector.remove')"
              @click="removeStep(idx)"
            />
          </div>
          <div class="vp-studio-chips">
            <button
              v-for="a in actionTypes"
              :key="a"
              type="button"
              class="vp-studio-chip"
              @click="addActionStep(a)"
            >
              + {{ a }}
            </button>
          </div>
        </div>
        <div v-if="dsOptions.length" class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.dataSources') }}</label>
          <ul>
            <li v-for="d in dsOptions" :key="String(d.value)">{{ d.label }}</li>
          </ul>
        </div>
      </div>

      <div v-show="tab === 'advanced'" class="vp-studio-inspector__body">
        <div class="vp-studio-field">
          <label>parentId</label>
          <InputText
            :model-value="selected.parentId ?? ''"
            @update:model-value="editor.reparent(selected.id, $event ? String($event) : null)"
          />
        </div>
        <div class="vp-studio-field">
          <label>locked</label>
          <Switch
            :model-value="Boolean(selected.locked)"
            @update:model-value="editor.updateNode(selected.id, { locked: $event })"
          />
        </div>
        <div class="vp-studio-field">
          <label>hidden</label>
          <Switch
            :model-value="Boolean(selected.hidden)"
            @update:model-value="editor.updateNode(selected.id, { hidden: $event })"
          />
        </div>
        <div class="vp-studio-field">
          <label>JSON props</label>
          <Textarea
            :model-value="JSON.stringify(localProps, null, 2)"
            :rows="8"
            @update:model-value="applyJsonProps(String($event))"
          />
        </div>
      </div>
    </template>
  </aside>
</template>
