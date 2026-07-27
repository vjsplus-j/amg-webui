/**
 * Lightweight global EventBus — tree-shake friendly singleton.
 * Failures in handlers never throw into emitters.
 */

export type EventHandler = (...args: unknown[]) => void

type OffFn = () => void

class EventServiceImpl {
  private listeners = new Map<string, Set<EventHandler>>()

  /** Subscribe; returns an unsubscribe function. */
  on(event: string, handler: EventHandler): OffFn {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler)
    return () => this.off(event, handler)
  }

  /** Subscribe once — auto-off after first emit. */
  once(event: string, handler: EventHandler): OffFn {
    const wrap: EventHandler = (...args) => {
      this.off(event, wrap)
      try {
        handler(...args)
      } catch {
        /* never break emit path */
      }
    }
    return this.on(event, wrap)
  }

  /** Remove one handler, or all handlers for an event when handler omitted. */
  off(event: string, handler?: EventHandler): void {
    const set = this.listeners.get(event)
    if (!set) return
    if (!handler) {
      this.listeners.delete(event)
      return
    }
    set.delete(handler)
    if (set.size === 0) this.listeners.delete(event)
  }

  /** Emit to all subscribers; handler errors are swallowed. */
  emit(event: string, ...args: unknown[]): void {
    const set = this.listeners.get(event)
    if (!set || set.size === 0) return
    for (const handler of [...set]) {
      try {
        handler(...args)
      } catch {
        /* side-path only */
      }
    }
  }

  /** Clear one channel or the entire bus. */
  clear(event?: string): void {
    if (event) this.listeners.delete(event)
    else this.listeners.clear()
  }

  /** Debug: listener count for a channel (or all). */
  listenerCount(event?: string): number {
    if (event) return this.listeners.get(event)?.size ?? 0
    let n = 0
    for (const set of this.listeners.values()) n += set.size
    return n
  }
}

/** Global event bus singleton — import from `@amg-webui/utils`. */
export const EventService = new EventServiceImpl()

export type { EventServiceImpl }
