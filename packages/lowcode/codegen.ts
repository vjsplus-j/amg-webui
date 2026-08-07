import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import type { CanvasNodeData, CanvasSchema } from '@amg-webui/utils'
import { splitMetaProps } from './meta'
import type { DataSourceDef, LowcodeAction, PageContext } from './runtime'
import { buildCanvasTree, type CanvasTreeNode } from './tree'
import type {
  CodegenOptions,
  ComponentRegistry,
  LowcodeBindings,
  LowcodeEvents
} from './types'

function serializePropValue(value: unknown): string {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  return JSON.stringify(value)
}

function propsToAttrs(
  props: Record<string, unknown>,
  bindings: LowcodeBindings,
  events: LowcodeEvents
): string {
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
  return registry?.get(type)?.importFrom ?? '@amg-webui/core'
}

/** Map schema event names to valid JS identifier suffixes (`update:modelValue` → `UpdateModelValue`). */
function eventToHandlerSuffix(event: string): string {
  const parts = event.split(/[:.]/)
  return parts
    .map((part, index) => {
      const camel = part.replace(/-([a-zA-Z])/g, (_, c: string) => c.toUpperCase())
      if (index === 0) {
        return camel.charAt(0).toUpperCase() + camel.slice(1)
      }
      return camel.charAt(0).toUpperCase() + camel.slice(1)
    })
    .join('')
}

function defaultHandlerName(nodeType: string, event: string): string {
  return `on${nodeType}${eventToHandlerSuffix(event)}`
}

function serializeJson(value: unknown, indent = 2): string {
  return JSON.stringify(value, null, indent)
}

function renderActionChainBody(actions: LowcodeAction[] | undefined): string {
  if (!actions?.length) return '  // no document actions'
  return `  void runtime.runActionChain(${serializeJson(actions)})`
}

function renderHandlerFn(name: string, actions: LowcodeAction[] | undefined): string {
  return `function ${name}(): void {\n${renderActionChainBody(actions)}\n}`
}

function collectContextPaths(nodes: CanvasNodeData[]): Partial<PageContext> {
  const paths = new Set<string>()
  for (const node of nodes) {
    const { bindings } = splitMetaProps(node.props ?? {})
    for (const expr of Object.values(bindings)) {
      if (expr) paths.add(expr.split('.')[0] ?? expr)
    }
  }
  const initial: Partial<PageContext> = {}
  for (const root of paths) {
    if (root === 'state' || root === 'form' || root === 'data' || root === 'page' || root === 'route' || root === 'user' || root === 'env') {
      if (!(initial as Record<string, unknown>)[root]) {
        ;(initial as Record<string, Record<string, unknown>>)[root] = {}
      }
    }
  }
  return initial
}

