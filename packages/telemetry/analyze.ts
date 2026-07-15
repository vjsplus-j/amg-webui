import type { VpTelemetryEvent } from './types'

export interface HabitSummaryItem {
  key: string
  trackId?: string
  component: string
  count: number
}

export interface AlertFinding {
  kind: 'rapidClick' | 'disabledClick' | 'permissionDenied' | 'errorCluster' | 'abnormal'
  message: string
  events: VpTelemetryEvent[]
}

const RAPID_WINDOW_MS = 400
const RAPID_MIN_COUNT = 3
const ERROR_CLUSTER_WINDOW_MS = 3000
const ERROR_CLUSTER_MIN = 2

/**
 * Frequency by trackId (preferred) or component+type.
 * Habit category is derived at query time — events stay as interaction.
 */
export function summarizeHabits(events: VpTelemetryEvent[]): HabitSummaryItem[] {
  const map = new Map<string, HabitSummaryItem>()
  for (const e of events) {
    if (e.category !== 'interaction' && e.category !== 'habit') continue
    const key = e.trackId || `${e.component}:${e.type}`
    const cur = map.get(key)
    if (cur) {
      cur.count++
    } else {
      map.set(key, {
        key,
        trackId: e.trackId,
        component: e.component,
        count: 1
      })
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count)
}

/** Detect rapid clicks, disabled clicks, permission denials, error clusters */
export function findAlerts(events: VpTelemetryEvent[]): AlertFinding[] {
  const findings: AlertFinding[] = []

  const explicit = events.filter((e) => e.category === 'alert')
  for (const e of explicit) {
    findings.push({
      kind:
        e.type === 'disabledClick'
          ? 'disabledClick'
          : e.type === 'permissionDenied'
            ? 'permissionDenied'
            : e.type === 'abnormal'
              ? 'abnormal'
              : 'rapidClick',
      message: `${e.component}.${e.type}${e.trackId ? ` (${e.trackId})` : ''}`,
      events: [e]
    })
  }

  // Rapid interaction bursts on same trackId / component
  const byKey = new Map<string, VpTelemetryEvent[]>()
  for (const e of events) {
    if (e.category !== 'interaction') continue
    if (e.type !== 'click' && e.type !== 'swap' && e.type !== 'close') continue
    const key = e.trackId || `${e.component}:${e.type}`
    const list = byKey.get(key) ?? []
    list.push(e)
    byKey.set(key, list)
  }

  for (const [, list] of byKey) {
    const sorted = [...list].sort((a, b) => a.ts - b.ts)
    let windowStart = 0
    for (let i = 0; i < sorted.length; i++) {
      while (sorted[i]!.ts - sorted[windowStart]!.ts > RAPID_WINDOW_MS) {
        windowStart++
      }
      const slice = sorted.slice(windowStart, i + 1)
      if (slice.length >= RAPID_MIN_COUNT) {
        findings.push({
          kind: 'rapidClick',
          message: `rapid ${slice[0]!.component}.${slice[0]!.type} ×${slice.length}`,
          events: slice
        })
        break
      }
    }
  }

  // Error clusters
  const errors = events
    .filter((e) => e.category === 'error')
    .sort((a, b) => a.ts - b.ts)
  let errStart = 0
  for (let i = 0; i < errors.length; i++) {
    while (errors[i]!.ts - errors[errStart]!.ts > ERROR_CLUSTER_WINDOW_MS) {
      errStart++
    }
    const slice = errors.slice(errStart, i + 1)
    if (slice.length >= ERROR_CLUSTER_MIN) {
      findings.push({
        kind: 'errorCluster',
        message: `error cluster ×${slice.length}`,
        events: slice
      })
      break
    }
  }

  return findings
}

export function findErrors(events: VpTelemetryEvent[]): VpTelemetryEvent[] {
  return events.filter((e) => e.category === 'error')
}
