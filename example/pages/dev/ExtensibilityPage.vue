<script setup lang="ts">
import { computed, defineComponent, h, ref, type PropType, type VNodeChild } from 'vue'
import { Button, Card, DataTable, Icon, Switch, Tag, Textarea } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ToastService } from '@amg-webui/theme'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

type ExtensionKind = 'slot' | 'cell' | 'node' | 'wrapper' | 'adapter'
type RendererId = 'slot-pack' | 'status-tag' | 'rich-node' | 'thin-action' | 'token-adapter'
type SlotName = 'header' | 'prepend' | 'empty' | 'footer' | 'actions'

interface ExtensionManifest {
  schema: 'vp-extension/v1'
  id: string
  version: string
  kind: ExtensionKind
  target: string
  order: number
  enabled: boolean
  renderer: RendererId
  config?: Record<string, unknown>
}

interface RegisteredExtension extends ExtensionManifest {
  source: 'builtin' | 'manifest'
}

interface EventItem {
  id: number
  time: string
  actionKey: string
  target: string
}

interface PreviewNode {
  id: string
  label: string
  kind: string
  children?: PreviewNode[]
}

const { t, tDyn, locale } = useLocale()
const fileInput = ref<HTMLInputElement | null>(null)
const selectedId = ref('builtin.slot-pack')
const enabledSlots = ref<SlotName[]>(['header', 'prepend', 'footer', 'actions'])
const events = ref<EventItem[]>([])
const manifestIssues = ref<{ key: string; field?: string }[]>([])
const manifestChecked = ref(false)
let eventId = 0

const defaults: RegisteredExtension[] = [
  { schema: 'vp-extension/v1', id: 'builtin.slot-pack', version: '1.0.0', kind: 'slot', target: 'ExtensionSurface.*', order: 10, enabled: true, renderer: 'slot-pack', source: 'builtin' },
  { schema: 'vp-extension/v1', id: 'builtin.cell-status', version: '1.0.0', kind: 'cell', target: 'DataTable.body-status', order: 20, enabled: true, renderer: 'status-tag', source: 'builtin' },
  { schema: 'vp-extension/v1', id: 'builtin.node-rich', version: '1.0.0', kind: 'node', target: 'Tree.node', order: 30, enabled: true, renderer: 'rich-node', source: 'builtin' },
  { schema: 'vp-extension/v1', id: 'builtin.thin-action', version: '1.0.0', kind: 'wrapper', target: 'Button.invoke', order: 40, enabled: true, renderer: 'thin-action', source: 'builtin' },
  { schema: 'vp-extension/v1', id: 'builtin.token-adapter', version: '1.0.0', kind: 'adapter', target: 'HostDesignSystem.tokens', order: 50, enabled: true, renderer: 'token-adapter', source: 'builtin' }
]

const registry = ref(defaults.map((item) => ({ ...item })))
const draftManifest: ExtensionManifest = {
  schema: 'vp-extension/v1', id: 'host.audit-status', version: '1.0.0', kind: 'cell',
  target: 'DataTable.body-status', order: 60, enabled: true, renderer: 'status-tag'
}
const manifestText = ref(JSON.stringify(draftManifest, null, 2))

const orderedRegistry = computed(() => [...registry.value].sort((a, b) => a.order - b.order))
const enabledCount = computed(() => registry.value.filter((item) => item.enabled).length)
const selectedExtension = computed(() => registry.value.find((item) => item.id === selectedId.value))
const slotNames: SlotName[] = ['header', 'prepend', 'empty', 'footer', 'actions']
const tableRows = [
  { id: 'gateway', name: 'Gateway', status: true, owner: 'Platform' },
  { id: 'console', name: 'Console', status: false, owner: 'Experience' },
  { id: 'telemetry', name: 'Telemetry', status: true, owner: 'Runtime' }
]
const tableColumns = computed(() => {
  void locale.value
  return [
    { field: 'name', header: t('biz.colName') },
    { field: 'status', header: t('page.dev.extensibility.state.enabled') },
    { field: 'owner', header: t(LocaleKeys.common.user) }
  ]
})
const treeNodes: PreviewNode[] = [
  { id: 'components', label: '@amg-webui/components', kind: 'package', children: [
    { id: 'data-table', label: 'DataTable', kind: 'component' },
    { id: 'button', label: 'Button', kind: 'component' }
  ] },
  { id: 'theme', label: 'ThemeService', kind: 'service' }
]

