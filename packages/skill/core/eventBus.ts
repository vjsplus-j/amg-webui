import type { SkillEventBus, SkillEventHandler } from './types'

export type SkillEventListenerErrorHandler = (
  error: Error,
  event: string
) => void

export function createSkillEventBus(
  onListenerError?: SkillEventListenerErrorHandler
): SkillEventBus {
  const listeners = new Map<string, Set<SkillEventHandler>>()

  return {
    emit<Payload>(event: string, payload: Payload): void {
      const handlers = listeners.get(event)
      if (!handlers) return

      for (const handler of [...handlers]) {
        try {
          handler(payload)
        } catch (error) {
          onListenerError?.(
            error instanceof Error ? error : new Error(String(error)),
            event
          )
        }
      }
    },

    on<Payload>(event: string, handler: SkillEventHandler<Payload>): () => void {
      const handlers = listeners.get(event) ?? new Set<SkillEventHandler>()
      handlers.add(handler as SkillEventHandler)
      listeners.set(event, handlers)

      return () => {
        handlers.delete(handler as SkillEventHandler)
        if (handlers.size === 0) listeners.delete(event)
      }
    },

    clear(): void {
      listeners.clear()
    }
  }
}

