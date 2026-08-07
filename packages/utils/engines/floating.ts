/**
 * ENG-004 Floating Panel Engine — re-exports + placement helpers.
 */
import type { FloatingPlacement } from '../domPanel'

export {
  getFloatingPanelStyle,
  type FloatingPlacement,
  type FloatingPanelResult
} from '../domPanel'

export interface FloatingEngineOptions {
  placement?: FloatingPlacement
  offset?: number
  zIndex?: number
  matchTriggerWidth?: boolean
}

export type FloatingEnginePlacement = FloatingPlacement
