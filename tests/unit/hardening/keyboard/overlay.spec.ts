/**
 * Overlay family keyboard evidence — Dialog behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import Dialog from '@amg-webui/overlay/Dialog/index.vue'
import Drawer from '@amg-webui/overlay/Drawer/index.vue'
import Popover from '@amg-webui/overlay/Popover/index.vue'
import ConfirmDialog from '@amg-webui/overlay/ConfirmDialog/index.vue'
import MessageBoxHost from '@amg-webui/overlay/MessageBox/MessageBoxHost.vue'
import Tooltip from '@amg-webui/core/Tooltip/index.vue'
import {
  createOverlayRuntime,
  getDefaultOverlayRuntime,
  resetDefaultOverlayRuntime,
  resetDocumentOverlayCoordinator,
  resetSharedScrollLockManager
} from '@amg-webui/runtime'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/overlay.spec.ts'

beforeAll(() => setupKeyboardHarness())

afterEach(() => {
  resetDefaultOverlayRuntime()
  resetDocumentOverlayCoordinator()
  resetSharedScrollLockManager()
})

function mountVisibleDialog() {
  const visible = ref(false)
  const host = defineComponent({
    setup() {
      return () =>
        h(
          Dialog,
          {
            visible: visible.value,
            'onUpdate:visible': (value: boolean) => {
              visible.value = value
            },
            title: 'Keyboard test',
            closeOnPressEscape: true,
            dismissible: true
          },
          { default: () => 'Dialog body' }
        )
    }
  })
  const wrapper = mount(host, {
    attachTo: document.body,
    global: { stubs: { teleport: false, Transition: false } }
  })
  visible.value = true
  return { wrapper, visible }
}

describe('Overlay family keyboard — Dialog', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Dialog',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('overlay runtime Escape invokes top handler (sanity)', () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    const rt = createOverlayRuntime()
    const spy = vi.fn()
    rt.open({ kind: 'modal', closeOnEscape: true, onEscape: spy })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(spy).toHaveBeenCalled()
    rt.dispose()
  })

  it('Escape closes dialog (update:visible false)', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    resetSharedScrollLockManager()

    const { wrapper, visible } = mountVisibleDialog()
    await flushPromises()
    await nextTick()

    expect(document.querySelector('.vp-dialog[role="dialog"]')).toBeTruthy()
    expect(getDefaultOverlayRuntime().getTop()).not.toBeNull()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    )
    await flushPromises()
    await nextTick()

    expect(visible.value).toBe(false)

    testCases.push({
      name: 'escape-closes-dialog',
      key: 'Escape',
      expected: 'closes dialog and emits update:visible false',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Dialog keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Dialog/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.testCases?.length).toBeGreaterThanOrEqual(1)
  })
})

describe('Overlay family keyboard — Drawer', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Drawer',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Escape closes drawer with escape close reason', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    resetSharedScrollLockManager()

    const wrapper = mount(Drawer, {
      props: { visible: true, title: 'Drawer test' },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await flushPromises()
    await nextTick()

    document.body
      .querySelector<HTMLElement>('.vp-drawer')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('close')?.[0]?.[1]).toBe('escape')
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])

    testCases.push({
      name: 'escape-closes-drawer',
      key: 'Escape',
      expected: 'closes drawer with escape reason and emits update:visible false',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Overlay family keyboard — Popover', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Popover',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Enter on trigger opens popover panel', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()

    const wrapper = mount(Popover, {
      slots: {
        trigger: '<button type="button">More</button>',
        default: 'Popover body'
      },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await nextTick()

    await wrapper.get('.vp-popover__trigger').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    await nextTick()

    expect(document.querySelector('.vp-popover__panel')).toBeTruthy()
    expect(wrapper.emitted('openChange')?.some((args) => args[0] === true)).toBe(true)

    testCases.push({
      name: 'enter-opens-popover',
      key: 'Enter',
      expected: 'Enter on trigger opens popover panel',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('Escape closes open popover', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()

    const wrapper = mount(Popover, {
      slots: {
        trigger: '<button type="button">More</button>',
        default: 'Popover body'
      },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await wrapper.get('.vp-popover__trigger').trigger('click')
    await flushPromises()
    await nextTick()
    expect(document.querySelector('.vp-popover__panel')).toBeTruthy()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    )
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('openChange')?.some((args) => args[0] === false)).toBe(true)
    expect(wrapper.emitted('update:visible')?.some((args) => args[0] === false)).toBe(true)

    testCases.push({
      name: 'escape-closes-popover',
      key: 'Escape',
      expected: 'Escape closes open popover panel',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Overlay family keyboard — ConfirmDialog', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'ConfirmDialog',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Escape dismisses confirm dialog', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    resetSharedScrollLockManager()

    const wrapper = mount(ConfirmDialog, {
      props: { visible: true, message: 'Delete item?' },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await flushPromises()
    await nextTick()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    )
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false])
    expect(wrapper.emitted('cancel')?.length).toBeGreaterThan(0)

    testCases.push({
      name: 'escape-dismisses-dialog',
      key: 'Escape',
      expected: 'Escape dismisses confirm dialog and emits update:visible false',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Overlay family keyboard — MessageBox', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'MessageBox',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Escape dismisses message box host', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()
    resetSharedScrollLockManager()

    const wrapper = mount(MessageBoxHost, {
      props: { visible: true, message: 'Delete item?', mode: 'confirm' },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await flushPromises()
    await nextTick()

    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    )
    await flushPromises()
    await nextTick()

    expect(wrapper.emitted('update:visible')?.some((args) => args[0] === false)).toBe(true)
    expect(wrapper.emitted('cancel')?.length).toBeGreaterThan(0)

    testCases.push({
      name: 'escape-dismisses-message-box',
      key: 'Escape',
      expected: 'Escape dismisses message box and emits cancel',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})

describe('Overlay family keyboard — Tooltip', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Tooltip',
      family: 'overlay',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('focus opens tooltip panel', async () => {
    resetDefaultOverlayRuntime()
    resetDocumentOverlayCoordinator()

    const wrapper = mount(Tooltip, {
      props: { content: 'Keyboard hint', trigger: 'focus' },
      slots: { default: '<button type="button">Help</button>' },
      attachTo: document.body,
      global: { stubs: { teleport: false, Transition: false } }
    })
    await nextTick()

    await wrapper.get('.vp-tooltip-trigger__target').trigger('focusin')
    await flushPromises()
    await nextTick()

    expect(document.querySelector('.vp-tooltip')).toBeTruthy()

    testCases.push({
      name: 'focus-opens-tooltip',
      key: 'Tab',
      expected: 'Focus on trigger opens tooltip panel',
      status: 'PASS'
    })
    wrapper.unmount()
  })
})
