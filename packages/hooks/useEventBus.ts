import { onUnmounted, getCurrentInstance } from 'vue'
import { EventService, type EventHandler } from '@amg-webui/utils'

/**
 * Subscribe to EventService and auto-unsubscribe on unmount.
 * Safe to call only inside `setup()` / lifecycle.
 */
export function useEventBus(event: string, handler: EventHandler): () => void {
  const off = EventService.on(event, handler)
  if (getCurrentInstance()) {
    onUnmounted(off)
  }
  return off
}
