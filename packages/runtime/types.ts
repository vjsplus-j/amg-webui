/** Overlay layer kinds — drive z-index baselines and default a11y/lock policy. */
export type OverlayKind =
  | 'modal'
  | 'drawer'
  | 'popover'
  | 'dropdown'
  | 'tooltip'
  | 'tour'
  | 'message'

export type TeleportTarget = string | HTMLElement | null | undefined

export interface OverlayAppContextConfig {
  /** Default Teleport target. @default 'body' */
  teleportTo?: TeleportTarget
  /** Base z-index (ConfigProvider / micro-FE). @default 1000 */
  zIndexBase?: number
  /** Storage / debug isolation key. @default 'amg-webui' */
  namespace?: string
}

export interface OverlayOpenOptions {
  kind: OverlayKind
  /** Modal semantics → aria-modal + default scroll lock. @default kind-based */
  modal?: boolean
  lockScroll?: boolean
  trapFocus?: boolean
  restoreFocus?: boolean
  closeOnEscape?: boolean
  onEscape?: () => void
  /** Explicit z-index override (skip stack allocation). */
  zIndex?: number
  /** Panel root for focus trap / initial focus. */
  container?: HTMLElement | null
  /** Extra nodes that count as “inside” for click-outside. */
  exclude?: Array<HTMLElement | null | undefined>
  onClickOutside?: (event: Event) => void
}

export interface OverlayLayer {
  id: string
  kind: OverlayKind
  zIndex: number
  modal: boolean
  lockScroll: boolean
  trapFocus: boolean
  restoreFocus: boolean
  closeOnEscape: boolean
  onEscape?: () => void
  container: HTMLElement | null
  exclude: Array<HTMLElement | null | undefined>
  onClickOutside?: (event: Event) => void
  previouslyFocused: HTMLElement | null
}

export type OverlayUpdatePatch = Partial<
  Pick<
    OverlayOpenOptions,
    | 'container'
    | 'exclude'
    | 'onEscape'
    | 'onClickOutside'
    | 'lockScroll'
    | 'trapFocus'
    | 'closeOnEscape'
    | 'modal'
  >
>

export interface OverlayHandle {
  id: string
  zIndex: number
  close(): void
  update(patch: OverlayUpdatePatch): void
}

export interface OverlayRuntimeApi {
  configure(config: OverlayAppContextConfig): void
  getContext(): Readonly<Required<Pick<OverlayAppContextConfig, 'zIndexBase' | 'namespace'>> & {
    teleportTo: TeleportTarget
  }>
  open(options: OverlayOpenOptions): OverlayHandle
  close(id: string): void
  closeTop(): void
  getTop(): OverlayLayer | null
  getLayer(id: string): OverlayLayer | null
  getStack(): readonly OverlayLayer[]
  resolveTeleportTo(override?: TeleportTarget): TeleportTarget
  dispose(): void
}
