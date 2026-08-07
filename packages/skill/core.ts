export type { SkillAdapter } from './adapters/types'
export {
  createSkillConsoleObserver,
  type SkillConsoleObserverOptions,
  type SkillObserver,
  type SkillObserverEvent,
  type SkillPipelineTraceEvent,
  type SkillPipelineTracePhase,
  type SkillTraceEvent,
  type SkillTracePhase
} from './observability/types'
export {
  SkillAbortError,
  SkillExecutionError,
  SkillRegistrationError,
  SkillRuntimeError
} from './core/errors'
export { createSkillEventBus, type SkillEventListenerErrorHandler } from './core/eventBus'
export { SkillAdapterRegistry, SkillRegistry } from './core/registry'
export {
  SkillRuntime,
  createSkillRuntime,
  defineSkill
} from './core/runtime'
export type {
  MaybePromise,
  SkillContext,
  SkillContextUtils,
  SkillEventBus,
  SkillEventHandler,
  SkillHandle,
  SkillLifecyclePhase,
  SkillMountOptions,
  SkillRegisterOptions,
  SkillRetryOptions,
  SkillRuntimeApi,
  SkillRuntimeOptions,
  SkillScope,
  SkillScopeContext,
  SkillState,
  SkillUnit
} from './core/types'
export {
  SkillPipelineExecutor,
  MAX_PIPELINE_ATTEMPTS,
  createSkillPipeline,
  createSkillPipelineExecutor
} from './pipeline/executor'
export type {
  JsonPrimitive,
  JsonValue,
  SkillCondition,
  SkillPipelineContext,
  SkillPipelineDefinition,
  SkillPipelineFallbackItem,
  SkillPipelineHandle,
  SkillPipelineIfItem,
  SkillPipelineItem,
  SkillPipelineParallelItem,
  SkillPipelinePhase,
  SkillPipelineResult,
  SkillPipelineRetryItem,
  SkillPipelineSkillItem,
  SkillPipelineStartOptions
} from './pipeline/types'

/* —— SR3 official built-ins (framework-agnostic) —— */
export {
  OFFICIAL_BUILTIN_NAMES,
  OFFICIAL_BUILTIN_SKILLS,
  dictMappingSkill,
  formSubmitSkill,
  requestWrapperSkill,
  tableExportSkill,
  tableSearchSkill
} from './builtins/index'
export { registerOfficialBuiltins } from './builtins/register'
export type {
  DictMappingConfig,
  DictMappingResult,
  FormSubmitConfig,
  FormSubmitResult,
  RegisterBuiltinsOptions,
  RequestWrapperConfig,
  RequestWrapperResult,
  TableExportConfig,
  TableExportResult,
  TableSearchConfig,
  TableSearchResult
} from './builtins/register-types'
export {
  createPipelineDebugger,
  createSkillInspector,
  type SkillInspector,
  type SkillInspectorSnapshot
} from './devtools/inspector'
export {
  createSkillTelemetryBridge,
  type SkillTelemetryBridgeOptions,
  type SkillTelemetryTrack
} from './devtools/telemetryBridge'
