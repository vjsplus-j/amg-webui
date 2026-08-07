import type { SkillRuntimeApi, SkillUnit } from '../core/types'
import { OFFICIAL_BUILTIN_SKILLS } from './index'

export interface RegisterBuiltinsOptions {
  /** Allow re-registering over existing names (default true for lab/devtools). */
  override?: boolean
  /** Subset of built-in names to register; default = all five. */
  names?: readonly string[]
}

/**
 * Register the five official SR3 built-ins on a runtime.
 * Idempotent when `override: true` (default).
 */
export function registerOfficialBuiltins(
  runtime: SkillRuntimeApi,
  options: RegisterBuiltinsOptions = {}
): string[] {
  const override = options.override ?? true
  const allow = options.names ? new Set(options.names) : null
  const registered: string[] = []
  for (const unit of OFFICIAL_BUILTIN_SKILLS as readonly SkillUnit[]) {
    if (allow && !allow.has(unit.name)) continue
    runtime.register(unit, { override })
    registered.push(unit.name)
  }
  return registered
}
