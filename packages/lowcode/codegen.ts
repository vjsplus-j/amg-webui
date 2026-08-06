import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import { buildCanvasTree, type CanvasTreeNode } from './tree'
import {
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  type CodegenOptions,
  type ComponentRegistry,
  type LowcodeBindings,
  type LowcodeEvents
} from './types'

function serializePropValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function splitMetaProps(props: Record<string, unknown>): {
  attrs: Record<string, unknown>
  bindings: LowcodeBindings
  events: LowcodeEvents
} {
  const attrs: Record<string, unknown> = {}
  let bindings: LowcodeBindings = {}
  let events: LowcodeEvents = {}
  for (const [key, value] of Object.entries(props)) {
    if (key === LOWCODE_BINDINGS_KEY && value && typeof value === 'object') {
      bindings = value as LowcodeBindings
      continue
    }
    if (key === LOWCODE_EVENTS_KEY && value && typeof value === 'object') {
      events = value as LowcodeEvents
      continue
    }
    attrs[key] = value
  }
  return { attrs, bindings, events }
}

function propsToAttrs(props: Record<string, unknown>, bindings: LowcodeBindings, events: LowcodeEvents): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue
    if (bindings[key]) continue
    if (typeof value === 'boolean') {
      if (value) parts.push(key)
      else parts.push(`:${key}="false"`)
      continue
    }
    if (typeof value === 'string') {
      parts.push(`${key}=${JSON.stringify(value)}`)
      continue
    }
    parts.push(`:${key}='${serializePropValue(value)}'`)
  }
  for (const [key, expr] of Object.entries(bindings)) {
    if (!expr) continue
    if (key === 'modelValue' || key === 'model-value') parts.push(`v-model="${expr}"`)
    else parts.push(`:${key}="${expr}"`)
  }
  for (const [event, handler] of Object.entries(events)) {
    if (!handler) continue
    parts.push(`@${event}="${handler}"`)
  }
  return parts.length ? ` ${parts.join(' ')}` : ''
}

function layoutStyle(node: CanvasNodeData, mode: CanvasSchema['mode'], nested: boolean): string {
  if (mode === 'grid') {
    const col = (node.col ?? 0) + 1
    const span = Math.max(1, node.colSpan ?? 1)
    const row = (node.row ?? 0) + 1
    const rowSpan = Math.max(1, node.rowSpan ?? 1)
    return `grid-column:${col}/span ${span};grid-row:${row}/span ${rowSpan};`
  }
  if (nested) {
    return `position:relative;width:${node.w}px;min-height:${node.h}px;`
  }
  return `position:absolute;left:${node.x}px;top:${node.y}px;width:${node.w}px;height:${node.h}px;z-index:${node.zIndex ?? 1};`
}

function resolveExportName(type: string, registry?: ComponentRegistry): string {
  return registry?.get(type)?.exportName ?? type
}

function resolveImportFrom(type: string, registry?: ComponentRegistry): string {
  return registry?.get(type)?.importFrom ?? '@amg-webui/components/base'
}

function renderTreeNode(
  node: CanvasTreeNode,
  schema: CanvasSchema,
  options: CodegenOptions,
  indent: string,
  nested: boolean
): string {
  const exp = resolveExportName(node.type, options.registry)
  const { attrs, bindings, events } = splitMetaProps(node.props ?? {})
  const meta = options.registry?.get(node.type)
  // Auto-stub declared events if not wired
  const mergedEvents = { ...events }
  for (const ev of meta?.events ?? []) {
    if (!mergedEvents[ev]) mergedEvents[ev] = `on${node.type}${ev[0]!.toUpperCase()}${ev.slice(1)}`
  }
  const attrStr = propsToAttrs(attrs, bindings, mergedEvents)
  const style =
    options.includeLayoutStyles !== false ? ` style="${layoutStyle(node, schema.mode, nested)}"` : ''
  if (!node.children.length) {
    return `${indent}<${exp}${attrStr}${style} />`
  }
  const kids = node.children
    .map((c) => renderTreeNode(c, schema, options, `${indent}  `, true))
    .join('\n')
  return `${indent}<div class="vp-generated-container"${style}>\n${indent}  <${exp}${attrStr} />\n${kids}\n${indent}</div>`
}

/**
 * Generate a Vue SFC string from a canvas schema (docs drag → Vue codegen track).
 * Does not eval; output is static source text only. Honors parentId nesting + bindings/events.
 */
export function generateVueSfc(schema: CanvasSchema, options: CodegenOptions = {}): string {
  const name = options.componentName ?? 'GeneratedCanvas'
  const scriptSetup = options.scriptSetup !== false
  const nodes = schema.nodes.filter((n) => !n.hidden)
  const tree = buildCanvasTree(nodes)

  const importMap = new Map<string, Set<string>>()
  const handlers = new Set<string>()
  for (const node of nodes) {
    const from = resolveImportFrom(node.type, options.registry)
    const exp = resolveExportName(node.type, options.registry)
    if (!importMap.has(from)) importMap.set(from, new Set())
    importMap.get(from)!.add(exp)
    const { events } = splitMetaProps(node.props ?? {})
    const meta = options.registry?.get(node.type)
    for (const ev of meta?.events ?? []) {
      handlers.add(`on${node.type}${ev[0]!.toUpperCase()}${ev.slice(1)}`)
    }
    for (const handler of Object.values(events)) {
      if (handler) handlers.add(handler)
    }
  }

  const importLines = [...importMap.entries()]
    .map(([from, names]) => `import { ${[...names].sort().join(', ')} } from '${from}'`)
    .join('\n')

  const handlerLines = [...handlers]
    .sort()
    .map((h) => `function ${h}() {\n  // TODO: wire ${h}\n}`)
    .join('\n\n')

  const nodeLines = tree.map((n) => renderTreeNode(n, schema, options, '    ', false)).join('\n')

  const rootClass =
    schema.mode === 'grid' ? 'vp-generated-canvas vp-generated-canvas--grid' : 'vp-generated-canvas'
  const rootStyle =
    schema.mode === 'grid'
      ? ' style="display:grid;grid-template-columns:repeat(24,1fr);gap:var(--spacing-md);position:relative;min-height:20rem;"'
      : ' style="position:relative;min-height:20rem;"'

  const scriptBody = [importLines, handlerLines].filter(Boolean).join('\n\n')

  if (scriptSetup) {
    return `<script setup lang="ts">
${scriptBody}
</script>

<template>
  <div class="${rootClass}"${rootStyle}>
${nodeLines}
  </div>
</template>
`
  }

  return `<script lang="ts">
import { defineComponent } from 'vue'
${importLines}

export default defineComponent({
  name: '${name}',
  components: { ${[...new Set(nodes.map((n) => resolveExportName(n.type, options.registry)))].join(', ')} },
  methods: {
${[...handlers].map((h) => `    ${h}() { /* TODO */ }`).join(',\n')}
  }
})
</script>

<template>
  <div class="${rootClass}"${rootStyle}>
${nodeLines}
  </div>
</template>
`
}

/** Template fragment only (no script). */
export function generateVueTemplate(schema: CanvasSchema, options: CodegenOptions = {}): string {
  const sfc = generateVueSfc(schema, options)
  const match = sfc.match(/<template>([\s\S]*?)<\/template>/)
  return match?.[1]?.trim() ?? ''
}
