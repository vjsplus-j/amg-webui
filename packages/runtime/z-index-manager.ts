import type { OverlayKind } from './types'

/** Kind offsets above zIndexBase (align with theme --z-* tokens). */
const KIND_OFFSET: Record<OverlayKind, number> = {
  dropdown: 0,
  popover: 50,
  tour: 80,
  drawer: 100,
  modal: 100,
  message: 150,
  tooltip: 200
}

export function createZIndexManager(getBase: () => number) {
  let cursor = 0
  const issued = new Map<string, number>()

  return {
    allocate(id: string, kind: OverlayKind, explicit?: number): number {
      if (explicit !== undefined) {
        issued.set(id, explicit)
        return explicit
      }
      cursor += 1
      const z = getBase() + KIND_OFFSET[kind] + cursor
      issued.set(id, z)
      return z
    },
    release(id: string): void {
      issued.delete(id)
      if (issued.size === 0) cursor = 0
    },
    peek(id: string): number | undefined {
      return issued.get(id)
    },
    reset(): void {
      issued.clear()
      cursor = 0
    }
  }
}

export type ZIndexManager = ReturnType<typeof createZIndexManager>
