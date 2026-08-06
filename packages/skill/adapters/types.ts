import type { MaybePromise, SkillContext } from '../core/types'

/** Backend and host integrations are named capabilities, not hard dependencies. */
export interface SkillAdapter<Input = unknown, Output = unknown> {
  readonly name: string
  execute(input: Input, context: SkillContext): MaybePromise<Output>
  mapError?(error: unknown, context: SkillContext): Error
}

