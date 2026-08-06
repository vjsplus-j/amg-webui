export class SkillRuntimeError extends Error {
  readonly cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'SkillRuntimeError'
    this.cause = cause
  }
}

export class SkillRegistrationError extends SkillRuntimeError {
  constructor(message: string) {
    super(message)
    this.name = 'SkillRegistrationError'
  }
}

export class SkillExecutionError extends SkillRuntimeError {
  readonly skillName: string
  readonly instanceId: string

  constructor(skillName: string, instanceId: string, cause: Error) {
    super(`Skill "${skillName}" failed for instance "${instanceId}": ${cause.message}`, cause)
    this.name = 'SkillExecutionError'
    this.skillName = skillName
    this.instanceId = instanceId
  }
}

export class SkillAbortError extends SkillRuntimeError {
  constructor(message = 'Skill execution was aborted', cause?: unknown) {
    super(message, cause)
    this.name = 'SkillAbortError'
  }
}

export function toError(error: unknown): Error {
  if (error instanceof Error) return error
  return new Error(typeof error === 'string' ? error : 'Unknown skill runtime error')
}

export function abortError(reason?: unknown): SkillAbortError {
  if (reason instanceof SkillAbortError) return reason
  if (reason instanceof Error) return new SkillAbortError(reason.message, reason)
  return new SkillAbortError(typeof reason === 'string' ? reason : undefined)
}
