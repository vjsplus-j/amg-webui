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
export { generateVueSfc, generateVueTemplate } from './codegen'
export {
  buildCanvasTree,
  getRootNodes,
  getChildNodes,
  wouldCreateCycle,
  rootContentBounds,
  type CanvasTreeNode
} from './tree'

/** Vue UI cluster (SchemaRenderer / Canvas* / drag canvas) */
export * from './ui'

