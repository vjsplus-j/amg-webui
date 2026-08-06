import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  getCurrentZIndex,
  getZIndexBase,
  nextZIndex,
  resetZIndexManager,
  setZIndexBase
} from '@amg-webui/utils/zIndexManager'
import { useOverlay } from '@amg-webui/hooks/useOverlay'

describe('zIndexManager', () => {
  afterEach(() => {
    resetZIndexManager(2000)
  })

  it('allocates monotonic z-index values', () => {
    resetZIndexManager(2000)
    expect(getZIndexBase()).toBe(2000)
    expect(nextZIndex()).toBe(2001)
    expect(nextZIndex()).toBe(2002)
    expect(getCurrentZIndex()).toBe(2002)
  })

  it('raises floor via setZIndexBase', () => {
    resetZIndexManager(2000)
    nextZIndex()
    setZIndexBase(5000)
    expect(getZIndexBase()).toBe(5000)
    expect(getCurrentZIndex()).toBe(5000)
    expect(nextZIndex()).toBe(5001)
  })
})

describe('useOverlay', () => {
  afterEach(() => {
    resetZIndexManager(2000)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  })

  it('locks body scroll while visible and restores on close', async () => {
    const visible = ref(false)
    const container = ref<HTMLElement | null>(null)

    const Comp = defineComponent({
      setup() {
        useOverlay({
          visible,
          container,
          modal: true,
          trapFocus: false,
          closeOnEscape: false
        })
        return () => null
      }
    })

    mount(Comp)
    visible.value = true
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('hidden')

    visible.value = false
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('invokes onClose for Escape while open', async () => {
    const visible = ref(true)
    const container = ref<HTMLElement | null>(document.createElement('div'))
    const reasons: string[] = []

    const Comp = defineComponent({
      setup() {
        useOverlay({
          visible,
          container,
          modal: false,
          trapFocus: false,
          closeOnEscape: true,
          onClose: (reason) => reasons.push(reason)
        })
        return () => null
      }
    })

    mount(Comp)
    await nextTick()
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
    expect(reasons).toEqual(['escape'])
  })

  it('reference-counts nested scroll locks', async () => {
    const a = ref(false)
    const b = ref(false)
    const container = ref<HTMLElement | null>(null)

    const Comp = defineComponent({
      setup() {
        useOverlay({ visible: a, container, modal: true, trapFocus: false })
        useOverlay({ visible: b, container, modal: true, trapFocus: false })
        return () => null
      }
    })

    mount(Comp)
    a.value = true
    b.value = true
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('hidden')

    a.value = false
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('hidden')

    b.value = false
    await nextTick()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('closes on outside click when ignore excludes the target', async () => {
    const visible = ref(true)
    const container = ref<HTMLElement | null>(document.createElement('div'))
    const trigger = ref<HTMLElement | null>(document.createElement('button'))
    document.body.appendChild(container.value)
    document.body.appendChild(trigger.value)
    const reasons: string[] = []

    const Comp = defineComponent({
      setup() {
        useOverlay({
          visible,
          container,
          modal: false,
          trapFocus: false,
          closeOnEscape: false,
          closeOnClickOutside: true,
          ignore: [trigger],
          onClose: (reason) => reasons.push(reason)
        })
        return () => null
      }
    })

    mount(Comp)
    await nextTick()
    trigger.value!.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true })
    )
    expect(reasons).toEqual([])

    document.body.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true })
    )
    expect(reasons).toEqual(['outside'])

    container.value?.remove()
    trigger.value?.remove()
  })
})
