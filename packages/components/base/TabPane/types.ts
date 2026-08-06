import type { BaseProps } from '@amg-webui/types'

export interface TabPaneProps extends BaseProps {
  name: string | number
  label?: string
  disabled?: boolean
  /** Defer rendering until the pane is first activated */
  lazy?: boolean
  /** Always keep content mounted (overrides lazy after first paint) */
  forceRender?: boolean
  /** Unmount content whenever the pane becomes inactive */
  destroyInactive?: boolean
  /** Accessible name when rendered outside Tabs or without a label */
  ariaLabel?: string
  /** Focus order for the active panel */
  tabindex?: number
}

export interface TabPaneEmits {
  /** Object/tuple form is resolvable by compiler-sfc during dev and HMR. */
  activate: [name: string | number]
  deactivate: [name: string | number]
}
