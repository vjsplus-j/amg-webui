import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  configureDefaultOverlayRuntime,
  createOverlayRuntime,
  getDefaultOverlayRuntime,
  getSharedScrollLockManager,
  resetDefaultOverlayRuntime,
  resetDocumentOverlayCoordinator,
  resetSharedScrollLockManager,
  resolveTeleportTarget
} from '@amg-webui/runtime'

describe('Overlay runtime', () => {
  afterEach(() => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    resetSharedScrollLockManager()
    vi.unstubAllGlobals()
  })

  it('allocates increasing z-index per open layer', () => {
    const rt = createOverlayRuntime({ zIndexBase: 1000 })
    const a = rt.open({ kind: 'modal' })
    const b = rt.open({ kind: 'modal' })
    expect(b.zIndex).toBeGreaterThan(a.zIndex)
    a.close()
    b.close()
  })

  it('keeps scroll lock while nested layers remain', () => {
    const lock = getSharedScrollLockManager()
    const rt = createOverlayRuntime()
    const a = rt.open({ kind: 'modal', lockScroll: true })
    const b = rt.open({ kind: 'modal', lockScroll: true })
    expect(lock.isLocked()).toBe(true)
    a.close()
    expect(lock.isLocked()).toBe(true)
    b.close()
    expect(lock.isLocked()).toBe(false)
  })

  it('Escape only invokes the top handler (LIFO)', () => {
    const rt = createOverlayRuntime()
    const order: string[] = []
    rt.open({
      kind: 'modal',
      closeOnEscape: true,
      onEscape: () => order.push('bottom')
    })
    const top = rt.open({
      kind: 'modal',
      closeOnEscape: true,
      onEscape: () => order.push('top')
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(order).toEqual(['top'])
    top.close()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(order).toEqual(['top', 'bottom'])
    rt.dispose()
  })

  it('restores focus after closing a trapped layer', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'open'
    document.body.appendChild(trigger)
    trigger.focus()

    const panel = document.createElement('div')
    const inner = document.createElement('button')
    inner.textContent = 'inside'
    panel.appendChild(inner)
    document.body.appendChild(panel)

    const rt = createOverlayRuntime()
    const handle = rt.open({
      kind: 'modal',
      trapFocus: true,
      restoreFocus: true,
      container: panel
    })
    inner.focus()
    handle.close()
    expect(document.activeElement).toBe(trigger)

    trigger.remove()
    panel.remove()
    rt.dispose()
  })

  it('restores focus into parent trap when nested modal closes', () => {
    const outerPanel = document.createElement('div')
    const openInner = document.createElement('button')
    openInner.textContent = 'open detail'
    outerPanel.appendChild(openInner)
    document.body.appendChild(outerPanel)

    const innerPanel = document.createElement('div')
    const innerBtn = document.createElement('button')
    innerBtn.textContent = 'close'
    innerPanel.appendChild(innerBtn)
    document.body.appendChild(innerPanel)

    const rt = createOverlayRuntime()
    rt.open({
      kind: 'modal',
      trapFocus: true,
      restoreFocus: true,
      container: outerPanel
    })
    openInner.focus()
    const nested = rt.open({
      kind: 'modal',
      trapFocus: true,
      restoreFocus: true,
      container: innerPanel
    })
    innerBtn.focus()
    nested.close()
    expect(document.activeElement).toBe(openInner)

    outerPanel.remove()
    innerPanel.remove()
    rt.dispose()
  })

  it('getTop reflects stack order', () => {
    const rt = createOverlayRuntime()
    const a = rt.open({ kind: 'popover', modal: false, lockScroll: false, trapFocus: false })
    const b = rt.open({ kind: 'modal' })
    expect(rt.getTop()?.id).toBe(b.id)
    b.close()
    expect(rt.getTop()?.id).toBe(a.id)
    a.close()
    expect(rt.getTop()).toBeNull()
  })

  it('does not register Escape when closeOnEscape is false', () => {
    const rt = createOverlayRuntime()
    const spy = vi.fn()
    rt.open({
      kind: 'modal',
      closeOnEscape: false,
      onEscape: spy
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(spy).not.toHaveBeenCalled()
    rt.dispose()
  })

  it('kind baselines keep tooltip above modal at same stack depth', () => {
    const rt = createOverlayRuntime({ zIndexBase: 1000 })
    const modal = rt.open({ kind: 'modal' })
    const tip = rt.open({
      kind: 'tooltip',
      modal: false,
      lockScroll: false,
      trapFocus: false
    })
    expect(tip.zIndex).toBeGreaterThan(modal.zIndex)
    modal.close()
    tip.close()
  })

  it('configureDefaultOverlayRuntime updates teleport default', () => {
    const host = document.createElement('div')
    host.id = 'local'
    document.body.appendChild(host)
    configureDefaultOverlayRuntime({ teleportTo: '#shell', zIndexBase: 2000 })
    const rt = getDefaultOverlayRuntime()
    expect(rt.getContext().teleportTo).toBe('#shell')
    expect(rt.getContext().zIndexBase).toBe(2000)
    expect(rt.resolveTeleportTo(undefined)).toBe('#shell')
    expect(rt.resolveTeleportTo('#local')).toBe('#local')
    host.remove()
  })

  it('click-outside only fires for the top layer', () => {
    const rt = createOverlayRuntime()
    const bottom = document.createElement('div')
    const top = document.createElement('div')
    document.body.append(bottom, top)
    const bottomSpy = vi.fn()
    const topSpy = vi.fn()
    rt.open({
      kind: 'popover',
      modal: false,
      lockScroll: false,
      trapFocus: false,
      container: bottom,
      onClickOutside: bottomSpy
    })
    rt.open({
      kind: 'popover',
      modal: false,
      lockScroll: false,
      trapFocus: false,
      container: top,
      onClickOutside: topSpy
    })
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    expect(topSpy).toHaveBeenCalledTimes(1)
    expect(bottomSpy).not.toHaveBeenCalled()
    bottom.remove()
    top.remove()
    rt.dispose()
  })

  it('resolveTeleportTarget falls back when target is nullish', () => {
    expect(resolveTeleportTarget(undefined, 'body')).toBe('body')
    expect(resolveTeleportTarget(null, '#app')).toBe('#app')
  })

  it('handle.update can toggle lockScroll while open', () => {
    const lock = getSharedScrollLockManager()
    const rt = createOverlayRuntime()
    const layer = rt.open({ kind: 'modal', lockScroll: true })
    expect(lock.isLocked()).toBe(true)
    layer.update({ lockScroll: false })
    expect(lock.isLocked()).toBe(false)
    layer.update({ lockScroll: true })
    expect(lock.isLocked()).toBe(true)
    layer.close()
  })

  it('disposing runtime A does not unlock runtime B scroll', () => {
    const lock = getSharedScrollLockManager()
    const a = createOverlayRuntime({ zIndexBase: 3000, namespace: 'mfe-a' })
    const b = createOverlayRuntime({ zIndexBase: 5000, namespace: 'mfe-b' })
    a.open({ kind: 'modal', lockScroll: true })
    b.open({ kind: 'modal', lockScroll: true })
    expect(lock.isLocked()).toBe(true)
    a.dispose()
    expect(lock.isLocked()).toBe(true)
    b.dispose()
    expect(lock.isLocked()).toBe(false)
  })

  it('Escape only closes the globally highest z-index layer across runtimes', () => {
    const low = createOverlayRuntime({ zIndexBase: 1000 })
    const high = createOverlayRuntime({ zIndexBase: 5000 })
    const order: string[] = []
    low.open({
      kind: 'modal',
      closeOnEscape: true,
      onEscape: () => order.push('low')
    })
    high.open({
      kind: 'modal',
      closeOnEscape: true,
      onEscape: () => order.push('high')
    })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(order).toEqual(['high'])
    high.dispose()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(order).toEqual(['high', 'low'])
    low.dispose()
  })
})