function renderRuntimeBootstrap(options: CodegenOptions, nodes: CanvasNodeData[]): string {
  const dataSources: DataSourceDef[] = options.dataSources ?? []
  const initial = {
    ...collectContextPaths(nodes),
    ...(options.initialContext ?? {})
  }
  const lines = [
    "import { createPageRuntime } from '@amg-webui/lowcode'",
    '',
    'const runtime = createPageRuntime({',
    `  initial: ${serializeJson(initial)},`,
    `  dataSources: ${serializeJson(dataSources)}`,
    '})',
    '',
    'const { state, form, data, page, route, user, env } = runtime.context'
  ]
  return lines.join('\n')
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
  const mergedEvents = { ...events }
  for (const ev of meta?.events ?? []) {
    if (!mergedEvents[ev]) mergedEvents[ev] = defaultHandlerName(node.type, ev)
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
 * Generate a Vue SFC string from a canvas schema.
 * Does not eval; output is static source text only.
 */
export function generateVueSfc(schema: CanvasSchema, options: CodegenOptions = {}): string {
  const name = options.componentName ?? 'GeneratedCanvas'
  const scriptSetup = options.scriptSetup !== false
  const nodes = schema.nodes.filter((n) => !n.hidden)
  const tree = buildCanvasTree(nodes)
  const actionMap = options.actions ?? {}

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
      handlers.add(defaultHandlerName(node.type, ev))
    }
    for (const handler of Object.values(events)) {
      if (handler) handlers.add(handler)
    }
  }
  for (const key of Object.keys(actionMap)) handlers.add(key)

  const importLines = [...importMap.entries()]
    .map(([from, names]) => `import { ${[...names].sort().join(', ')} } from '${from}'`)
    .join('\n')

  const runtimeBootstrap = renderRuntimeBootstrap(options, nodes)
  const handlerLines = [...handlers]
    .sort()
    .map((h) => renderHandlerFn(h, actionMap[h]))
    .join('\n\n')

  const nodeLines = tree.map((n) => renderTreeNode(n, schema, options, '    ', false)).join('\n')

  const rootClass =
    schema.mode === 'grid' ? 'vp-generated-canvas vp-generated-canvas--grid' : 'vp-generated-canvas'
  const rootStyle =
    schema.mode === 'grid'
      ? ' style="display:grid;grid-template-columns:repeat(24,1fr);gap:var(--spacing-md);position:relative;min-height:20rem;"'
      : ' style="position:relative;min-height:20rem;"'

  const scriptBody = [importLines, runtimeBootstrap, handlerLines].filter(Boolean).join('\n\n')

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

${runtimeBootstrap.replace("import { createPageRuntime } from '@amg-webui/lowcode'\n\n", "import { createPageRuntime } from '@amg-webui/lowcode'\n")}

export default defineComponent({
  name: '${name}',
  components: { ${[...new Set(nodes.map((n) => resolveExportName(n.type, options.registry)))].join(', ')} },
  setup() {
${[...handlers]
  .sort()
  .map((h) => `    function ${h}(): void {\n${renderActionChainBody(actionMap[h]).replace(/^/gm, '      ')}\n    }`)
  .join('\n\n')}
    return { runtime, state, form, data, page, route, user, env, ${[...handlers].sort().join(', ')} }
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

/**
 * Structural + real @vue/compiler-sfc compile validation for generated SFC.
 * PASS only when parse + compileScript + compileTemplate succeed and no comment-only actions.
 */
export function assertGeneratedSfcShape(sfc: string): { ok: boolean; issues: string[] } {
  const issues: string[] = []
  if (!sfc.includes('<script')) issues.push('missing-script')
  if (!sfc.includes('<template>')) issues.push('missing-template')
  if (/\/\/\s*TODO:\s*wire/.test(sfc)) issues.push('todo-stubs')
  if (/\/\/\s*action:\s/.test(sfc)) issues.push('comment-only-actions')
  const openScript = (sfc.match(/<script[\s>]/g) || []).length
  const closeScript = (sfc.match(/<\/script>/g) || []).length
  if (openScript !== closeScript) issues.push('unbalanced-script')

  try {
    const { descriptor, errors } = parse(sfc, { filename: 'Generated.vue' })
    for (const err of errors) issues.push(`compiler-sfc: ${err.message}`)
    if (!descriptor.template) issues.push('compiler-sfc: missing-template-block')
    if (!descriptor.script && !descriptor.scriptSetup) issues.push('compiler-sfc: missing-script-block')

    if (descriptor.script || descriptor.scriptSetup) {
      try {
        compileScript(descriptor, { id: 'generated-sfc' })
      } catch (e) {
        issues.push(
          `compileScript: ${e instanceof Error ? e.message : String(e)}`
        )
      }
    }

    if (descriptor.template) {
      const tpl = compileTemplate({
        source: descriptor.template.content,
        filename: 'Generated.vue',
        id: 'generated-sfc',
        compilerOptions: { mode: 'module' }
      })
      if (tpl.errors?.length) {
        for (const err of tpl.errors) {
          issues.push(
            `compileTemplate: ${typeof err === 'string' ? err : (err as Error).message || String(err)}`
          )
        }
      }
      if (!tpl.code) issues.push('compileTemplate: empty-code')
    }
  } catch (e) {
    issues.push(`compiler-sfc: ${e instanceof Error ? e.message : String(e)}`)
  }

  return { ok: issues.length === 0, issues }
}
