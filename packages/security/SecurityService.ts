import { hashDetail } from './hashDetail'
import type {
  SecurityAlert,
  SecurityAlertInput,
  SecurityAlertListener,
  SecurityConfig
} from './types'

const DEFAULT_CONFIG: Required<SecurityConfig> = {
  warnOnStrip: true,
  warnLevel: 'warn',
  appId: 'amg-webui',
  includeDetail: false
}

const DEFAULT_DETAIL_MAX = 160

let config: Required<SecurityConfig> = { ...DEFAULT_CONFIG }
const listeners = new Set<SecurityAlertListener>()
const recent: SecurityAlert[] = []
const MAX_RECENT = 50

function isDev(): boolean {
  try {
    const meta = import.meta as ImportMeta & { env?: { DEV?: boolean } }
    return Boolean(meta.env?.DEV)
  } catch {
    return false
  }
}

function normalizeAlert(partial: SecurityAlertInput): SecurityAlert {
  const raw =
    partial.rawDetail ??
    (config.includeDetail && typeof partial.detail === 'string' ? partial.detail : undefined)
  const maxLen = partial.detailMaxLength ?? DEFAULT_DETAIL_MAX
  const alert: SecurityAlert = {
    kind: partial.kind,
    message: partial.message,
    matchedRule: partial.matchedRule,
    at: partial.at ?? Date.now()
  }
  if (raw != null && raw.length > 0) {
    alert.detailLength = raw.length
    alert.detailHash = hashDetail(raw)
    if (config.includeDetail) {
      alert.detail = raw.length > maxLen ? raw.slice(0, maxLen) : raw
    }
  }
  return alert
}

function formatConsoleLine(alert: SecurityAlert): string {
  const prefix = `[${config.appId}/security]`
  const parts = [`${prefix} ${alert.kind}: ${alert.message}`]
  if (alert.matchedRule) parts.push(`rule=${alert.matchedRule}`)
  if (alert.detailHash) parts.push(`hash=${alert.detailHash}`)
  if (typeof alert.detailLength === 'number') parts.push(`len=${alert.detailLength}`)
  if (alert.detail) parts.push(`— ${alert.detail}`)
  return parts.join(' ')
}

export const SecurityService = {
  configure(partial: SecurityConfig): void {
    config = { ...config, ...partial }
  },

  getConfig(): Readonly<Required<SecurityConfig>> {
    return config
  },

  reset(): void {
    config = { ...DEFAULT_CONFIG }
    recent.length = 0
  },

  subscribe(listener: SecurityAlertListener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getRecentAlerts(): readonly SecurityAlert[] {
    return recent.slice()
  },

  clearAlerts(): void {
    recent.length = 0
  },

  alert(partial: SecurityAlertInput): void {
    const alert = normalizeAlert(partial)
    recent.push(alert)
    if (recent.length > MAX_RECENT) recent.shift()
    for (const listener of listeners) {
      try {
        listener(alert)
      } catch {
        /* never throw into UI */
      }
    }
    if (!config.warnOnStrip || config.warnLevel === 'off') return
    if (!isDev() && config.warnLevel !== 'error') return
    const line = formatConsoleLine(alert)
    if (config.warnLevel === 'error') console.error(line)
    else console.warn(line)
  }
}

export type SecurityServiceApi = typeof SecurityService
