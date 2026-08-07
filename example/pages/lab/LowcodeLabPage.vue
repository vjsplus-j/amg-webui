<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Alert, Button, Card, Divider, Tag } from '@amg-webui/core'
import { CanvasIo, CanvasPreview, CanvasShortcut, DragCanvas, DragMaterial, PropPanel, SchemaRenderer } from '@amg-webui/lowcode'
import { Checkbox, InputText, Switch, Textarea } from '@amg-webui/form'
import { useLocale } from '@amg-webui/hooks'
import {
  createComponentRegistry,
  generateVueSfc,
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  validateCanvasSchema,
  type CanvasSchema
} from '@amg-webui/lowcode'
import { CANVAS_SCHEMA_VERSION, createCanvasNode } from '@amg-webui/utils'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

/** Lab palette — still MVP sample set, not full catalog. */
const registry = createComponentRegistry(
  [
    {
      type: 'Card',
      label: 'Card',
      component: Card,
      group: 'layout',
      isContainer: true,
      defaultProps: {},
      defaultSize: { w: 280, h: 160 },
      propsSchema: { title: { type: 'string' } },
      events: ['click']
    },
    {
      type: 'Divider',
      label: 'Divider',
      component: Divider,
      group: 'layout',
      defaultSize: { w: 240, h: 24 },
      propsSchema: {
        direction: { type: 'enum', enum: ['horizontal', 'vertical'], title: 'Direction' }
      }
    },
    {
      type: 'Button',
      label: 'Button',
      component: Button,
      group: 'general',
      defaultProps: { label: 'OK' },
      defaultSize: { w: 140, h: 48 },
      propsSchema: {
        label: { type: 'string', required: true, title: 'Label' },
        severity: {
          type: 'enum',
          enum: ['default', 'primary', 'success', 'warning', 'danger'],
          title: 'Severity'
        }
      },
      events: ['click']
    },
    {
      type: 'Tag',
      label: 'Tag',
      component: Tag,
      group: 'general',
      defaultProps: { label: 'Tag' },
      defaultSize: { w: 100, h: 40 },
      propsSchema: { label: { type: 'string', required: true, title: 'Label' } }
    },
    {
      type: 'Alert',
      label: 'Alert',
      component: Alert,
      group: 'feedback',
      defaultProps: { title: 'Alert', severity: 'info' },
      defaultSize: { w: 280, h: 72 },
      propsSchema: {
        title: { type: 'string', title: 'Title' },
        severity: {
          type: 'enum',
          enum: ['success', 'warning', 'error', 'info'],
          title: 'Severity'
        }
      }
    },
    {
      type: 'InputText',
      label: 'Input',
      component: InputText,
      group: 'form',
      defaultProps: { placeholder: '…' },
      defaultSize: { w: 220, h: 48 },
      propsSchema: { placeholder: { type: 'string', title: 'Placeholder' } }
    },
    {
      type: 'Textarea',
      label: 'Textarea',
      component: Textarea,
      group: 'form',
      defaultProps: { modelValue: '' },
      defaultSize: { w: 240, h: 96 },
      propsSchema: { modelValue: { type: 'string', title: 'Value' } }
    },
    {
      type: 'Switch',
      label: 'Switch',
      component: Switch,
      group: 'form',
      defaultProps: { modelValue: false },
      defaultSize: { w: 64, h: 40 },
      propsSchema: { modelValue: { type: 'boolean', title: 'On' } },
      events: ['change']
    },
    {
      type: 'Checkbox',
      label: 'Checkbox',
      component: Checkbox,
      group: 'form',
      defaultProps: { modelValue: false, label: 'Check' },
      defaultSize: { w: 160, h: 40 },
      propsSchema: {
        label: { type: 'string', title: 'Label' },
        modelValue: { type: 'boolean', title: 'Checked' }
      },
      events: ['change']
    }
  ],
  { onConflict: 'throw' }
)

const materials = registry.toMaterials()

/** Three-level nest + two clear root siblings (no coordinate pile-up). */
const outer = createCanvasNode('Card', 'Outer', {
  x: 24,
  y: 24,
  w: 320,
  h: 260,
  props: { title: 'Container' }
})
const mid = createCanvasNode('Card', 'Mid', {
  x: 0,
  y: 0,
  w: 260,
  h: 160,
  props: { title: 'Card' },
  parentId: outer.id
})
const deepBtn = createCanvasNode('Button', 'Deep', {
  x: 0,
  y: 0,
  w: 120,
  h: 40,
  props: {
    label: 'Deep',
    [LOWCODE_EVENTS_KEY]: { click: 'onDeepClick' }
  },
  parentId: mid.id
})
const boundInput = createCanvasNode('InputText', 'Bound', {
  x: 380,
  y: 24,
  w: 220,
  h: 48,
  props: {
    [LOWCODE_BINDINGS_KEY]: { modelValue: 'form.title' }
  }
})
const primaryBtn = createCanvasNode('Button', 'Button', {
  x: 380,
  y: 100,
  w: 140,
  h: 48,
  props: {
    label: 'Primary',
    [LOWCODE_EVENTS_KEY]: { click: 'onPrimaryClick' }
  }
})

