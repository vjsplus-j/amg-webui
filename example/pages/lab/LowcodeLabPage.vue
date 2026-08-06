<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Button,
  CanvasIo,
  CanvasPreview,
  CanvasShortcut,
  Card,
  DragCanvas,
  DragMaterial,
  InputText,
  PropPanel,
  SchemaRenderer,
  Tag
} from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import {
  createComponentRegistry,
  generateVueSfc,
  validateCanvasSchema,
  type CanvasSchema
} from '@amg-webui/lowcode'
import { CANVAS_SCHEMA_VERSION, createCanvasNode } from '@amg-webui/utils'
import ExamplePageHero from '../../components/ExamplePageHero.vue'

const { t } = useLocale()

const registry = createComponentRegistry([
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
    type: 'Button',
    label: 'Button',
    component: Button,
    group: 'general',
    defaultProps: { label: 'OK' },
    defaultSize: { w: 140, h: 48 },
    propsSchema: { label: { type: 'string', required: true } },
    events: ['click']
  },
  {
    type: 'InputText',
    label: 'Input',
    component: InputText,
    group: 'form',
    defaultProps: { placeholder: '…' },
    defaultSize: { w: 220, h: 48 }
  },
  {
    type: 'Tag',
    label: 'Tag',
    component: Tag,
    group: 'general',
    defaultProps: { label: 'Tag' },
    defaultSize: { w: 100, h: 40 }
  }
])

const materials = registry.toMaterials()

const card = createCanvasNode('Card', 'Card', {
  x: 24,
  y: 24,
  w: 280,
  h: 160,
  props: { title: 'Container' }
})
const nestedTag = createCanvasNode('Tag', 'Tag', {
  x: 16,
  y: 48,
  w: 100,
  h: 40,
  props: { label: 'Nested' },
  parentId: card.id
})
const primaryBtn = createCanvasNode('Button', 'Button', {
  x: 340,
  y: 24,
  w: 140,
  h: 48,
  props: { label: 'Primary' }
})

const nodes = ref([card, nestedTag, primaryBtn])
const selectedId = ref<string | null>(nodes.value[0]?.id ?? null)
const schema = computed<CanvasSchema>(() => ({
  version: CANVAS_SCHEMA_VERSION,
  mode: 'free',
  nodes: nodes.value
}))

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
  min-height: 18rem;
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
