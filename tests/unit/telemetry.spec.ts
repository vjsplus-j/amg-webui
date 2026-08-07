import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TelemetryService,
  trackEmit,
  redactPayload,
  RingBuffer,
  findAlerts,
  findErrors,
  DEFAULT_REDACT_KEYS
} from '@amg-webui/telemetry'
import type { VpTelemetryEvent } from '@amg-webui/telemetry'

afterEach(() => {
  TelemetryService.disable()
  TelemetryService.clear()
  TelemetryService.configure({
    enabled: false,
    sampleRate: 1,
    includePayload: false,
    sinks: [],
    redactKeys: [...DEFAULT_REDACT_KEYS]
  })
})

describe('telemetry kernel', () => {
  it('trackEmit early-returns when disabled', () => {
    TelemetryService.disable()
    const event = trackEmit({ component: 'Button', type: 'click' })
    expect(event).toBeUndefined()
    expect(TelemetryService.getBuffer()).toHaveLength(0)
  })

  it('redacts sensitive payload keys', () => {
    const cleaned = redactPayload(
      {
        label: 'ok',
        password: 'secret123',
        nested: { accessToken: 'tok', note: 'hi' }
      },
      ['password', 'accessToken']
    )
    expect(cleaned?.label).toBe('ok')
    expect(cleaned?.password).toBe('[REDACTED]')
    expect((cleaned?.nested as Record<string, unknown>).accessToken).toBe('[REDACTED]')
    expect((cleaned?.nested as Record<string, unknown>).note).toBe('hi')
  })

  it('ring buffer evicts oldest entries at capacity', () => {
    const buf = new RingBuffer<number>(3)
    buf.push(1)
    buf.push(2)
    buf.push(3)
    buf.push(4)
    expect(buf.toArray()).toEqual([2, 3, 4])
    expect(buf.size).toBe(3)
  })

  it('findAlerts detects rapid clicks, disabled clicks, and error clusters', () => {
    const base = Date.now()
    const events: VpTelemetryEvent[] = [
      {
        id: '1',
        ts: base,
        category: 'interaction',
        type: 'click',
        component: 'Button',
        trackId: 'save',
        severity: 'info',
        sessionId: 's1'
      },
      {
        id: '2',
        ts: base + 50,
        category: 'interaction',
        type: 'click',
        component: 'Button',
        trackId: 'save',
        severity: 'info',
        sessionId: 's1'
      },
      {
        id: '3',
        ts: base + 100,
        category: 'interaction',
        type: 'click',
        component: 'Button',
        trackId: 'save',
        severity: 'info',
        sessionId: 's1'
      },
      {
        id: '4',
        ts: base + 200,
        category: 'alert',
        type: 'disabledClick',
        component: 'Button',
        severity: 'warn',
        sessionId: 's1'
      },
      {
        id: '5',
        ts: base + 300,
        category: 'error',
        type: 'copyError',
        component: 'CopyText',
        severity: 'error',
        sessionId: 's1'
      },
      {
        id: '6',
        ts: base + 500,
        category: 'error',
        type: 'loadError',
        component: 'Image',
        severity: 'error',
        sessionId: 's1'
      }
    ]
    const kinds = findAlerts(events).map((f) => f.kind)
    expect(kinds).toContain('rapidClick')
    expect(kinds).toContain('disabledClick')
    expect(kinds).toContain('errorCluster')
    expect(findErrors(events)).toHaveLength(2)
  })

  it('isolates sink failures — trackEmit never throws', () => {
    TelemetryService.configure({
      enabled: true,
      sinks: [
        {
          write: () => {
            throw new Error('sink exploded')
          }
        }
      ]
    })
    expect(() =>
      trackEmit({ component: 'Button', type: 'click', trackId: 'x' })
    ).not.toThrow()
    expect(TelemetryService.getBuffer()).toHaveLength(1)
  })

  it('respects telemetry: false per event even when enabled', () => {
    TelemetryService.enable()
    const event = trackEmit({
      component: 'Button',
      type: 'click',
      telemetry: false
    })
    expect(event).toBeUndefined()
    expect(TelemetryService.getBuffer()).toHaveLength(0)
  })
})
