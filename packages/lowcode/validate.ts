import {
  CANVAS_SCHEMA_VERSION,
  normalizeCanvasSchema,
  type CanvasNodeData,
  type CanvasSchema
} from '@amg-webui/utils'
import type {
  CanvasValidationIssue,
  CanvasValidationResult,
  ComponentRegistry,
  ResolveNodePropsResult,
  ValidateCanvasOptions
} from './types'

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function validateNode(
  node: CanvasNodeData,
  index: number,
  options: ValidateCanvasOptions,
  issues: CanvasValidationIssue[]
): void {
  const path = `nodes[${index}]`
  if (!node.id || typeof node.id !== 'string') {
    issues.push({ path, code: 'invalid-node', message: 'Node id must be a non-empty string' })
  }
  if (!node.type || typeof node.type !== 'string') {
    issues.push({ path, code: 'invalid-node', message: 'Node type must be a non-empty string' })
  } else if (options.registry && !options.registry.has(node.type)) {
    issues.push({
      path: `${path}.type`,
      code: 'unknown-type',
      message: `Unknown component type "${node.type}"`
    })
  }
  for (const key of ['x', 'y', 'w', 'h'] as const) {
    if (!isFiniteNumber(node[key])) {
      issues.push({ path: `${path}.${key}`, code: 'invalid-node', message: `${key} must be a finite number` })
    }
  }
  if (node.props == null || typeof node.props !== 'object' || Array.isArray(node.props)) {
    issues.push({ path: `${path}.props`, code: 'invalid-node', message: 'props must be an object' })
  } else if (options.checkRequiredProps && options.registry && node.type) {
    const meta = options.registry.get(node.type)
    if (meta?.propsSchema) {
      for (const [prop, schema] of Object.entries(meta.propsSchema)) {
        if (schema.required && !(prop in node.props)) {
          issues.push({
            path: `${path}.props.${prop}`,
            code: 'missing-prop',
            message: `Missing required prop "${prop}"`
          })
        }
      }
    }
  }
}

/**
 * Soft normalize + hard validation. Always returns a usable schema; check `ok` / `issues`.
 */
export function validateCanvasSchema(
  input: unknown,
  options: ValidateCanvasOptions = {}
): CanvasValidationResult {
  const issues: CanvasValidationIssue[] = []
  if (input == null || typeof input !== 'object') {
    issues.push({ path: '', code: 'invalid-root', message: 'Schema root must be an object' })
    return {
      ok: false,
      schema: { version: CANVAS_SCHEMA_VERSION, mode: 'free', nodes: [] },
      issues
    }
  }

  const schema = normalizeCanvasSchema(input)
  if (
    typeof (input as CanvasSchema).version === 'number' &&
    (input as CanvasSchema).version > CANVAS_SCHEMA_VERSION
  ) {
    issues.push({
      path: 'version',
      code: 'bad-version',
      message: `Unsupported schema version ${(input as CanvasSchema).version}`
    })
  }

  schema.nodes.forEach((node, i) => validateNode(node, i, options, issues))
  return { ok: issues.length === 0, schema, issues }
}

/**
 * Migrate older canvas JSON to current `CANVAS_SCHEMA_VERSION`.
 * v0 / missing version → v1 with defaults.
 */
export function migrateCanvasSchema(input: unknown): CanvasSchema {
  const normalized = normalizeCanvasSchema(input)
  if (normalized.version < CANVAS_SCHEMA_VERSION) {
    return {
      ...normalized,
      version: CANVAS_SCHEMA_VERSION,
      nodes: normalized.nodes.map((n) => ({
        ...n,
        props: n.props && typeof n.props === 'object' ? n.props : {},
        locked: Boolean(n.locked),
        hidden: Boolean(n.hidden),
        zIndex: typeof n.zIndex === 'number' ? n.zIndex : 1,
        parentId: n.parentId ?? null
      }))
    }
  }
  return normalized
}

export function resolveNodeRender(
  node: CanvasNodeData,
  registry?: ComponentRegistry
): ResolveNodePropsResult {
  const meta = registry?.get(node.type)
  const props = {
    ...(meta?.defaultProps ?? {}),
    ...(node.props ?? {})
  }
  return {
    component: meta?.component,
    props,
    meta
  }
}
