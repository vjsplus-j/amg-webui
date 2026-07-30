import type { BaseProps } from '@amg-webui/types'

export interface BreadcrumbItemProps extends BaseProps {
  /** Router path or hash — rendered as link when set */
  to?: string
  /** External / absolute URL */
  href?: string
  /** Mark as current page (aria-current) */
  current?: boolean
  disabled?: boolean
  trackId?: string
  telemetry?: boolean
}

export interface BreadcrumbItemEmits {
  (e: 'click', event: MouseEvent): void
}
