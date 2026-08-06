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
  /** Preferred import specifier for codegen (default `@amg-webui/components/base`). */
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

export interface ComponentRegistry {
  register(meta: LowcodeComponentMeta | LowcodeComponentMeta[]): void
  unregister(type: string): void
  has(type: string): boolean
  get(type: string): LowcodeComponentMeta | undefined
  list(group?: string): LowcodeComponentMeta[]
  /** Materials for DragMaterial. */
  toMaterials(): CanvasMaterialItem[]
  clear(): void
}

export interface ValidateCanvasOptions {
  /** When set, unknown `node.type` values are errors. */
  registry?: ComponentRegistry
  /** Fail when required props from propsSchema are missing. */
  checkRequiredProps?: boolean
}

export interface CanvasValidationIssue {
  path: string
  code: 'invalid-root' | 'invalid-node' | 'unknown-type' | 'missing-prop' | 'bad-version'
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
}

export type SchemaRenderMode = 'chrome' | 'component'

export interface ResolveNodePropsResult {
  component: Component | undefined
  props: Record<string, unknown>
  meta: LowcodeComponentMeta | undefined
}

export type { CanvasNodeData, CanvasSchema, CanvasMaterialItem }