function addEvent(actionKey: string, target: string) {
  events.value.unshift({
    id: ++eventId,
    time: new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()),
    actionKey,
    target
  })
  events.value = events.value.slice(0, 40)
}

function isRendererEnabled(renderer: RendererId) {
  return orderedRegistry.value.some((item) => item.enabled && item.renderer === renderer)
}

function toggleExtension(item: RegisteredExtension, enabled: boolean) {
  item.enabled = enabled
  addEvent(`page.dev.extensibility.state.${enabled ? 'enabled' : 'disabled'}`, item.id)
}

function moveExtension(item: RegisteredExtension, offset: number) {
  const list = orderedRegistry.value
  const index = list.findIndex((candidate) => candidate.id === item.id)
  const other = list[index + offset]
  if (!other) return
  ;[item.order, other.order] = [other.order, item.order]
  addEvent(offset < 0 ? LocaleKeys.common.previous : LocaleKeys.common.next, item.id)
}

function selectExtension(item: RegisteredExtension) {
  selectedId.value = item.id
  addEvent(LocaleKeys.button.enter, item.id)
}

function slotOverridden(name: SlotName) {
  return isRendererEnabled('slot-pack') && enabledSlots.value.includes(name)
}

function toggleSlot(name: SlotName) {
  if (!isRendererEnabled('slot-pack')) return
  enabledSlots.value = slotOverridden(name)
    ? enabledSlots.value.filter((slot) => slot !== name)
    : [...enabledSlots.value, name]
  addEvent(`page.dev.extensibility.state.${slotOverridden(name) ? 'override' : 'fallback'}`, `#${name}`)
}

function plainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function parseManifest(): ExtensionManifest | null {
  manifestChecked.value = true
  manifestIssues.value = []
  let raw: unknown
  try {
    raw = JSON.parse(manifestText.value)
  } catch {
    manifestIssues.value.push({ key: 'page.dev.extensibility.manifest.invalidJson' })
    return null
  }
  if (!plainObject(raw)) {
    manifestIssues.value.push({ key: 'page.dev.extensibility.manifest.invalidField', field: 'root' })
    return null
  }
  const allowedKinds: ExtensionKind[] = ['slot', 'cell', 'node', 'wrapper', 'adapter']
  const allowedRenderers: RendererId[] = ['slot-pack', 'status-tag', 'rich-node', 'thin-action', 'token-adapter']
  const checks: Array<[string, boolean]> = [
    ['schema', raw.schema === 'vp-extension/v1'],
    ['id', typeof raw.id === 'string' && /^[a-z0-9][a-z0-9.-]{2,63}$/.test(raw.id)],
    ['version', typeof raw.version === 'string' && /^\d+\.\d+\.\d+$/.test(raw.version)],
    ['kind', allowedKinds.includes(raw.kind as ExtensionKind)],
    ['target', typeof raw.target === 'string' && raw.target.length > 0],
    ['order', typeof raw.order === 'number' && Number.isFinite(raw.order)],
    ['enabled', typeof raw.enabled === 'boolean'],
    ['renderer', allowedRenderers.includes(raw.renderer as RendererId)],
    ['config', raw.config === undefined || plainObject(raw.config)]
  ]
  checks.filter(([, valid]) => !valid).forEach(([field]) => {
    manifestIssues.value.push({ key: 'page.dev.extensibility.manifest.invalidField', field })
  })
  return manifestIssues.value.length ? null : raw as unknown as ExtensionManifest
}

function validateManifest() {
  const manifest = parseManifest()
  addEvent(manifest ? 'page.dev.extensibility.manifest.valid' : LocaleKeys.error.validation, manifest?.id ?? 'manifest')
}

