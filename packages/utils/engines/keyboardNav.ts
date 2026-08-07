/**
 * ENG-003 Keyboard Navigation — roving / arrow / home / end / enter / esc / tab.
 */
import { KEYS } from '../keyboard'

export type KeyboardNavAction =
  | 'next'
  | 'prev'
  | 'first'
  | 'last'
  | 'select'
  | 'close'
  | 'none'

export interface KeyboardNavOptions {
  orientation?: 'vertical' | 'horizontal' | 'both'
  loop?: boolean
}

export function resolveKeyboardNavAction(
  event: KeyboardEvent,
  options: KeyboardNavOptions = {}
): KeyboardNavAction {
  const orientation = options.orientation ?? 'vertical'
  const key = event.key

  if (key === KEYS.ESCAPE) return 'close'
  if (key === KEYS.ENTER || key === KEYS.SPACE) return 'select'
  if (key === KEYS.HOME) return 'first'
  if (key === KEYS.END) return 'last'

  const vertical = orientation === 'vertical' || orientation === 'both'
  const horizontal = orientation === 'horizontal' || orientation === 'both'

  if (vertical && key === KEYS.ARROW_DOWN) return 'next'
  if (vertical && key === KEYS.ARROW_UP) return 'prev'
  if (horizontal && key === KEYS.ARROW_RIGHT) return 'next'
  if (horizontal && key === KEYS.ARROW_LEFT) return 'prev'

  return 'none'
}

export function moveRovingIndex(
  current: number,
  action: KeyboardNavAction,
  length: number,
  loop = true
): number {
  if (length <= 0) return -1
  if (action === 'first') return 0
  if (action === 'last') return length - 1
  if (action === 'next') {
    const next = current + 1
    if (next >= length) return loop ? 0 : length - 1
    return next
  }
  if (action === 'prev') {
    const prev = current - 1
    if (prev < 0) return loop ? length - 1 : 0
    return prev
  }
  return current
}
