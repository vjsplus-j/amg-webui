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
}

export interface SecurityAlert {
  kind: 'html-stripped' | 'url-blocked' | 'input-filtered'
  message: string
  detail?: string
  at: number
}

export type SecurityAlertListener = (alert: SecurityAlert) => void
