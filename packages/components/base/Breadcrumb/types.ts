import type { InjectionKey } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const BREADCRUMB_INJECTION_KEY: InjectionKey<{ separator: string }> = Symbol('vp-breadcrumb')

export interface BreadcrumbProps extends BaseProps {
  separator?: string
}

export interface BreadcrumbItemProps extends BaseProps {
  to?: string
  href?: string
}
