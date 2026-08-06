import type { InjectionKey, Ref } from 'vue'
import type { BaseProps } from '@amg-webui/types'

export const LAYOUT_INJECTION_KEY: InjectionKey<LayoutContext> = Symbol('vp-layout')

export interface LayoutContext {
  direction: Ref<'horizontal' | 'vertical'>
  siderCount: Ref<number>
  registerSider: () => void
  unregisterSider: () => void
}

export interface LayoutProps extends BaseProps {
  /** Force has-sider layout (also auto when a Sider child registers) */
  hasSider?: boolean
  /** vertical = stack regions; horizontal = sider + content row */
  direction?: 'horizontal' | 'vertical'
  /** Full-viewport app chrome (locks document scroll) */
  shell?: boolean
  /** Fill parent height (nested panels) */
  fill?: boolean
  /** Accessible label when the layout is used as a landmark */
  ariaLabel?: string
  /** Root element; defaults to section */
  as?: 'div' | 'section' | 'main'
}
