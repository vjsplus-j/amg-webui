/**
 * Positioning helpers for floating overlays.
 * Re-exports utils/domPanel so consumers can import from amg-webui/runtime.
 */
export {
  getFloatingPanelStyle,
  getFixedPanelStyle,
  clampToViewport,
  type PanelPlacement,
  type FloatingPlacement,
  type FloatingPanelResult
} from '@amg-webui/utils/domPanel'
