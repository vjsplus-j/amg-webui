import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Icon from '../../packages/components/base/Icon/index.vue'
import { resolveMotionKind, MOTION_CLASS } from '../../packages/animations/motion'

describe('resolveMotionKind', () => {
  it('prioritizes spin > bounce > heartbeat > marquee > scroll > dampOut > blink > pulse > breathe > glow', () => {
    expect(
      resolveMotionKind({
        spin: true,
        bounce: true,
        heartbeat: true,
        marqueeLeft: true,
        scrollUp: true,
        dampOut: true,
        blink: true,
        pulse: true,
        breathe: true,
        glow: true
      })
    ).toBe('spin')
    expect(
      resolveMotionKind({
        bounce: true,
        heartbeat: true,
        marqueeLeft: true,
        scrollUp: true,
        dampOut: true,
        blink: true
      })
    ).toBe('bounce')
    expect(
      resolveMotionKind({
        heartbeat: true,
        marqueeLeft: true,
        marqueeRight: true,
        scrollUp: true
      })
    ).toBe('heartbeat')
    expect(resolveMotionKind({ marqueeLeft: true, marqueeRight: true })).toBe('marqueeLeft')
    expect(resolveMotionKind({ marqueeRight: true, scrollUp: true })).toBe('marqueeRight')
    expect(resolveMotionKind({ scrollUp: true, scrollDown: true })).toBe('scrollUp')
    expect(resolveMotionKind({ scrollDown: true, dampOut: true })).toBe('scrollDown')
    expect(resolveMotionKind({ dampOut: true, blink: true })).toBe('dampOut')
    expect(
      resolveMotionKind({ blink: true, pulse: true, breathe: true, glow: true })
    ).toBe('blink')
    expect(resolveMotionKind({ pulse: true, breathe: true, glow: true })).toBe('pulse')
    expect(resolveMotionKind({ breathe: true, glow: true })).toBe('breathe')
    expect(resolveMotionKind({ glow: true })).toBe('glow')
    expect(resolveMotionKind({})).toBe(null)
  })

  it('forceSpin wins', () => {
    expect(resolveMotionKind({ forceSpin: true, heartbeat: true })).toBe('spin')
  })
})

describe('Icon transform / motion props', () => {
  it('passes rotate and flip to Lucide svg via style', async () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'ChevronRight',
        rotate: 90,
        flipH: true,
        flipV: true,
        size: 32
      }
    })
    await nextTick()
    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    const transform = (svg.element as SVGElement).getAttribute('style') || ''
    expect(transform).toContain('rotate(90deg)')
    expect(transform).toContain('scaleX(-1)')
    expect(transform).toContain('scaleY(-1)')
  })

  it('adds shared vp-motion and legacy icon classes for spin', async () => {
    const wrapper = mount(Icon, {
      props: { name: 'RefreshCw', spin: true, size: 32 }
    })
    await nextTick()
    const classes = wrapper.find('.vp-icon').classes()
    expect(classes).toContain(MOTION_CLASS.spin)
    expect(classes).toContain('vp-icon--spin')
  })

  it('adds heartbeat / bounce shared classes', async () => {
    const hb = mount(Icon, { props: { name: 'Heart', heartbeat: true, size: 32 } })
    await nextTick()
    expect(hb.find('.vp-icon').classes()).toContain(MOTION_CLASS.heartbeat)

    const bc = mount(Icon, { props: { name: 'ArrowUp', bounce: true, size: 32 } })
    await nextTick()
    expect(bc.find('.vp-icon').classes()).toContain(MOTION_CLASS.bounce)
  })

  it('prefers spin over heartbeat / bounce / pulse', async () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'Heart',
        spin: true,
        heartbeat: true,
        bounce: true,
        pulse: true,
        size: 32
      }
    })
    await nextTick()
    const classes = wrapper.find('.vp-icon').classes()
    expect(classes).toContain(MOTION_CLASS.spin)
    expect(classes).not.toContain(MOTION_CLASS.heartbeat)
    expect(classes).not.toContain(MOTION_CLASS.bounce)
    expect(classes).not.toContain(MOTION_CLASS.pulse)
  })

  it('updates svg transform when props change', async () => {
    const wrapper = mount(Icon, {
      props: { name: 'Bell', rotate: 0, size: 32 }
    })
    await wrapper.setProps({ rotate: 225, flipH: true })
    await nextTick()
    const style = wrapper.find('svg').attributes('style') || ''
    expect(style).toContain('rotate(225deg)')
    expect(style).toContain('scaleX(-1)')
  })
})
