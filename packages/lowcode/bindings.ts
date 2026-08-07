import type { CanvasNodeData } from '@amg-webui/utils'
import { splitMetaProps } from './meta'
import type {
  ComponentRegistry,
  LowcodeBindings,
  LowcodeEvents,
  ResolveNodePropsResult,
  RuntimeRenderOptions,
  RuntimeRenderResult
} from './types'

/**
 * Whitelisted binding / path expressions (codegen + runtime shared).
 * Allows: `foo`, `form.name`, `a.b.c` — no calls, brackets, operators, or templates.
 */
const SAFE_PATH_RE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/

/** Handler names in `__events` (same shape as codegen stubs). */
const SAFE_HANDLER_RE = /^[A-Za-z_$][\w$]*$/

const FORBIDDEN_SEGMENTS = new Set(['__proto__', 'prototype', 'constructor'])

function pathSegmentsSafe(expr: string): boolean {
  return expr.split('.').every((seg) => !FORBIDDEN_SEGMENTS.has(seg))
}

export function isSafePathExpr(expr: string): boolean {
  return (
    typeof expr === 'string' &&
    expr.length > 0 &&
    SAFE_PATH_RE.test(expr) &&
    pathSegmentsSafe(expr)
  )
}

export function isSafeHandlerName(name: string): boolean {
  return typeof name === 'string' && name.length > 0 && SAFE_HANDLER_RE.test(name)
}

export function getByPath(target: unknown, path: string): unknown {
  if (!isSafePathExpr(path)) return undefined
  let cur: unknown = target
  for (const key of path.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[key]
  }
  return cur
}

/** Set a whitelisted path; returns false if path invalid or parent missing. */
export function setByPath(target: Record<string, unknown>, path: string, value: unknown): boolean {
  if (!isSafePathExpr(path)) return false
  const parts = path.split('.')
  let cur: unknown = target
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur == null || typeof cur !== 'object' || Array.isArray(cur)) return false
    cur = (cur as Record<string, unknown>)[parts[i]!]
  }
  if (cur == null || typeof cur !== 'object' || Array.isArray(cur)) return false
  ;(cur as Record<string, unknown>)[parts[parts.length - 1]!] = value
  return true
}

function applyBindings(
  attrs: Record<string, unknown>,
  bindings: LowcodeBindings,
  context: Record<string, unknown> | undefined,
  on: Record<string, (...args: unknown[]) => void>
): Record<string, unknown> {
  const props = { ...attrs }
  if (!context) return props

  for (const [key, expr] of Object.entries(bindings)) {
    if (!expr || !isSafePathExpr(expr)) continue
    props[key] = getByPath(context, expr)
    if (key === 'modelValue' || key === 'model-value') {
      on['update:modelValue'] = (value: unknown) => {
        setByPath(context, expr, value)
      }
    }
  }
  return props
}

function applyEvents(
  events: LowcodeEvents,
  metaEvents: readonly string[] | undefined,
  nodeType: string,
  handlers: RuntimeRenderOptions['handlers'],
  onNodeEvent: RuntimeRenderOptions['onNodeEvent'],
  nodeId: string,
  on: Record<string, (...args: unknown[]) => void>
): void {
  const merged: LowcodeEvents = { ...events }
  for (const ev of metaEvents ?? []) {
    if (!merged[ev]) {
      // Match codegen stub naming: onCardClick
      merged[ev] = `on${nodeType}${ev[0]!.toUpperCase()}${ev.slice(1)}`
    }
  }

  for (const [event, handlerName] of Object.entries(merged)) {
    if (!handlerName || !isSafeHandlerName(handlerName)) continue
    const existing = on[event]
    on[event] = (...args: unknown[]) => {
      existing?.(...args)
      const fn = handlers?.[handlerName]
      if (typeof fn === 'function') {
        try {
          fn(...args)
        } catch {
          // Handler failures must not break schema render
        }
      }
      onNodeEvent?.({ nodeId, event, handler: handlerName, args })
    }
  }
}

/**
 * Resolve a node for runtime mount: strip meta keys, apply context bindings,
 * map `__events` / declared events to handlers. Never uses eval / new Function.
 */
export function resolveRuntimeRender(
  node: CanvasNodeData,
  options: RuntimeRenderOptions = {}
): RuntimeRenderResult {
  const meta = options.registry?.get(node.type)
  const raw = {
    ...(meta?.defaultProps ?? {}),
    ...(node.props ?? {})
  }
  const { attrs, bindings, events } = splitMetaProps(raw)
  const on: Record<string, (...args: unknown[]) => void> = {}
  const props = applyBindings(attrs, bindings, options.context, on)
  applyEvents(
    events,
    meta?.events,
    node.type,
    options.handlers,
    options.onNodeEvent,
    node.id,
    on
  )

  return {
    component: meta?.component,
    props,
    on,
    meta,
    bindings,
    events
  }
}

/** Static props only (no binding resolution). Strips reserved meta keys. */
export function resolveNodeRender(
  node: CanvasNodeData,
  registry?: ComponentRegistry
): ResolveNodePropsResult {
  const meta = registry?.get(node.type)
  const raw = {
    ...(meta?.defaultProps ?? {}),
    ...(node.props ?? {})
  }
  const { attrs } = splitMetaProps(raw)
  return {
    component: meta?.component,
    props: attrs,
    meta
  }
}
