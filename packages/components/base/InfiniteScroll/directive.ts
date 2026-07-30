import type { Directive, DirectiveBinding } from 'vue'
import { isClient, getDocument } from '@amg-webui/utils/env'
import { createInfiniteScrollObserver } from './useInfiniteScrollObserver'

interface InfiniteScrollHost extends HTMLElement {
  _vpInfiniteScroll?: {
    destroy: () => void
    unlock: () => void
    refresh: () => void
  }
  _vpInfiniteScrollSentinel?: HTMLElement
}

function parseDistance(binding: DirectiveBinding): number {
  const arg = binding.arg
  if (arg != null && arg !== '') {
    const n = Number(arg)
    if (!Number.isNaN(n)) return n
  }
  const raw = binding.value
  if (raw && typeof raw === 'object' && 'distance' in raw) {
    const d = Number((raw as { distance?: number }).distance)
    if (!Number.isNaN(d)) return d
  }
  return 0
}

function resolveHandler(binding: DirectiveBinding): (() => void) | null {
  if (typeof binding.value === 'function') return binding.value
  if (binding.value && typeof binding.value === 'object' && 'handler' in binding.value) {
    const fn = (binding.value as { handler?: unknown }).handler
    return typeof fn === 'function' ? (fn as () => void) : null
  }
  return null
}

function mountInfiniteScroll(el: InfiniteScrollHost, binding: DirectiveBinding) {
  el._vpInfiniteScroll?.destroy()

  if (!isClient) return

  const handler = resolveHandler(binding)
  if (!handler) return

  const distance = parseDistance(binding)
  const delay = binding.modifiers.delay ? 200 : 0
  let delayTimer: ReturnType<typeof setTimeout> | null = null

  const doc = getDocument()
  if (!doc) return

  const sentinel = doc.createElement('div')
  sentinel.className = 'vp-infinite-scroll__sentinel'
  sentinel.setAttribute('aria-hidden', 'true')
  el.appendChild(sentinel)
  el._vpInfiniteScrollSentinel = sentinel

  const invoke = () => {
    if (delayTimer) clearTimeout(delayTimer)
    if (delay > 0) {
      delayTimer = setTimeout(() => handler(), delay)
    } else {
      handler()
    }
  }

  const scrollRoot =
    el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth ? el : null

  el._vpInfiniteScroll = createInfiniteScrollObserver(sentinel, {
    distance,
    immediate: true,
    onLoad: invoke,
    scrollRoot
  })
}

function unmountInfiniteScroll(el: InfiniteScrollHost) {
  el._vpInfiniteScroll?.destroy()
  el._vpInfiniteScroll = undefined
  el._vpInfiniteScrollSentinel?.remove()
  el._vpInfiniteScrollSentinel = undefined
}

export const vInfiniteScroll: Directive<InfiniteScrollHost> = {
  mounted(el, binding) {
    mountInfiniteScroll(el, binding)
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      mountInfiniteScroll(el, binding)
    } else {
      el._vpInfiniteScroll?.unlock()
    }
  },
  unmounted(el) {
    unmountInfiniteScroll(el)
  }
}

/** Element-Plus-like alias */
export const infiniteScroll = vInfiniteScroll
