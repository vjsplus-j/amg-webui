import { onUnmounted, watch, type Ref } from 'vue'
import { getSharedScrollLockManager } from '@amg-webui/runtime'

let ownerSeq = 0

/**
 * Reference-counted document scroll locking for nested drawers and dialogs.
 * Delegates to `@amg-webui/runtime` shared scroll-lock-manager.
 */
export function useBodyScrollLock(active: Ref<boolean>, enabled: Ref<boolean>) {
  const manager = getSharedScrollLockManager()
  const ownerId = `hook-scroll-${++ownerSeq}`
  let ownsLock = false

  function sync() {
    const shouldLock = active.value && enabled.value
    if (shouldLock && !ownsLock) {
      manager.acquire(ownerId)
      ownsLock = true
    } else if (!shouldLock && ownsLock) {
      manager.release(ownerId)
      ownsLock = false
    }
  }

  watch([active, enabled], sync, { immediate: true })
  onUnmounted(() => {
    if (ownsLock) manager.release(ownerId)
    ownsLock = false
  })
}
