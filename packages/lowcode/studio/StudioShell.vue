<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Button } from '@amg-webui/core'
import { InputText } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import { createLowcodeEditor } from '../editor'
import {
  createStudioMaterials,
  createStudioRegistry,
  type LowcodeMaterial
} from '../materials'
import { createPageRuntime } from '../runtime'
import {
  createEmptyDocument,
  createUserManagementTemplate,
  documentToSchema,
  exportDocumentJson,
  importDocumentJson,
  loadDocumentLocal,
  saveDocumentLocal,
  type LowcodeDocument
} from '../document'
import { generateVueSfc, assertGeneratedSfcShape } from '../codegen'
import SchemaRenderer from '../ui/SchemaRenderer/index.vue'
import EditorCanvas from './EditorCanvas.vue'
import StudioInspector from './StudioInspector.vue'
import './studio.scss'

const props = withDefaults(
  defineProps<{
    storageKey?: string
  }>(),
  { storageKey: 'draft' }
)

const { t } = useLocale()
const materials = createStudioMaterials() as LowcodeMaterial[]
const registry = createStudioRegistry('replace')

const doc = ref<LowcodeDocument>(createEmptyDocument(t('lowcode.studio.untitled')))
const preview = ref(false)
const breakpoint = ref<'pc' | 'tablet' | 'mobile'>('pc')
const codegenText = ref('')
const toast = ref('')

const editor = createLowcodeEditor({
  nodes: [],
  mode: 'free',
  onChange: () => {
    doc.value = {
      ...doc.value,
      nodes: editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } })),
      updatedAt: new Date().toISOString()
    }
  }
})

const runtime = createPageRuntime({
  initial: {
    state: { keyword: '', createOpen: false },
    form: { name: '' },
    data: {},
    page: { name: doc.value.name }
  },
  onMessage: (m) => {
    toast.value = m.message
    window.setTimeout(() => {
      toast.value = ''
    }, 2400)
  }
})

const grouped = computed(() => {
  const map = new Map<string, LowcodeMaterial[]>()
  for (const m of materials) {
    const g = m.category || 'general'
    if (!map.has(g)) map.set(g, [])
    map.get(g)!.push(m)
  }
  return [...map.entries()]
})

const selectedLabel = computed(() => {
  const n = editor.selectedNodes.value[0]
  return n ? `${n.type} · ${n.id}` : t('lowcode.studio.status.none')
})

const zoomPct = computed(() => Math.round(editor.viewport.zoom.value * 100))

function syncDocToEditor(next: LowcodeDocument) {
  doc.value = next
  breakpoint.value = next.page.breakpoint ?? 'pc'
  editor.document.mode.value = next.page.mode
  editor.document.replaceAll(next.nodes)
  editor.selection.clear()
  runtime.dataSources.value = [...next.dataSources]
  for (const ds of next.dataSources) {
    runtime.registerDataSource(ds)
  }
  Object.assign(runtime.context.state, {
    keyword: '',
    createOpen: false,
    ...next.variables
  })
}

function setBreakpoint(bp: 'pc' | 'tablet' | 'mobile') {
  breakpoint.value = bp
  doc.value = {
    ...doc.value,
    page: { ...doc.value.page, breakpoint: bp }
  }
  // Viewport width hint for design surface
  const widths = { pc: 1, tablet: 0.85, mobile: 0.55 }
  editor.viewport.setZoom(widths[bp])
}

function onActionsUpdate(actions: LowcodeDocument['actions']) {
  doc.value = { ...doc.value, actions }
}

function onDataSourcesUpdate(dataSources: LowcodeDocument['dataSources']) {
  doc.value = { ...doc.value, dataSources }
  for (const ds of dataSources) runtime.registerDataSource(ds)
}

function generateCode() {
  const schema = documentToSchema({
    ...doc.value,
    nodes: editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } }))
  })
  codegenText.value = generateVueSfc(schema, {
    registry,
    componentName: 'GeneratedPage',
    actions: doc.value.actions,
    dataSources: doc.value.dataSources,
    initialContext: {
      state: { keyword: '', createOpen: false, ...doc.value.variables },
      form: { name: '' }
    }
  })
  const check = assertGeneratedSfcShape(codegenText.value)
  toast.value = check.ok
    ? t('lowcode.studio.codegenOk')
    : t('lowcode.studio.codegenFail')
  window.setTimeout(() => {
    toast.value = ''
  }, 2000)
}

function loadTemplate() {
  const tpl = createUserManagementTemplate()
  tpl.name = t('lowcode.studio.template.users')
  syncDocToEditor(tpl)
  void runtime.runDataSource('queryUsers').catch(() => undefined)
  save()
}

