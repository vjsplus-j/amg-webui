import type { SecurityAlert, SecurityAlertListener, SecurityConfig } from './types'

const DEFAULT_CONFIG: Required<SecurityConfig> = {
  warnOnStrip: true,
  warnLevel: 'warn',
  appId: 'amg-webui'
}

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

  alert( partial: Omit<SecurityAlert, 'at'> & { at?: number }): void {
    const alert: SecurityAlert = {
      ...partial,
      at: partial.at ?? Date.now()
    }
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
    const prefix = `[${config.appId}/security]`
    const line = `${prefix} ${alert.kind}: ${alert.message}${alert.detail ? ` — ${alert.detail}` : ''}`
    if (config.warnLevel === 'error') console.error(line)
    else console.warn(line)
  }
}

export type SecurityServiceApi = typeof SecurityService
