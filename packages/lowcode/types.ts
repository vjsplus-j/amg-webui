import type { Component } from 'vue'
import type { CanvasMaterialItem, CanvasNodeData, CanvasSchema } from '@amg-webui/utils'

/** JSON-Schema-ish prop descriptor for a low-code material. */
export interface LowcodePropSchema {
  type: 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array'
  title?: string
  description?: string
  default?: unknown
  enum?: readonly (string | number)[]
  required?: boolean
}

export interface LowcodeComponentMeta {
  /** Stable material / node type id (e.g. `Button`, `InputText`). */
  type: string
  /** Display label for palette. */
  label: string
  group?: string
  /** Vue component to mount when rendering schema. */
  component: Component
  /** Prop bag defaults applied on drop. */
  defaultProps?: Record<string, unknown>
  defaultSize?: { w: number; h: number }
  /** Lightweight JSON Schema for PropPanel / docs. */
  propsSchema?: Record<string, LowcodePropSchema>
  /** Preferred import specifier for codegen (default `@amg-webui/core`). */
  importFrom?: string
  /** Export name used in codegen (defaults to `type`). */
  exportName?: string
  /** Declared events for codegen stubs (e.g. `click` → `@click="onNodeClick"`). */
  events?: readonly string[]
  /** When true, node may host children (`parentId` targets). */
  isContainer?: boolean
}

/** Per-node binding / event wiring stored on CanvasNodeData.props under reserved keys. */
export const LOWCODE_BINDINGS_KEY = '__bindings'
export const LOWCODE_EVENTS_KEY = '__events'

export type LowcodeBindings = Record<string, string>
export type LowcodeEvents = Record<string, string>

/** Policy when `register()` hits an existing `type`. Default: `throw`. */
export type RegistryConflictPolicy = 'throw' | 'skip' | 'replace'

export interface CreateComponentRegistryOptions {
  onConflict?: RegistryConflictPolicy
}

export interface RegistryRegisterResult {
  registered: string[]
  skipped: string[]
  replaced: string[]
}

export interface ComponentRegistry {
  /** Register materials. Conflict policy from `createComponentRegistry` (default throw). */
  register(meta: LowcodeComponentMeta | LowcodeComponentMeta[]): RegistryRegisterResult
  unregister(type: string): void
  has(type: string): boolean
  get(type: string): LowcodeComponentMeta | undefined
  list(group?: string): LowcodeComponentMeta[]
  /** Materials for DragMaterial. */
  toMaterials(): CanvasMaterialItem[]
  clear(): void
  /** Active conflict policy. */
  readonly onConflict: RegistryConflictPolicy
}

export interface ValidateCanvasOptions {
  /** When set, unknown `node.type` values are errors; enables propsSchema checks. */
  registry?: ComponentRegistry
  /**
   * Fail when required props from propsSchema are missing.
   * Defaults to `true` when `registry` is provided.
   */
  checkRequiredProps?: boolean
  maxNodes?: number
  maxDepth?: number
  maxSchemaChars?: number
  minSize?: number
  maxCoord?: number
}

export type CanvasValidationCode =
  | 'invalid-root'
  | 'invalid-node'
  | 'unknown-type'
  | 'missing-prop'
  | 'bad-version'
  | 'duplicate-id'
  | 'missing-parent'
  | 'invalid-parent'
  | 'cycle'
  | 'invalid-size'
  | 'out-of-bounds'
  | 'invalid-prop-type'
  | 'invalid-enum'
  | 'invalid-binding'
  | 'invalid-event'
  | 'invalid-handler'
  | 'too-many-nodes'
  | 'too-deep'
  | 'schema-too-large'

export interface CanvasValidationIssue {
  path: string
  code: CanvasValidationCode
  message: string
}

export interface CanvasValidationResult {
  ok: boolean
  schema: CanvasSchema
  issues: CanvasValidationIssue[]
}

export interface CodegenOptions {
  /** Component name for the generated SFC (default `GeneratedCanvas`). */
  componentName?: string
  /** Prefer script setup (default true). */
  scriptSetup?: boolean
  /** Include free-layout absolute styles (default true). */
  includeLayoutStyles?: boolean
  /** Registry supplies import paths / export names. */
  registry?: ComponentRegistry
  /** Document action chains → wired to `runtime.runActionChain` in generated handlers. */
  actions?: Record<string, import('./runtime').LowcodeAction[]>
  /** Data sources registered on generated `createPageRuntime`. */
  dataSources?: import('./runtime').DataSourceDef[]
  /** Initial PageContext slices merged into generated runtime. */
  initialContext?: Partial<import('./runtime').PageContext>
}

export type SchemaRenderMode = 'chrome' | 'component'

export interface ResolveNodePropsResult {
  component: Component | undefined
  props: Record<string, unknown>
  meta: LowcodeComponentMeta | undefined
}

/** Runtime context bag for `__bindings` path reads / v-model writes. */
export type LowcodeRenderContext = Record<string, unknown>

/** Named handlers for `__events` (same names codegen stubs). */
export type LowcodeEventHandlers = Record<string, (...args: unknown[]) => unknown>

export interface LowcodeNodeEventPayload {
  nodeId: string
  event: string
  handler: string
  args: unknown[]
}

export interface RuntimeRenderOptions {
  registry?: ComponentRegistry
  /** Reactive-friendly state for binding paths (`form.name`, `count`, …). */
  context?: LowcodeRenderContext
  /** Map of handler name → function for `__events` / declared `meta.events`. */
  handlers?: LowcodeEventHandlers
  /** Fired for every wired schema event (after handler, if any). */
  onNodeEvent?: (payload: LowcodeNodeEventPayload) => void
}

export interface RuntimeRenderResult extends ResolveNodePropsResult {
  /** Vue `onXxx` listeners derived from bindings + events. */
  on: Record<string, (...args: unknown[]) => void>
  bindings: LowcodeBindings
  events: LowcodeEvents
}

export type { CanvasNodeData, CanvasSchema, CanvasMaterialItem }

/** Re-export tree node shape for UI cluster imports from `../../types`. */
export type { CanvasTreeNode } from './tree'
