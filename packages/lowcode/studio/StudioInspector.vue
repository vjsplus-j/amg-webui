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
import type { LowcodeActionType, PageRuntime } from '../runtime'

const props = defineProps<{
  editor: LowcodeEditor
  registry: ComponentRegistry
  materials: LowcodeMaterial[]
  runtime?: PageRuntime
}>()

const { t } = useLocale()
const tab = ref<'props' | 'style' | 'data' | 'events' | 'advanced'>('props')

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

watch(
  selected,
  (node) => {
    if (!node) {
      localProps.value = {}
      styleBag.value = {}
      bindings.value = {}
      eventMap.value = {}
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
    label: typeof localProps.value.label === 'string' ? localProps.value.label : selected.value.label
  })
}

function setGeom(field: 'x' | 'y' | 'w' | 'h', value: number) {
  if (!selected.value) return
  props.editor.updateNode(selected.value.id, { [field]: value })
}

const propEntries = computed(() => {
  const schema = meta.value?.propsSchema ?? {}
  return Object.entries(schema)
})

const styleEntries = computed(() => {
  const schema = material.value?.styleSchema ?? DEFAULT_STYLE_SCHEMA
  return Object.entries(schema)
})

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

function setEventHandler(eventName: string, handlerName: string) {
  eventMap.value = { ...eventMap.value, [eventName]: handlerName }
  commitProps()
}

const dsOptions = computed(() =>
  (props.runtime?.dataSources.value ?? []).map((d) => ({ label: d.name || d.id, value: d.id }))
)

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

</script>

<template>
  <aside class="vp-studio-inspector">
    <div v-if="!selected" class="vp-studio-inspector__empty">
      {{ t('lowcode.studio.inspector.empty') }}
    </div>
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
            <Button
              :severity="bindingMode === 'binding' ? 'primary' : 'default'"
              :label="t('lowcode.studio.inspector.binding')"
              @click="bindingMode = 'binding'"
            />
          </div>
        </div>
        <div class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.prop') }}</label>
          <InputText v-model="bindingProp" />
        </div>
        <div v-if="bindingMode === 'binding'" class="vp-studio-field">
          <label>{{ t('lowcode.studio.inspector.path') }}</label>
          <InputText v-model="bindingPath" />
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
        <Button :label="t('lowcode.studio.inspector.applyBinding')" severity="primary" @click="applyBinding" />
        <Divider />
        <pre class="vp-studio-code">{{ JSON.stringify(bindings, null, 2) }}</pre>
      </div>

      <div v-show="tab === 'events'" class="vp-studio-inspector__body">
        <div
          v-for="ev in meta?.events ?? ['click']"
          :key="ev"
          class="vp-studio-field"
        >
          <label>{{ ev }}</label>
          <InputText
            :model-value="eventMap[ev] ?? ''"
            :placeholder="t('lowcode.studio.inspector.handlerName')"
            @update:model-value="setEventHandler(ev, String($event))"
          />
        </div>
        <p class="vp-studio-hint">{{ t('lowcode.studio.inspector.eventHint') }}</p>
        <div class="vp-studio-chips">
          <span v-for="a in actionTypes" :key="a" class="vp-studio-chip">{{ a }}</span>
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
            @update:model-value="
              editor.reparent(selected.id, $event ? String($event) : null)
            "
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
