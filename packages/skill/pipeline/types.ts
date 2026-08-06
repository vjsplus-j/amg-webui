import type { MaybePromise, SkillHandle, SkillScope, SkillState } from '../core/types'

export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

export interface SkillPipelineSkillItem {
  type: 'skill'
  name: string
  id?: string
  config?: JsonValue
}

export interface SkillPipelineParallelItem {
  type: 'parallel'
  items: SkillPipelineItem[]
}

export interface SkillPipelineIfItem {
  type: 'if'
  condition: string
  then: SkillPipelineItem[]
  else?: SkillPipelineItem[]
}

export interface SkillPipelineRetryItem {
  type: 'retry'
  /** Total attempts, including the first execution. */
  max: number
  delayMs?: number
  backoff?: number
  item: SkillPipelineItem
}

export interface SkillPipelineFallbackItem {
  type: 'fallback'
  item: SkillPipelineItem
  fallback: SkillPipelineItem
}

export type SkillPipelineItem =
  | SkillPipelineSkillItem
  | SkillPipelineParallelItem
  | SkillPipelineIfItem
  | SkillPipelineRetryItem
  | SkillPipelineFallbackItem

export interface SkillPipelineDefinition {
  version: 1
  name?: string
  items: SkillPipelineItem[]
}

export interface SkillPipelineContext {
  readonly state: SkillState
  readonly outputs: Readonly<Record<string, unknown>>
  readonly scope: SkillScope
}

export type SkillCondition = (
  context: SkillPipelineContext
) => MaybePromise<boolean>

export interface SkillPipelineStartOptions {
  scope?: SkillScope
  state?: SkillState
  host?: object
}

export type SkillPipelinePhase = 'running' | 'active' | 'failed' | 'disposing' | 'disposed'

export interface SkillPipelineResult {
  readonly outputs: Readonly<Record<string, unknown>>
  readonly handles: readonly SkillHandle[]
}

export interface SkillPipelineHandle {
  readonly id: string
  readonly definition: SkillPipelineDefinition
  readonly scope: SkillScope
  readonly ready: Promise<SkillPipelineResult>
  readonly phase: SkillPipelinePhase
  dispose(): Promise<void>
}