function registerManifest() {
  const manifest = parseManifest()
  if (!manifest) {
    ToastService.warn({ summary: t(LocaleKeys.error.validation) })
    return
  }
  const index = registry.value.findIndex((item) => item.id === manifest.id)
  const record: RegisteredExtension = { ...manifest, source: 'manifest' }
  if (index >= 0) registry.value.splice(index, 1, record)
  else registry.value.push(record)
  selectedId.value = record.id
  addEvent(index >= 0 ? LocaleKeys.tip.updated : LocaleKeys.tip.created, record.id)
  ToastService.success({ summary: t(index >= 0 ? LocaleKeys.tip.updated : LocaleKeys.tip.created) })
}

function openImport() {
  fileInput.value?.click()
}

async function importManifest(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  manifestText.value = await file.text()
  validateManifest()
  addEvent('page.dev.extensibility.action.import', file.name)
  input.value = ''
}

function exportSelected() {
  const item = selectedExtension.value
  if (!item) return
  const { source: _source, ...manifest } = item
  const url = URL.createObjectURL(new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.id}.json`
  link.click()
  URL.revokeObjectURL(url)
  addEvent(LocaleKeys.common.export, item.id)
}

function resetWorkbench() {
  registry.value = defaults.map((item) => ({ ...item }))
  selectedId.value = defaults[0].id
  enabledSlots.value = ['header', 'prepend', 'footer', 'actions']
  manifestText.value = JSON.stringify(draftManifest, null, 2)
  manifestChecked.value = false
  manifestIssues.value = []
  events.value = []
  addEvent(LocaleKeys.tip.formReset, 'registry')
}

type RenderContext = { value?: unknown; row?: Record<string, unknown> }
const RenderOutlet = defineComponent({
  props: {
    renderer: { type: Function as PropType<(context: RenderContext) => VNodeChild>, required: true },
    context: { type: Object as PropType<RenderContext>, required: true }
  },
  setup: (props) => () => props.renderer(props.context)
})

const NamedSlotSurface = defineComponent({
  props: { fallback: { type: String, required: true } },
  setup(props, { slots }) {
    return () => h('div', { class: 'slot-surface', 'data-testid': 'named-slot-surface' }, slotNames.map((name) =>
      h('div', { class: 'slot-region', 'data-slot-region': name }, [
        h('code', `#${name}`),
        h('span', slots[name]?.() ?? props.fallback)
      ])
    ))
  }
})

const renderStatus = ({ value }: RenderContext) => h(Tag, {
  severity: value ? 'success' : 'danger', effect: 'light', size: 'sm'
}, { default: () => t(value ? LocaleKeys.common.yes : LocaleKeys.common.no) })

const ThinAction = defineComponent({
  props: { label: { type: String, required: true } },
  emits: ['invoke'],
  setup: (props, { emit }) => () => h(Button, {
    label: props.label, icon: 'ShieldCheck', variant: 'outlined', rounded: true,
    onClick: () => emit('invoke')
  })
})

const NodeSurface = defineComponent({
  props: { nodes: { type: Array as PropType<PreviewNode[]>, required: true }, rich: Boolean },
  emits: ['select'],
  setup(props, { emit }) {
    const renderNode = (node: PreviewNode, depth: number): VNodeChild => h('li', { 'data-node-id': node.id }, [
      h('button', {
        type: 'button', class: 'node-row',
        style: { paddingInlineStart: `calc(var(--spacing-sm) + var(--spacing-lg) * ${depth})` },
        onClick: () => emit('select', node)
      }, props.rich ? [h(Icon, { name: node.children ? 'FolderTree' : 'Box', size: 'sm' }), h('span', node.label), h(Tag, { size: 'xs', effect: 'outlined' }, { default: () => node.kind })] : node.label),
      node.children?.length ? h('ul', node.children.map((child) => renderNode(child, depth + 1))) : null
    ])
    return () => h('ul', { class: 'node-surface', role: 'tree', 'data-testid': 'node-render-preview' }, props.nodes.map((node) => renderNode(node, 0)))
  }
})

