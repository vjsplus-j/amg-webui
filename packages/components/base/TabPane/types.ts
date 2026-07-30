import type { BaseProps } from '@amg-webui/types'

export interface TabPaneProps extends BaseProps {
  name: string | number
  label?: string
  disabled?: boolean
  /** Defer rendering until the pane is first activated */
  lazy?: boolean
  /** Always keep content mounted (overrides lazy after first paint) */
  forceRender?: boolean
}
