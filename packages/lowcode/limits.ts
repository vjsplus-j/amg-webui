/** Default hard limits for canvas schema validation (overridable via ValidateCanvasOptions). */
export const LOWCODE_LIMITS = {
  /** Max nodes in one schema. */
  maxNodes: 500,
  /** Max parentId chain depth (root = 1). */
  maxDepth: 32,
  /** Max JSON-ish payload size in UTF-16 code units (approx. string length of serialized schema). */
  maxSchemaChars: 512_000,
  /** Min width / height. */
  minSize: 1,
  /** Absolute bound for x / y / w / h. */
  maxCoord: 100_000
} as const

export type LowcodeLimits = {
  -readonly [K in keyof typeof LOWCODE_LIMITS]: number
}
