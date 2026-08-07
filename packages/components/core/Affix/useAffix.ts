import { nextTick, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { throttle } from '@amg-webui/utils'
import { isClient, getDocument, getWindow } from '@amg-webui/utils/env'
import type { AffixProps, AffixScrollPayload } from './types'

function resolveTarget(target?: string | HTMLElement | Window): Window | HTMLElement | null {
  const win = getWindow()
  if (!win) return null
  if (!target || target === win) return win
  if (typeof target === 'string') {
    return (getDocument()?.querySelector(target) as HTMLElement | null) ?? win
  }
  return target
}

function readScrollTop(target: Window | HTMLElement): number {
  const win = getWindow()
  if (win && target === win) return win.scrollY || getDocument()?.documentElement.scrollTop || 0
  return (target as HTMLElement).scrollTop
}

function getTargetRect(target: Window | HTMLElement): DOMRect {
  const win = getWindow()
  if (win && target === win) {
    return {
      top: 0,
      left: 0,
      width: win.innerWidth,
      height: win.innerHeight,
      bottom: win.innerHeight,
      right: win.innerWidth,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }
  }
  return (target as HTMLElement).getBoundingClientRect()
}

export function useAffix(
  props: AffixProps,
  contentRef: Ref<HTMLElement | null>,
  onChange: (affixed: boolean) => void,
  onScroll: (payload: AffixScrollPayload) => void
) {
  const affixed = ref(false)
  const placeholderHeight = ref(0)
  const placeholderWidth = ref(0)
  const fixedStyle = ref<Record<string, string>>({})
  const targetRef = ref<Window | HTMLElement | null>(null)

  let lastAffixed = false

  function updateFixedStyle(rect: DOMRect) {
    const style: Record<string, string> = {
      position: 'fixed',
      width: `${rect.width}px`,
      left: `${rect.left}px`
    }

    if (props.offsetBottom !== undefined) {
      style.bottom = `${props.offsetBottom}px`
      style.top = 'auto'
    } else {
      style.top = `${props.offsetTop ?? 0}px`
    }

    if (props.zIndex !== undefined) {
      style.zIndex = String(props.zIndex)
    }

    fixedStyle.value = style
  }

  function measure() {
    const content = contentRef.value
    if (!content || props.disabled) {
      if (lastAffixed) {
        affixed.value = false
        lastAffixed = false
        onChange(false)
      }
      fixedStyle.value = {}
      return
    }

    const target = targetRef.value
    if (!target) return

    const targetRect = getTargetRect(target)
    const contentRect = content.getBoundingClientRect()
    const scrollTop = readScrollTop(target)

    placeholderHeight.value = contentRect.height
    placeholderWidth.value = contentRect.width

    let nextAffixed = false
    const win = getWindow()

    if (props.offsetBottom !== undefined) {
      const clientHeight =
        win && target === win ? win.innerHeight : (target as HTMLElement).clientHeight
      nextAffixed = contentRect.bottom > clientHeight - props.offsetBottom
    } else {
      const offsetTop = props.offsetTop ?? 0
      nextAffixed = contentRect.top - targetRect.top <= offsetTop
    }

    if (nextAffixed) {
      updateFixedStyle(contentRect)
    } else {
      fixedStyle.value = {}
    }

    affixed.value = nextAffixed

    if (nextAffixed !== lastAffixed) {
      lastAffixed = nextAffixed
      onChange(nextAffixed)
    }

    onScroll({ scrollTop, fixed: nextAffixed })
  }

  const throttledMeasure = throttle(measure, 16)

  function bind(target: Window | HTMLElement) {
    if (!isClient) return
    target.addEventListener('scroll', throttledMeasure, { passive: true })
    getWindow()?.addEventListener('resize', throttledMeasure, { passive: true })
  }

  function unbind(target: Window | HTMLElement | null) {
    if (!isClient || !target) return
    target.removeEventListener('scroll', throttledMeasure)
    getWindow()?.removeEventListener('resize', throttledMeasure)
  }

  onMounted(async () => {
    if (!isClient) return
    targetRef.value = resolveTarget(props.target)
    await nextTick()
    measure()
    if (targetRef.value) bind(targetRef.value)
  })

  watch(
    () => [props.target, props.offsetTop, props.offsetBottom, props.disabled, props.zIndex] as const,
    async () => {
      if (!isClient) return
      unbind(targetRef.value)
      targetRef.value = resolveTarget(props.target)
      await nextTick()
      measure()
      if (targetRef.value) bind(targetRef.value)
    }
  )

  onUnmounted(() => {
    unbind(targetRef.value)
  })

  return {
    affixed,
    placeholderHeight,
    placeholderWidth,
    fixedStyle,
    update: measure
  }
}