function invokeWrapper() {
  addEvent(LocaleKeys.button.submit, 'Button.invoke')
  ToastService.success({ summary: t(LocaleKeys.common.success) })
}

const adapterEnabled = computed(() => isRendererEnabled('token-adapter'))
</script>

<template>
  <div class="extensibility-page" data-testid="extensibility-workbench">
    <ExamplePageHero title-key="page.dev.extensibility.title" lead-key="page.dev.extensibility.lead">
      <template #title-extra>
        <Tag>{{ t('page.dev.extensibility.summary.registered', { count: registry.length }) }}</Tag>
        <Tag severity="success">{{ t('page.dev.extensibility.summary.enabled', { count: enabledCount }) }}</Tag>
        <Tag severity="info">{{ t('page.dev.extensibility.summary.events', { count: events.length }) }}</Tag>
      </template>
      <template #actions>
        <Button size="sm" variant="outlined" icon="Upload" :label="t('page.dev.extensibility.action.import')" @click="openImport" />
        <Button size="sm" variant="outlined" icon="Download" :label="t(LocaleKeys.common.export)" @click="exportSelected" />
        <Button size="sm" variant="text" icon="RotateCcw" :label="t(LocaleKeys.button.reset)" @click="resetWorkbench" />
        <input ref="fileInput" class="file-input" type="file" accept="application/json,.json" :aria-label="t('page.dev.extensibility.action.import')" @change="importManifest" />
      </template>
    </ExamplePageHero>

    <div class="top-grid">
      <Card :title="t('page.dev.extensibility.registry.title')" data-testid="extension-registry">
        <div class="registry-list" role="list">
          <article v-for="(item, index) in orderedRegistry" :key="item.id" class="registry-item" :class="{ 'registry-item--selected': selectedId === item.id }" :data-extension-id="item.id">
            <button type="button" class="registry-select" @click="selectExtension(item)">
              <span><code>{{ item.id }}</code><Tag size="xs" effect="outlined">{{ item.kind }}</Tag></span>
              <small>{{ item.target }} · v{{ item.version }}</small>
            </button>
            <div class="registry-actions">
              <Switch :model-value="item.enabled" size="sm" :aria-label="t(item.enabled ? 'page.dev.extensibility.state.enabled' : 'page.dev.extensibility.state.disabled')" @update:model-value="toggleExtension(item, $event)" />
              <Button shape="square" size="xs" variant="text" icon="ArrowUp" :disabled="index === 0" :aria-label="t(LocaleKeys.common.previous)" @click="moveExtension(item, -1)" />
              <Button shape="square" size="xs" variant="text" icon="ArrowDown" :disabled="index === orderedRegistry.length - 1" :aria-label="t(LocaleKeys.common.next)" @click="moveExtension(item, 1)" />
            </div>
          </article>
        </div>
      </Card>

      <Card :title="t('page.dev.extensibility.manifest.title')" data-testid="manifest-editor">
        <p class="hint">{{ t('page.dev.extensibility.manifest.help') }}</p>
        <Textarea v-model="manifestText" class="manifest-input" fluid />
        <div class="manifest-actions">
          <Button size="sm" variant="outlined" :label="t('page.dev.extensibility.action.validate')" data-testid="validate-manifest" @click="validateManifest" />
          <Button size="sm" :label="t('page.dev.extensibility.action.register')" data-testid="register-manifest" @click="registerManifest" />
        </div>
        <div v-if="manifestChecked" class="manifest-result" :data-valid="manifestIssues.length === 0">
          <Tag :severity="manifestIssues.length ? 'danger' : 'success'">{{ t(manifestIssues.length ? LocaleKeys.error.validation : 'page.dev.extensibility.manifest.valid') }}</Tag>
          <ul v-if="manifestIssues.length">
            <li v-for="(issue, index) in manifestIssues" :key="`${issue.key}-${index}`">{{ tDyn(issue.key, issue.field ? { field: issue.field } : undefined) }}</li>
          </ul>
        </div>
      </Card>
    </div>

    <div class="preview-grid" data-testid="extension-preview">
      <Card :title="t('page.dev.extensibility.c1')">
        <div class="slot-matrix">
          <button v-for="name in slotNames" :key="name" type="button" class="slot-cell" :class="{ 'slot-cell--active': slotOverridden(name) }" :disabled="!isRendererEnabled('slot-pack')" :data-slot="name" :aria-pressed="slotOverridden(name)" @click="toggleSlot(name)">
            <code>#{{ name }}</code>
            <Tag size="xs" :severity="slotOverridden(name) ? 'success' : 'secondary'">{{ t(slotOverridden(name) ? 'page.dev.extensibility.state.override' : 'page.dev.extensibility.state.fallback') }}</Tag>
          </button>
        </div>
        <NamedSlotSurface :fallback="t('page.dev.extensibility.state.fallback')">
          <template v-if="slotOverridden('header')" #header>{{ t('page.dev.extensibility.state.override') }}</template>
          <template v-if="slotOverridden('prepend')" #prepend>{{ t('page.dev.extensibility.state.override') }}</template>
          <template v-if="slotOverridden('empty')" #empty>{{ t('page.dev.extensibility.state.override') }}</template>
          <template v-if="slotOverridden('footer')" #footer>{{ t('page.dev.extensibility.state.override') }}</template>
          <template v-if="slotOverridden('actions')" #actions>{{ t('page.dev.extensibility.state.override') }}</template>
        </NamedSlotSurface>
      </Card>

      <Card :title="t('page.dev.extensibility.c2')">
        <div class="render-grid">
          <DataTable :value="tableRows" :columns="tableColumns" :virtual="false" data-testid="cell-render-preview">
            <template #body-status="{ value, row }">
              <RenderOutlet v-if="isRendererEnabled('status-tag')" :renderer="renderStatus" :context="{ value, row }" />
              <span v-else>{{ t(value ? LocaleKeys.common.yes : LocaleKeys.common.no) }}</span>
            </template>
          </DataTable>
          <NodeSurface :nodes="treeNodes" :rich="isRendererEnabled('rich-node')" @select="addEvent(LocaleKeys.button.enter, $event.id)" />
        </div>
      </Card>

      <Card :title="t('page.dev.extensibility.c3')">
        <div class="wrapper-preview" :data-wrapper-enabled="isRendererEnabled('thin-action')">
          <code>props → Button → invoke</code>
          <ThinAction v-if="isRendererEnabled('thin-action')" :label="t(LocaleKeys.button.submit)" @invoke="invokeWrapper" />
          <Button v-else :label="t(LocaleKeys.button.submit)" @click="invokeWrapper" />
        </div>
      </Card>

      <Card :title="t('page.dev.extensibility.c4')">
        <div class="adapter-preview" :class="{ 'adapter-preview--active': adapterEnabled }" :data-adapter-enabled="adapterEnabled">
          <div class="adapter-swatch"><Icon name="Palette" /><code>--host-accent → --ds-accent</code></div>
          <div class="adapter-panel"><code>--host-surface → --ds-surface-raised</code></div>
        </div>
      </Card>
    </div>

    <Card :title="t('page.dev.extensibility.events.title')" data-testid="extension-events">
      <template #extra><Button size="xs" variant="text" icon="Trash2" :label="t(LocaleKeys.button.delete)" :disabled="!events.length" @click="events = []" /></template>
      <p v-if="!events.length" class="hint">{{ t(LocaleKeys.common.noData) }}</p>
      <ol v-else class="event-list">
        <li v-for="event in events" :key="event.id" :data-event-id="event.id"><time>{{ event.time }}</time><Tag size="xs">{{ tDyn(event.actionKey) }}</Tag><code>{{ event.target }}</code></li>
      </ol>
    </Card>
  </div>
