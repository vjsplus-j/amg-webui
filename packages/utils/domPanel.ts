/**
 * Fixed-position panel under/beside a trigger — for Teleport-to-body menus.
 */
export type PanelPlacement = 'bottom-start' | 'bottom-end' | 'right-start' | 'left-start'

export function getFixedPanelStyle(
  trigger: HTMLElement,
  opts?: {
    gap?: number
    align?: 'start' | 'end'
    preferredWidth?: number
    /** Flip above if not enough space below */
    flip?: boolean
    placement?: PanelPlacement
  }
): Record<string, string> {
  const gap = opts?.gap ?? 4
  const align = opts?.align ?? 'start'
  const flip = opts?.flip !== false
  const placement = opts?.placement ?? 'bottom-start'
  const rect = trigger.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const minWidth = Math.max(rect.width, opts?.preferredWidth ?? 0)
  const estimatedHeight = 240
  const estimatedWidth = minWidth

  let top = rect.bottom + gap
  let left = align === 'end' || placement === 'bottom-end' ? rect.right - minWidth : rect.left

  if (placement === 'right-start') {
    left = rect.right + gap
    top = rect.top
    if (left + estimatedWidth > vw - gap) {
      left = Math.max(gap, rect.left - gap - estimatedWidth)
    }
  } else if (placement === 'left-start') {
    left = rect.left - gap - estimatedWidth
    top = rect.top
    if (left < gap) left = rect.right + gap
  } else if (flip && top + estimatedHeight > vh && rect.top > estimatedHeight) {
    top = Math.max(gap, rect.top - gap - estimatedHeight)
  }

  left = Math.min(Math.max(gap, left), vw - minWidth - gap)
  top = Math.min(Math.max(gap, top), vh - gap)

  return {
    position: 'fixed',
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    minWidth: `${Math.round(minWidth)}px`,
    zIndex: 'var(--z-dropdown, 1050)'
  }
}

/** Clamp a fixed point into the viewport (context menus). */
export function clampToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  pad = 8
): { x: number; y: number } {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, vw - width - pad)),
    y: Math.min(Math.max(pad, y), Math.max(pad, vh - height - pad))
  }
}
