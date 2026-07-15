export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  SPACE: ' ',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
}

export function isEnterKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ENTER
}

export function isEscapeKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ESCAPE
}

export function isTabKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.TAB
}

export function isSpaceKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.SPACE
}

export function isArrowKey(event: KeyboardEvent): boolean {
  return (
    event.key === KEYS.ARROW_UP ||
    event.key === KEYS.ARROW_DOWN ||
    event.key === KEYS.ARROW_LEFT ||
    event.key === KEYS.ARROW_RIGHT
  )
}

export function isUpKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ARROW_UP
}

export function isDownKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ARROW_DOWN
}

export function isLeftKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ARROW_LEFT
}

export function isRightKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.ARROW_RIGHT
}

export function isHomeKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.HOME
}

export function isEndKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.END
}

export function isBackspaceKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.BACKSPACE
}

export function isDeleteKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.DELETE
}

export function isPageUpKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.PAGE_UP
}

export function isPageDownKey(event: KeyboardEvent): boolean {
  return event.key === KEYS.PAGE_DOWN
}

export function isModifierKey(event: KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey
}

export function preventDefault(event: KeyboardEvent): void {
  event.preventDefault()
}

export function stopPropagation(event: KeyboardEvent): void {
  event.stopPropagation()
}