const nodes = ref([outer, mid, deepBtn, boundInput, primaryBtn])
const selectedId = ref<string | null>(nodes.value[0]?.id ?? null)
const schema = computed<CanvasSchema>(() => ({
  version: CANVAS_SCHEMA_VERSION,
  mode: 'free',
  nodes: nodes.value
}))

/** Shared with SchemaRenderer + codegen paths (`form.title`). */
const renderContext = reactive({
  form: { title: 'Bound' }
})

const handlers = {
  onDeepClick: () => {
    renderContext.form.title = `${renderContext.form.title}*`
  },
  onPrimaryClick: () => {
    renderContext.form.title = 'Primary'
  }
}

const validation = computed(() =>
  validateCanvasSchema(schema.value, { registry, checkRequiredProps: true })
)
const generated = computed(() => generateVueSfc(schema.value, { registry }))

function onImport(next: CanvasSchema) {
  nodes.value = next.nodes
}

watch(
  nodes,
  () => {
    if (selectedId.value && !nodes.value.some((n) => n.id === selectedId.value)) {
      selectedId.value = nodes.value[0]?.id ?? null
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="lab-lowcode">
    <ExamplePageHero title-key="page.lab.lowcode.title" lead-key="page.lab.lowcode.lead" />

    <div class="lab-lowcode__workspace">
      <DragMaterial :materials="materials" />
      <DragCanvas
        v-model="nodes"
        :materials="materials"
        :registry="registry"
        render-mode="component"
        class="lab-lowcode__drag"
      >
        <div class="lab-lowcode__side">
          <PropPanel :registry="registry" />
          <CanvasIo :schema="schema" @import="onImport" />
          <CanvasShortcut />
        </div>
      </DragCanvas>
    </div>

    <div class="lab-lowcode__grid">
      <Card :title="t('component.schema-renderer.title')">
        <SchemaRenderer
          :schema="schema"
          :registry="registry"
          render-mode="component"
          :selected-id="selectedId"
          :context="renderContext"
          :handlers="handlers"
          @select="selectedId = $event"
        />
      </Card>
      <Card :title="t('component.canvas-preview.title')">
        <CanvasPreview
          v-model="selectedId"
          :nodes="nodes"
          :registry="registry"
          render-mode="component"
          :canvas-width="640"
          :canvas-height="320"
        />
      </Card>
      <Card :title="t('page.lab.lowcode.validateTitle')">
        <p>
          {{
            validation.ok
              ? t('page.lab.lowcode.validationOk')
              : t('page.lab.lowcode.validationFail')
          }}
          · {{ validation.issues.length }}
        </p>
        <ul>
          <li v-for="(issue, i) in validation.issues" :key="i">
            {{ issue.code }} @ {{ issue.path }} — {{ issue.message }}
          </li>
        </ul>
      </Card>
      <Card :title="t('page.lab.lowcode.codegenTitle')">
        <pre class="lab-lowcode__code">{{ generated }}</pre>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.lab-lowcode__workspace {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: var(--spacing-md);
  min-height: 18rem;
  width: 100%;
  min-width: 0;
  margin-bottom: var(--theme-section-gap);
}

.lab-lowcode__drag {
  display: grid;
  grid-template-columns: 1fr 14rem;
  gap: var(--spacing-md);
  min-width: 0;
}

.lab-lowcode__drag :deep(.vp-drag-canvas__surface) {
  min-height: 22rem;
  position: relative;
}

.lab-lowcode__side {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  min-width: 0;
}

.lab-lowcode__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: var(--theme-section-gap);
  width: 100%;
  min-width: 0;
}

.lab-lowcode__code {
  margin: 0;
  max-height: 20rem;
  overflow: auto;
  padding: var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  white-space: pre-wrap;
  word-break: break-word;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-0, var(--surface-1));
}

@media (max-width: 60rem) {
  .lab-lowcode__workspace,
  .lab-lowcode__drag {
    grid-template-columns: 1fr;
  }
}
</style>