function newBlank() {
  syncDocToEditor(createEmptyDocument(t('lowcode.studio.untitled')))
  save()
}

function save() {
  doc.value = {
    ...doc.value,
    name: doc.value.name,
    nodes: editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } })),
    page: { ...doc.value.page, breakpoint: breakpoint.value },
    updatedAt: new Date().toISOString()
  }
  saveDocumentLocal(doc.value, props.storageKey)
  toast.value = t('lowcode.studio.saved')
  window.setTimeout(() => {
    toast.value = ''
  }, 1600)
}

function togglePreview() {
  preview.value = !preview.value
  if (preview.value) {
    // Ensure mock data
    void runtime.runDataSource('queryUsers').catch(() => undefined)
  }
}

const actionHandlers = computed(() => runtime.handlersFromActions(doc.value.actions))

function exportJson() {
  const text = exportDocumentJson({
    ...doc.value,
    nodes: editor.nodes.value.map((n) => ({ ...n, props: { ...n.props } }))
  })
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${doc.value.name || 'document'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importJson(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const next = importDocumentJson(String(reader.result))
      syncDocToEditor(next)
      save()
    } catch {
      toast.value = t('lowcode.studio.importFail')
    }
  }
  reader.readAsText(file)
}

function onImportChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) importJson(file)
  input.value = ''
}

function onMaterialDragStart(e: DragEvent, m: LowcodeMaterial) {
  if (!e.dataTransfer) return
  e.dataTransfer.setData('application/vp-material-type', m.type)
  e.dataTransfer.setData('application/vp-material-label', m.title)
  e.dataTransfer.setData(
    'application/vp-material',
    JSON.stringify({
      defaultProps: m.defaultProps,
      defaultSize: m.defaultSize,
      label: m.title
    })
  )
  e.dataTransfer.effectAllowed = 'copy'
}

function selectOutline(id: string) {
  editor.selection.select(id)
}

let autoSaveTimer: number | undefined
watch(
  () => editor.nodes.value,
  () => {
    window.clearTimeout(autoSaveTimer)
    autoSaveTimer = window.setTimeout(() => save(), 2000)
  },
  { deep: true }
)

onMounted(() => {
  const existing = loadDocumentLocal(props.storageKey)
  if (existing && existing.nodes.length) {
    syncDocToEditor(existing)
  } else {
    loadTemplate()
  }
})

onUnmounted(() => {
  window.clearTimeout(autoSaveTimer)
  editor.dispose()
})

const checklist = reactive(
  Array.from({ length: 19 }, (_, i) => ({ id: i + 1, done: false }))
)

const fileInput = ref<HTMLInputElement | null>(null)
</script>

