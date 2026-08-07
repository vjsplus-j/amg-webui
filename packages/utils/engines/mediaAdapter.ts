/**
 * ENG-012 Media Adapter Contract — state/event/destroy/reconnect without backend DTO binding.
 */
export type MediaReadyState = 'idle' | 'loading' | 'ready' | 'error' | 'destroyed'

export interface MediaAdapterError {
  code: string
  message: string
  cause?: unknown
}

export interface MediaAdapterEvents {
  onState?: (state: MediaReadyState) => void
  onError?: (error: MediaAdapterError) => void
  onReconnect?: (attempt: number) => void
}

export interface MediaAdapter {
  readonly state: MediaReadyState
  connect(options?: Record<string, unknown>): Promise<void>
  reconnect(): Promise<void>
  destroy(): void
}

export function createMockMediaAdapter(
  events: MediaAdapterEvents = {}
): MediaAdapter {
  let state: MediaReadyState = 'idle'
  let destroyed = false
  let attempts = 0

  function setState(next: MediaReadyState) {
    state = next
    events.onState?.(next)
  }

  return {
    get state() {
      return state
    },
    async connect() {
      if (destroyed) throw new Error('adapter destroyed')
      setState('loading')
      setState('ready')
    },
    async reconnect() {
      if (destroyed) throw new Error('adapter destroyed')
      attempts += 1
      events.onReconnect?.(attempts)
      setState('loading')
      setState('ready')
    },
    destroy() {
      destroyed = true
      setState('destroyed')
    }
  }
}
