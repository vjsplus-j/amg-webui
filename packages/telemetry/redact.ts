const REDACTED = '[REDACTED]'

function keyMatches(key: string, patterns: string[]): boolean {
  const lower = key.toLowerCase()
  return patterns.some((p) => lower.includes(p.toLowerCase()))
}

/**
 * Deep-clone payload and replace sensitive keys with `[REDACTED]`.
 * Never throws — returns `{}` on failure.
 */
export function redactPayload(
  input: Record<string, unknown> | undefined,
  redactKeys: string[]
): Record<string, unknown> | undefined {
  if (!input) return undefined
  try {
    return walk(input, redactKeys, 0) as Record<string, unknown>
  } catch {
    return {}
  }
}

function walk(value: unknown, redactKeys: string[], depth: number): unknown {
  if (depth > 6) return '[Truncated]'
  if (value == null) return value
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((v) => walk(v, redactKeys, depth + 1))
  }
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (keyMatches(k, redactKeys)) {
        out[k] = REDACTED
      } else {
        out[k] = walk(v, redactKeys, depth + 1)
      }
    }
    return out
  }
  if (typeof value === 'string' && value.length > 500) {
    return `${value.slice(0, 500)}…`
  }
  return value
}

/** Trim name / aria text for event summaries */
export function trimName(name: string | undefined, max = 80): string | undefined {
  if (!name) return undefined
  const t = name.trim().replace(/\s+/g, ' ')
  if (!t) return undefined
  return t.length > max ? `${t.slice(0, max)}…` : t
}
