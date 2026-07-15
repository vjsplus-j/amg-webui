export function getElementOffset(element: HTMLElement): { top: number; left: number } {
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX
  }
}

export function getElementSize(element: HTMLElement): { width: number; height: number } {
  const rect = element.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height
  }
}

export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  )
}

export function scrollToElement(element: HTMLElement, behavior: 'smooth' | 'auto' = 'smooth'): void {
  element.scrollIntoView({ behavior, block: 'center' })
}

export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className)
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className)
}

export function toggleClass(element: HTMLElement, className: string, force?: boolean): void {
  element.classList.toggle(className, force)
}

export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className)
}

export function setAttribute(element: HTMLElement, name: string, value: string): void {
  element.setAttribute(name, value)
}

export function removeAttribute(element: HTMLElement, name: string): void {
  element.removeAttribute(name)
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName)
  if (className) {
    element.className = className
  }
  return element
}

export function insertBefore(element: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(element, referenceElement)
}

export function insertAfter(element: HTMLElement, referenceElement: HTMLElement): void {
  referenceElement.parentNode?.insertBefore(element, referenceElement.nextSibling)
}

export function removeElement(element: HTMLElement): void {
  element.parentNode?.removeChild(element)
}