</template>

<style scoped>
.extensibility-page { width: 100%; min-width: 0; display: flex; flex-direction: column; gap: var(--theme-section-gap); padding: var(--theme-page-pad); }
.top-grid, .preview-grid, .render-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--spacing-2xl) * 11)), 1fr)); gap: var(--theme-section-gap); align-items: start; }
.registry-list, .event-list { display: flex; flex-direction: column; gap: var(--spacing-sm); margin: 0; padding: 0; list-style: none; }
.registry-item { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--spacing-sm); align-items: center; padding: var(--spacing-sm); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); background: var(--surface-1); transition: border-color var(--transition-normal), background var(--transition-normal); }
.registry-item--selected { border-color: var(--ds-accent); background: var(--surface-2); }
.registry-select { min-width: 0; padding: 0; border: 0; background: transparent; color: var(--text-primary); text-align: start; cursor: pointer; }
.registry-select > span, .registry-actions, .manifest-actions, .wrapper-preview, .adapter-swatch, .event-list li { display: flex; align-items: center; flex-wrap: wrap; gap: var(--spacing-sm); }
.registry-select small { display: block; margin-top: var(--spacing-xs); overflow-wrap: anywhere; color: var(--text-secondary); font-size: var(--font-size-xs); }
.hint { margin: 0 0 var(--spacing-md); color: var(--text-secondary); font-size: var(--font-size-sm); line-height: var(--line-height-body); }
.manifest-input { width: 100%; min-height: calc(var(--height-xl) * 5); font-family: var(--font-family-mono); }
.manifest-actions { margin-top: var(--spacing-md); }
.manifest-result { margin-top: var(--spacing-md); padding: var(--spacing-sm); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); }
.manifest-result ul { margin: var(--spacing-sm) 0 0; padding-inline-start: var(--spacing-xl); color: var(--text-secondary); font-size: var(--font-size-sm); }
.file-input { display: none; }
.slot-matrix { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-2xl) * 4), 1fr)); gap: var(--spacing-sm); }
.slot-cell { display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-sm); padding: var(--spacing-md); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); background: var(--surface-1); color: var(--text-primary); cursor: pointer; }
.slot-cell--active { border-color: var(--ds-accent); background: var(--surface-2); }
.slot-cell:disabled { cursor: not-allowed; color: var(--text-muted); background: var(--surface-0); }
.slot-surface { display: grid; grid-template-columns: repeat(auto-fit, minmax(calc(var(--spacing-2xl) * 3), 1fr)); gap: var(--spacing-sm); margin-top: var(--spacing-md); }
.slot-region { display: flex; justify-content: space-between; gap: var(--spacing-sm); padding: var(--spacing-sm); border-inline-start: 1px solid var(--ds-accent); background: var(--surface-2); color: var(--text-secondary); }
.node-surface, .node-surface ul { margin: 0; padding: 0; list-style: none; }
.node-row { width: 100%; display: flex; align-items: center; gap: var(--spacing-sm); min-height: var(--height-md); padding-block: var(--spacing-xs); padding-inline-end: var(--spacing-sm); border: 0; border-bottom: 1px solid var(--ds-border); background: transparent; color: var(--text-primary); text-align: start; cursor: pointer; }
.wrapper-preview { justify-content: space-between; min-height: var(--height-xl); }
.adapter-preview { display: grid; gap: var(--spacing-md); padding: var(--theme-card-pad); border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); background: var(--surface-1); color: var(--text-primary); }
.adapter-preview--active { border-color: var(--ds-accent); background: var(--surface-2); }
.adapter-swatch { color: var(--text-muted); }
.adapter-preview--active .adapter-swatch { color: var(--ds-accent); }
.adapter-panel { padding: var(--spacing-md); border-inline-start: 1px solid var(--ds-border); background: var(--surface-2); }
.adapter-preview--active .adapter-panel { border-inline-start-color: var(--ds-accent); }
.event-list { max-height: calc(var(--height-xl) * 5); overflow: auto; }
.event-list li { padding: var(--spacing-sm); border-bottom: 1px solid var(--ds-border); color: var(--text-secondary); font-size: var(--font-size-sm); }
.event-list time { font-family: var(--font-family-mono); color: var(--text-muted); }
code { font-family: var(--font-family-mono); overflow-wrap: anywhere; }
</style>
