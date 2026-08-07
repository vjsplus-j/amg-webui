import {
  CANVAS_SCHEMA_VERSION,
  normalizeCanvasSchema,
  type CanvasNodeData,
  type CanvasSchema
} from '@amg-webui/utils'
import { isSafeHandlerName, isSafePathExpr } from './bindings'
import { LOWCODE_LIMITS } from './limits'
import { splitMetaProps } from './meta'
import { wouldCreateCycle } from './tree'
import {
  LOWCODE_BINDINGS_KEY,
  LOWCODE_EVENTS_KEY,
  type CanvasValidationIssue,
  type CanvasValidationResult,
  type LowcodePropSchema,
  type ValidateCanvasOptions
} from './types'

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

/** Event names: `click`, `update:modelValue`, `update:model-value`. */
const SAFE_EVENT_RE = /^[A-Za-z_][\w]*(?::[A-Za-z_][\w-]*)?$/

export function isSafeEventName(name: string): boolean {
  return typeof name === 'string' && name.length > 0 && name.length <= 64 && SAFE_EVENT_RE.test(name)
}

function push(
  issues: CanvasValidationIssue[],
  path: string,
  code: CanvasValidationIssue['code'],
  message: string
): void {
  issues.push({ path, code, message })
}

function estimateSchemaChars(schema: CanvasSchema): number {
  try {
    return JSON.stringify(schema).length
  } catch {
    return Number.POSITIVE_INFINITY
  }
}

function treeDepth(nodes: CanvasNodeData[]): number {
  const byId = new Map(nodes.map((n) => [n.id, n]))
  let max = 0
  for (const node of nodes) {
    let depth = 1
    let cur: string | null | undefined = node.parentId
    const seen = new Set<string>([node.id])
    while (cur && byId.has(cur)) {
      if (seen.has(cur)) break
      seen.add(cur)
      depth += 1
      cur = byId.get(cur)?.parentId ?? null
    }
    if (depth > max) max = depth
  }
  return max
}

function propTypeMatches(schema: LowcodePropSchema, value: unknown): boolean {
  if (value === undefined || value === null) return !schema.required
  switch (schema.type) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'enum':
      return schema.enum ? schema.enum.includes(value as string | number) : true
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'array':
      return Array.isArray(value)
    default:
      return true
  }
}

function validatePropsBag(
  path: string,
  props: Record<string, unknown>,
  options: ValidateCanvasOptions,
  nodeType: string | undefined,
  issues: CanvasValidationIssue[]
): void {
  const { attrs, bindings, events } = splitMetaProps(props)

  if (props[LOWCODE_BINDINGS_KEY] != null) {
    if (typeof props[LOWCODE_BINDINGS_KEY] !== 'object' || Array.isArray(props[LOWCODE_BINDINGS_KEY])) {
      push(issues, `${path}.props.${LOWCODE_BINDINGS_KEY}`, 'invalid-binding', '__bindings must be an object')
    } else {
      for (const [prop, expr] of Object.entries(bindings)) {
        if (typeof expr !== 'string' || !isSafePathExpr(expr)) {
          push(
            issues,
            `${path}.props.${LOWCODE_BINDINGS_KEY}.${prop}`,
            'invalid-binding',
            `Unsafe or empty binding expression for "${prop}"`
          )
        }
      }
    }
  }

  if (props[LOWCODE_EVENTS_KEY] != null) {
    if (typeof props[LOWCODE_EVENTS_KEY] !== 'object' || Array.isArray(props[LOWCODE_EVENTS_KEY])) {
      push(issues, `${path}.props.${LOWCODE_EVENTS_KEY}`, 'invalid-event', '__events must be an object')
    } else {
      const declared = options.registry && nodeType ? options.registry.get(nodeType)?.events : undefined
      for (const [event, handler] of Object.entries(events)) {
        if (!isSafeEventName(event)) {
          push(
            issues,
            `${path}.props.${LOWCODE_EVENTS_KEY}.${event}`,
            'invalid-event',
            `Unsafe event name "${event}"`
          )
        } else if (declared && declared.length > 0 && !declared.includes(event)) {
          push(
            issues,
            `${path}.props.${LOWCODE_EVENTS_KEY}.${event}`,
            'invalid-event',
            `Event "${event}" is not declared on type "${nodeType}"`
          )
        }
        if (typeof handler !== 'string' || !isSafeHandlerName(handler)) {
          push(
            issues,
            `${path}.props.${LOWCODE_EVENTS_KEY}.${event}`,
            'invalid-handler',
            `Unsafe or empty handler name for event "${event}"`
          )
        }
      }
    }
  }

  if (!options.registry || !nodeType) return
  const meta = options.registry.get(nodeType)
  if (!meta?.propsSchema) return

  for (const [prop, schema] of Object.entries(meta.propsSchema)) {
    const has = prop in attrs
    if (schema.required && options.checkRequiredProps !== false && !has && !bindings[prop]) {
      push(issues, `${path}.props.${prop}`, 'missing-prop', `Missing required prop "${prop}"`)
      continue
    }
    if (!has) continue
    const value = attrs[prop]
    if (schema.type === 'enum' && schema.enum && !schema.enum.includes(value as string | number)) {
      push(
        issues,
        `${path}.props.${prop}`,
        'invalid-enum',
        `Prop "${prop}" must be one of: ${schema.enum.join(', ')}`
      )
    } else if (!propTypeMatches(schema, value)) {
      push(
        issues,
        `${path}.props.${prop}`,
        'invalid-prop-type',
        `Prop "${prop}" expected type "${schema.type}"`
      )
    }
  }
}

