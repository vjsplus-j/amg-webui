import { afterEach, describe, expect, it, vi } from 'vitest'

describe('SSR env helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetModules()
  })

  it('isClient is false when window is undefined', async () => {
    vi.stubGlobal('window', undefined)
    const { isClient, isServer } = await import('@amg-webui/utils/env')
    expect(isClient).toBe(false)
    expect(isServer).toBe(true)
  })

  it('getDocument returns null when window is undefined', async () => {
    vi.stubGlobal('window', undefined)
    const { getDocument, getWindow } = await import('@amg-webui/utils/env')
    expect(getDocument()).toBeNull()
    expect(getWindow()).toBeNull()
  })

  it('getDocument returns document in browser-like env', async () => {
    const { getDocument, getWindow, isClient } = await import('@amg-webui/utils/env')
    expect(isClient).toBe(true)
    expect(getDocument()).toBe(document)
    expect(getWindow()).toBe(window)
  })

  it('dom helpers do not throw when window is undefined', async () => {
    vi.stubGlobal('window', undefined)
    const { isElementVisible, getElementOffset, createElement } = await import('@amg-webui/utils/dom')

    const el = {
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        bottom: 10,
        right: 10,
        width: 10,
        height: 10,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    } as HTMLElement

    expect(isElementVisible(el)).toBe(false)
    expect(getElementOffset(el)).toEqual({ top: 0, left: 0 })
    expect(createElement('div')).toBeNull()
  })
})
