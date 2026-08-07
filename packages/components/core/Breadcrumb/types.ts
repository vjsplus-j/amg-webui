import type { InjectionKey, Ref, Slot } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export interface BreadcrumbItemData {
  label: string
  to?: string
  href?: string
  disabled?: boolean
  /** Lucide / Icon name */
  icon?: string
}

export const BREADCRUMB_INJECTION_KEY: InjectionKey<{
  separator: Ref<string>
  /** Host #separator slot when provided */
  separatorSlot: Ref<Slot | undefined>
}> = Symbol('vp-breadcrumb')

export interface BreadcrumbProps extends BaseProps {
  /** Declarative items (alternative to default slot) */
  items?: BreadcrumbItemData[]
  /** Text separator between items (ignored when #separator slot is used) */
  separator?: string
  /**
   * Collapse middle items when length exceeds this count.
   * Shows first + ellipsis + trailing items.
   */
  maxCount?: number
  /** Accessible name for the nav landmark */
  ariaLabel?: string
  trackId?: string
  telemetry?: boolean
}

export interface BreadcrumbEmits {
  (e: 'click', payload: { href?: string; to?: string; index: number; event: MouseEvent }): void
}