<template>
  <div class="vp-studio-shell" data-testid="lowcode-studio">
    <header class="vp-studio-shell__toolbar">
      <InputText
        v-model="doc.name"
        class="vp-studio-shell__toolbar-title"
        @change="save"
      />
      <div class="vp-studio-shell__toolbar-actions">
        <Button
          :label="t('lowcode.studio.breakpoint.pc')"
          :severity="breakpoint === 'pc' ? 'primary' : 'default'"
          size="sm"
          @click="setBreakpoint('pc')"
        />
        <Button
          :label="t('lowcode.studio.breakpoint.tablet')"
          :severity="breakpoint === 'tablet' ? 'primary' : 'default'"
          size="sm"
          @click="setBreakpoint('tablet')"
        />
        <Button
          :label="t('lowcode.studio.breakpoint.mobile')"
          :severity="breakpoint === 'mobile' ? 'primary' : 'default'"
          size="sm"
          @click="setBreakpoint('mobile')"
        />
        <Button
          :label="t('lowcode.studio.align.left')"
          size="sm"
          @click="editor.alignSelection('left')"
        />
        <Button
          :label="t('lowcode.studio.align.center')"
          size="sm"
          @click="editor.alignSelection('center')"
        />
        <Button
          :label="t('lowcode.studio.distribute.h')"
          size="sm"
          @click="editor.distributeSelection('horizontal')"
        />
        <Button
          :label="t('lowcode.studio.undo')"
          size="sm"
          :disabled="!editor.canUndo.value"
          @click="editor.commands.undo()"
        />
        <Button
          :label="t('lowcode.studio.redo')"
          size="sm"
          :disabled="!editor.canRedo.value"
          @click="editor.commands.redo()"
        />
        <span data-testid="studio-action-preview">
          <Button
            :label="preview ? t('lowcode.studio.edit') : t('lowcode.studio.preview')"
            size="sm"
            severity="primary"
            @click="togglePreview"
          />
        </span>
        <span data-testid="studio-action-save">
          <Button :label="t('lowcode.studio.save')" size="sm" @click="save" />
        </span>
        <span data-testid="studio-action-export">
          <Button :label="t('lowcode.studio.export')" size="sm" @click="exportJson" />
        </span>
        <span data-testid="studio-action-import">
          <Button :label="t('lowcode.studio.import')" size="sm" @click="fileInput?.click()" />
        </span>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          hidden
          data-testid="studio-import-input"
          @change="onImportChange"
        />
        <span data-testid="studio-action-codegen">
          <Button :label="t('lowcode.studio.codegen')" size="sm" @click="generateCode" />
        </span>
        <span data-testid="studio-action-template">
          <Button :label="t('lowcode.studio.template.users')" size="sm" @click="loadTemplate" />
        </span>
        <span data-testid="studio-action-blank">
          <Button :label="t('lowcode.studio.blank')" size="sm" @click="newBlank" />
        </span>
      </div>
    </header>

    <aside class="vp-studio-shell__left">
      <div class="vp-studio-shell__palette">
        <template v-for="[group, list] in grouped" :key="group">
          <div class="vp-studio-material__group">{{ group }}</div>
          <div
            v-for="m in list"
            :key="m.type"
            class="vp-studio-material"
            draggable="true"
            :data-testid="`material-${m.type}`"
            @dragstart="onMaterialDragStart($event, m)"
          >
            {{ m.title }}
          </div>
        </template>
      </div>
      <div class="vp-studio-shell__outline">
        <div
          class="vp-studio-material__group"
          data-testid="studio-outline-header"
          @click="editor.selection.clear()"
        >
          {{ t('lowcode.studio.outline') }}
        </div>
        <button
          v-for="n in editor.nodes.value"
          :key="n.id"
          type="button"
          class="vp-studio-outline__item"
          :class="{
            'is-selected': editor.selection.isSelected(n.id),
            'is-nested': Boolean(n.parentId)
          }"
          @click="selectOutline(n.id)"
        >
          {{ n.type }} — {{ n.label }}
        </button>
      </div>
    </aside>

    <main class="vp-studio-shell__canvas">
      <EditorCanvas
        v-show="!preview"
        :editor="editor"
        :registry="registry"
        :materials="materials"
        :context="runtime.context"
        :handlers="actionHandlers"
      />
      <div v-if="preview" class="vp-studio-preview-layer" data-testid="studio-preview-layer">
        <SchemaRenderer
          :schema="documentToSchema({ ...doc, nodes: editor.nodes.value })"
          :registry="registry"
          render-mode="component"
          :context="runtime.context"
          :handlers="actionHandlers"
        />
      </div>
      <div v-if="toast" class="vp-studio-toast">{{ toast }}</div>
    </main>

    <div class="vp-studio-shell__right">
      <StudioInspector
        :editor="editor"
        :registry="registry"
        :materials="materials"
        :runtime="runtime"
        :actions="doc.actions"
        :data-sources="doc.dataSources"
        @update:actions="onActionsUpdate"
        @update:data-sources="onDataSourcesUpdate"
      />
      <div v-if="codegenText" class="vp-studio-checklist">
        <div class="vp-studio-material__group">{{ t('lowcode.studio.codegen') }}</div>
        <pre class="vp-studio-code" data-testid="studio-codegen-output">{{ codegenText }}</pre>
      </div>
      <div class="vp-studio-checklist">
        <div class="vp-studio-material__group">{{ t('lowcode.studio.checklist') }}</div>
        <label v-for="c in checklist" :key="c.id">
          <input v-model="c.done" type="checkbox" />
          {{ t(`lowcode.studio.check.${c.id}` as 'lowcode.studio.check.1') }}
        </label>
      </div>
    </div>

    <footer class="vp-studio-shell__status">
      <span>{{ zoomPct }}%</span>
      <Button :label="t('lowcode.studio.zoomIn')" size="sm" @click="editor.viewport.zoomBy(0.1)" />
      <Button :label="t('lowcode.studio.zoomOut')" size="sm" @click="editor.viewport.zoomBy(-0.1)" />
      <Button :label="t('lowcode.studio.zoomReset')" size="sm" @click="editor.viewport.reset()" />
      <span>{{ selectedLabel }}</span>
      <span data-testid="studio-node-count">{{ editor.nodes.value.length }} nodes</span>
    </footer>
  </div>
</template>

<style scoped>
.vp-studio-toast {
  position: absolute;
  inset-block-end: var(--spacing-lg);
  inset-inline-start: 50%;
  transform: translateX(-50%);
  z-index: 40;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-sm);
}

.vp-studio-shell__canvas {
  position: relative;
}
</style>
