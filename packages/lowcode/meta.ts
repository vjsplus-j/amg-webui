import {
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  type LowcodeBindings,
  type LowcodeEvents
} from './types'

/** Split reserved `__bindings` / `__events` from node props for codegen + runtime. */
export function splitMetaProps(props: Record<string, unknown>): {
  attrs: Record<string, unknown>
  bindings: LowcodeBindings
  events: LowcodeEvents
} {
  const attrs: Record<string, unknown> = {}
  let bindings: LowcodeBindings = {}
  let events: LowcodeEvents = {}
  for (const [key, value] of Object.entries(props)) {
    if (key === LOWCODE_BINDINGS_KEY && value && typeof value === 'object' && !Array.isArray(value)) {
      bindings = value as LowcodeBindings
      continue
    }
    if (key === LOWCODE_EVENTS_KEY && value && typeof value === 'object' && !Array.isArray(value)) {
      events = value as LowcodeEvents
      continue
    }
    attrs[key] = value
  }
  return { attrs, bindings, events }
}
