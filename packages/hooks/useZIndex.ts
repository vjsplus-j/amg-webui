import { ref, watch, type Ref } from 'vue'
import { nextZIndex } from '@amg-webui/utils/zIndexManager'

/**
 * Allocate a stacking z-index once per overlay instance.
 * Optional `explicit` override wins when provided.
 */
export function useZIndex(explicit?: Ref<number | undefined>) {
  const zIndex = ref(explicit?.value ?? nextZIndex())

  if (explicit) {
    watch(
      explicit,
      (v) => {
        if (v != null) zIndex.value = v
      },
      { immediate: true }
    )
  }

  return zIndex
}
