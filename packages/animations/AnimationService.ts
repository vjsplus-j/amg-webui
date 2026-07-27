/**
 * Global animation master switch — Telemetry-style defaults:
 * motion stays ON unless apps call `disable()` / `configure({ enabled: false })`.
 * Always respects `prefers-reduced-motion: reduce`.
 */

export interface AnimationConfig {
  /**
   * Library motion enabled. Default `true` — does not break existing animations.
   * Set `false` to kill host keyframes / transitions driven by this service.
   */
  enabled?: boolean
  /**
   * When true (default), OS `prefers-reduced-motion: reduce` forces motion off
   * even if `enabled` is true.
   */
  respectReducedMotion?: boolean
}

const ATTR = 'data-vp-motion'
const DEFAULTS: Required<AnimationConfig> = {
  enabled: true,
  respectReducedMotion: true
}

type Listener = (allowed: boolean) => void

class AnimationServiceImpl {
  private cfg: Required<AnimationConfig> = { ...DEFAULTS }
  private listeners = new Set<Listener>()
  private media: MediaQueryList | null = null
  private mediaHandler: (() => void) | null = null

  configure(partial: AnimationConfig): void {
    this.cfg = { ...this.cfg, ...partial }
    this.syncDom()
    this.notify()
  }

  /** Explicitly enable library motion (still subject to prefers-reduced-motion). */
  enable(): void {
    this.cfg.enabled = true
    this.syncDom()
    this.notify()
  }

  /** Kill library motion globally (CSS attr + isMotionAllowed). */
  disable(): void {
    this.cfg.enabled = false
    this.syncDom()
    this.notify()
  }

  isEnabled(): boolean {
    return this.cfg.enabled
  }

  getConfig(): Readonly<Required<AnimationConfig>> {
    return this.cfg
  }

  /** True when CSS / JS motion may run. */
  isMotionAllowed(): boolean {
    if (!this.cfg.enabled) return false
    if (this.cfg.respectReducedMotion && this.prefersReducedMotion()) return false
    return true
  }

  prefersReducedMotion(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /** Subscribe to allow-flag changes; returns unsubscribe. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    this.ensureMediaWatch()
    return () => {
      this.listeners.delete(listener)
      if (this.listeners.size === 0) this.teardownMediaWatch()
    }
  }

  /** Apply `data-vp-motion` on <html> for CSS consumers. */
  syncDom(): void {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute(ATTR, this.isMotionAllowed() ? 'on' : 'off')
  }

  private notify(): void {
    const allowed = this.isMotionAllowed()
    for (const fn of [...this.listeners]) {
      try {
        fn(allowed)
      } catch {
        /* ignore */
      }
    }
  }

  private ensureMediaWatch(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    if (this.media) return
    this.media = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.mediaHandler = () => {
      this.syncDom()
      this.notify()
    }
    if (typeof this.media.addEventListener === 'function') {
      this.media.addEventListener('change', this.mediaHandler)
    } else {
      /* legacy Safari */
      ;(this.media as MediaQueryList & { addListener: (fn: () => void) => void }).addListener(
        this.mediaHandler
      )
    }
  }

  private teardownMediaWatch(): void {
    if (!this.media || !this.mediaHandler) return
    if (typeof this.media.removeEventListener === 'function') {
      this.media.removeEventListener('change', this.mediaHandler)
    } else {
      ;(this.media as MediaQueryList & { removeListener: (fn: () => void) => void }).removeListener(
        this.mediaHandler
      )
    }
    this.media = null
    this.mediaHandler = null
  }
}

/** Global animation switch — import from `@amg-webui/animations`. */
export const AnimationService = new AnimationServiceImpl()

/** Boot helper: write initial DOM attr (call once from app entry if desired). */
export function initAnimationDom(): void {
  AnimationService.syncDom()
}