function validateNode(
  node: CanvasNodeData,
  index: number,
  options: ValidateCanvasOptions,
  limits: { minSize: number; maxCoord: number },
  issues: CanvasValidationIssue[]
): void {
  const path = `nodes[${index}]`
  if (!node.id || typeof node.id !== 'string') {
    push(issues, path, 'invalid-node', 'Node id must be a non-empty string')
  }
  if (!node.type || typeof node.type !== 'string') {
    push(issues, path, 'invalid-node', 'Node type must be a non-empty string')
  } else if (options.registry && !options.registry.has(node.type)) {
    push(issues, `${path}.type`, 'unknown-type', `Unknown component type "${node.type}"`)
  }

  for (const key of ['x', 'y'] as const) {
    if (!isFiniteNumber(node[key])) {
      push(issues, `${path}.${key}`, 'invalid-node', `${key} must be a finite number`)
    } else if (Math.abs(node[key]) > limits.maxCoord) {
      push(issues, `${path}.${key}`, 'out-of-bounds', `${key} exceeds ±${limits.maxCoord}`)
    }
  }
  for (const key of ['w', 'h'] as const) {
    if (!isFiniteNumber(node[key])) {
      push(issues, `${path}.${key}`, 'invalid-node', `${key} must be a finite number`)
    } else if (node[key] < limits.minSize) {
      push(issues, `${path}.${key}`, 'invalid-size', `${key} must be >= ${limits.minSize}`)
    } else if (node[key] > limits.maxCoord) {
      push(issues, `${path}.${key}`, 'out-of-bounds', `${key} exceeds ${limits.maxCoord}`)
    }
  }

  if (node.props == null || typeof node.props !== 'object' || Array.isArray(node.props)) {
    push(issues, `${path}.props`, 'invalid-node', 'props must be an object')
  } else {
    validatePropsBag(path, node.props as Record<string, unknown>, options, node.type, issues)
  }
}

function validateGraph(nodes: CanvasNodeData[], issues: CanvasValidationIssue[]): void {
  const ids = new Map<string, number>()
  nodes.forEach((n, i) => {
    if (!n.id || typeof n.id !== 'string') return
    if (ids.has(n.id)) {
      push(
        issues,
        `nodes[${i}].id`,
        'duplicate-id',
        `Duplicate node id "${n.id}" (also at nodes[${ids.get(n.id)}])`
      )
    } else {
      ids.set(n.id, i)
    }
  })

  nodes.forEach((n, i) => {
    if (n.parentId == null || n.parentId === '') return
    if (typeof n.parentId !== 'string') {
      push(issues, `nodes[${i}].parentId`, 'invalid-parent', 'parentId must be a string or null')
      return
    }
    if (!ids.has(n.parentId)) {
      push(
        issues,
        `nodes[${i}].parentId`,
        'missing-parent',
        `parentId "${n.parentId}" does not exist`
      )
      return
    }
    if (wouldCreateCycle(nodes, n.id, n.parentId)) {
      push(
        issues,
        `nodes[${i}].parentId`,
        'cycle',
        `parentId chain forms a cycle involving "${n.id}"`
      )
    }
  })
}

/**
 * Soft normalize + hard validation. Always returns a usable schema; check `ok` / `issues`.
 *
 * Strict checks (always on unless noted): duplicate ids, parent existence, cycles,
 * size/coord bounds, schema size, node count, tree depth, bindings/events whitelist.
 * Props type / enum / required need `registry` (+ `checkRequiredProps`, default true when registry set).
 */
export function validateCanvasSchema(
  input: unknown,
  options: ValidateCanvasOptions = {}
): CanvasValidationResult {
  const issues: CanvasValidationIssue[] = []
  if (input == null || typeof input !== 'object') {
    push(issues, '', 'invalid-root', 'Schema root must be an object')
    return {
      ok: false,
      schema: { version: CANVAS_SCHEMA_VERSION, mode: 'free', nodes: [] },
      issues
    }
  }

  const schema = normalizeCanvasSchema(input)
  const maxNodes = options.maxNodes ?? LOWCODE_LIMITS.maxNodes
  const maxDepth = options.maxDepth ?? LOWCODE_LIMITS.maxDepth
  const maxSchemaChars = options.maxSchemaChars ?? LOWCODE_LIMITS.maxSchemaChars
  const minSize = options.minSize ?? LOWCODE_LIMITS.minSize
  const maxCoord = options.maxCoord ?? LOWCODE_LIMITS.maxCoord

  if (
    typeof (input as CanvasSchema).version === 'number' &&
    (input as CanvasSchema).version > CANVAS_SCHEMA_VERSION
  ) {
    push(
      issues,
      'version',
      'bad-version',
      `Unsupported schema version ${(input as CanvasSchema).version}`
    )
  }

  const chars = estimateSchemaChars(schema)
  if (chars > maxSchemaChars) {
    push(
      issues,
      '',
      'schema-too-large',
      `Schema payload ~${chars} chars exceeds maxSchemaChars=${maxSchemaChars}`
    )
  }

  if (schema.nodes.length > maxNodes) {
    push(
      issues,
      'nodes',
      'too-many-nodes',
      `Node count ${schema.nodes.length} exceeds maxNodes=${maxNodes}`
    )
  }

  const opts: ValidateCanvasOptions = {
    ...options,
    checkRequiredProps: options.checkRequiredProps ?? Boolean(options.registry)
  }

  schema.nodes.forEach((node, i) => validateNode(node, i, opts, { minSize, maxCoord }, issues))
  validateGraph(schema.nodes, issues)

  const depth = treeDepth(schema.nodes)
  if (depth > maxDepth) {
    push(issues, 'nodes', 'too-deep', `Tree depth ${depth} exceeds maxDepth=${maxDepth}`)
  }

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
