export type {
  LowcodePropSchema,
  LowcodeComponentMeta,
  ComponentRegistry,
  CreateComponentRegistryOptions,
  RegistryConflictPolicy,
  RegistryRegisterResult,
  ValidateCanvasOptions,
  CanvasValidationIssue,
  CanvasValidationCode,
  CanvasValidationResult,
  CodegenOptions,
  SchemaRenderMode,
  ResolveNodePropsResult,
  RuntimeRenderOptions,
  RuntimeRenderResult,
  LowcodeRenderContext,
  LowcodeEventHandlers,
  LowcodeNodeEventPayload,
  LowcodeBindings,
  LowcodeEvents,
  CanvasNodeData,
  CanvasSchema,
  CanvasMaterialItem
} from './types'

export { LOWCODE_BINDINGS_KEY, LOWCODE_EVENTS_KEY } from './types'
export { LOWCODE_LIMITS, type LowcodeLimits } from './limits'
export { createComponentRegistry, RegistryConflictError } from './registry'
export { validateCanvasSchema, migrateCanvasSchema, isSafeEventName } from './validate'
export {
  resolveNodeRender,
  resolveRuntimeRender,
  isSafePathExpr,
  isSafeHandlerName,
  getByPath,
  setByPath
} from './bindings'
export { splitMetaProps } from './meta'
export { generateVueSfc, generateVueTemplate, assertGeneratedSfcShape } from './codegen'
export {
  buildCanvasTree,
  getRootNodes,
  getChildNodes,
  wouldCreateCycle,
  rootContentBounds,
  type CanvasTreeNode
} from './tree'

/** Editor Core (Studio 0.1) */
export * from './editor'
/** Material Protocol v2 */
export * from './materials'
/** Page runtime / actions / data sources */
export * from './runtime'
/** Document persistence */
export * from './document'
/** Studio shell UI */
export * from './studio'

/** Vue UI cluster (SchemaRenderer / Canvas* / drag canvas) */
export * from './ui'
