/** Security layer public types — see docs/SECURITY.md */

export type SecurityWarnLevel = 'off' | 'warn' | 'error'

export interface SanitizeHtmlOptions {
  /** Allowed tag names (lowercase). Defaults to rich-text whitelist. */
  allowedTags?: readonly string[]
  /** Allowed attributes per tag; `*` applies to all tags. */
  allowedAttributes?: Readonly<Record<string, readonly string[]>>
  /** Keep relative URLs (default true). */
  allowRelativeUrls?: boolean
  /** Extra protocols beyond http/https/mailto/tel (e.g. `blob:`). Default empty. */
  allowedProtocols?: readonly string[]
  /** When true, wrap unknown tags' text content instead of dropping. Default false. */
  keepUnknownText?: boolean
}

export interface SanitizeUrlOptions {
  allowRelative?: boolean
  allowedProtocols?: readonly string[]
}

export interface FilterInputOptions {
  /** Strip HTML tags entirely (default true). */
  stripTags?: boolean
  /** Also reject dangerous protocol fragments in plain text (default true). */
  stripDangerousProtocols?: boolean
  /** Max length; truncate when exceeded. */
  maxLength?: number
}

export interface SecurityConfig {
  /** Emit console warnings in development when sanitizer strips content (default true in DEV). */
  warnOnStrip?: boolean
  /** Dev warn level (default 'warn'). */
  warnLevel?: SecurityWarnLevel
  /** App id for log prefixes. */
  appId?: string
  /**
   * When true, keep truncated raw `detail` on alerts (default false).
   * Prefer `detailHash` / `detailLength` / `matchedRule` for monitoring.
   */
  includeDetail?: boolean
}

export interface SecurityAlert {
  kind: 'html-stripped' | 'url-blocked' | 'input-filtered'
  message: string
  /**
   * Truncated raw snippet — only present when `SecurityConfig.includeDetail` is true.
   * Prefer `detailHash` for correlation.
   */
  detail?: string
  /** FNV-1a hex of the original detail string (always set when rawDetail was provided). */
  detailHash?: string
  /** Original detail string length before truncation. */
  detailLength?: number
  /** Which sanitizer rule fired (e.g. `strip-tags`, `blocked-protocol`). */
  matchedRule?: string
  at: number
}

/** Input to `SecurityService.alert` — raw content is redacted unless `includeDetail`. */
export type SecurityAlertInput = Omit<
  SecurityAlert,
  'at' | 'detailHash' | 'detailLength' | 'detail'
> & {
  at?: number
  /** Original payload for hashing / optional detail; never stored unless includeDetail. */
  rawDetail?: string
  /** Truncation cap when includeDetail keeps a snippet (default 160). */
  detailMaxLength?: number
  matchedRule?: string
  /** @deprecated Pass `rawDetail` instead; ignored unless includeDetail and no rawDetail. */
  detail?: string
}

export type SecurityAlertListener = (alert: SecurityAlert) => void
