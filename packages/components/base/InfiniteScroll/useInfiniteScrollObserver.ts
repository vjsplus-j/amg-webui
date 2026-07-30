export interface InfiniteScrollObserverOptions {
  distance?: number
  disabled?: boolean
  loading?: boolean
  finished?: boolean
  immediate?: boolean
  onLoad: () => void
  scrollRoot?: Element | null
}

export function createInfiniteScrollObserver(
  sentinel: HTMLElement,
  options: InfiniteScrollObserverOptions
) {
  let locked = false
  let observer: IntersectionObserver | null = null
  let immediateTimer: ReturnType<typeof setTimeout> | null = null

  const getState = () => options

  function canLoad() {
    const { disabled, loading, finished } = getState()
    return !disabled && !loading && !finished && !locked
  }

  function triggerLoad() {
    if (!canLoad()) return
    locked = true
    getState().onLoad()
  }

  function unlock() {
    locked = false
  }

  function observe() {
    observer?.disconnect()
    const { distance = 0, scrollRoot } = getState()
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) triggerLoad()
      },
      {
        root: scrollRoot ?? null,
        rootMargin: `0px 0px ${distance}px 0px`,
        threshold: 0
      }
    )
    observer.observe(sentinel)
  }

  observe()

  if (options.immediate !== false) {
    immediateTimer = setTimeout(() => {
      if (canLoad()) triggerLoad()
    }, 0)
  }

  return {
    refresh: observe,
    unlock,
    destroy() {
      if (immediateTimer) clearTimeout(immediateTimer)
      observer?.disconnect()
      observer = null
    }
  }
}
