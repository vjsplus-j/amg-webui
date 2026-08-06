/**
 * Fixed-position panel under/beside a trigger — for Teleport-to-body menus.
 */
export type PanelPlacement =
  "bottom-start" | "bottom-end" | "right-start" | "left-start";

export type FloatingPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface FloatingPanelResult {
  style: Record<string, string>;
  placement: FloatingPlacement;
}

function oppositePlacement(placement: FloatingPlacement): FloatingPlacement {
  if (placement.startsWith("top"))
    return placement.replace("top", "bottom") as FloatingPlacement;
  if (placement.startsWith("bottom"))
    return placement.replace("bottom", "top") as FloatingPlacement;
  if (placement.startsWith("left"))
    return placement.replace("left", "right") as FloatingPlacement;
  return placement.replace("right", "left") as FloatingPlacement;
}

/** Position a teleported panel using its real dimensions and viewport collision handling. */
export function getFloatingPanelStyle(
  trigger: HTMLElement,
  panel: HTMLElement | null,
  opts?: {
    placement?: FloatingPlacement;
    offset?: number;
    boundaryPadding?: number;
    flip?: boolean;
    matchTriggerWidth?: boolean;
    zIndex?: number;
  },
): FloatingPanelResult {
  const preferred = opts?.placement ?? "bottom";
  const offset = opts?.offset ?? 8;
  const padding = opts?.boundaryPadding ?? 8;
  const triggerRect = trigger.getBoundingClientRect();
  const panelRect = panel?.getBoundingClientRect();
  const width = panelRect?.width || panel?.offsetWidth || triggerRect.width;
  const height = panelRect?.height || panel?.offsetHeight || 0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  function coordinates(placement: FloatingPlacement) {
    const [side, align = "center"] = placement.split("-") as [string, string?];
    let top = triggerRect.bottom + offset;
    let left = triggerRect.left + (triggerRect.width - width) / 2;

    if (side === "top") top = triggerRect.top - height - offset;
    if (side === "left") {
      top = triggerRect.top + (triggerRect.height - height) / 2;
      left = triggerRect.left - width - offset;
    }
    if (side === "right") {
      top = triggerRect.top + (triggerRect.height - height) / 2;
      left = triggerRect.right + offset;
    }

    if (side === "top" || side === "bottom") {
      if (align === "start") left = triggerRect.left;
      if (align === "end") left = triggerRect.right - width;
    } else {
      if (align === "start") top = triggerRect.top;
      if (align === "end") top = triggerRect.bottom - height;
    }
    return { top, left };
  }

  function overflowScore(position: { top: number; left: number }) {
    return (
      Math.max(0, padding - position.left) +
      Math.max(0, position.left + width + padding - viewportWidth) +
      Math.max(0, padding - position.top) +
      Math.max(0, position.top + height + padding - viewportHeight)
    );
  }

  let placement = preferred;
  let position = coordinates(placement);
  if (opts?.flip !== false) {
    const opposite = oppositePlacement(preferred);
    const oppositePosition = coordinates(opposite);
    if (overflowScore(oppositePosition) < overflowScore(position)) {
      placement = opposite;
      position = oppositePosition;
    }
  }

  const maxLeft = Math.max(padding, viewportWidth - width - padding);
  const maxTop = Math.max(padding, viewportHeight - height - padding);
  position.left = Math.min(Math.max(padding, position.left), maxLeft);
  position.top = Math.min(Math.max(padding, position.top), maxTop);

  return {
    placement,
    style: {
      position: "fixed",
      top: `${Math.round(position.top)}px`,
      left: `${Math.round(position.left)}px`,
      ...(opts?.matchTriggerWidth
        ? { minWidth: `${Math.round(triggerRect.width)}px` }
        : {}),
      ...(opts?.zIndex === undefined ? {} : { zIndex: String(opts.zIndex) }),
    },
  };
}

export function getFixedPanelStyle(
  trigger: HTMLElement,
  opts?: {
    gap?: number;
    align?: "start" | "end";
    preferredWidth?: number;
    /** Flip above if not enough space below */
    flip?: boolean;
    placement?: PanelPlacement;
  },
): Record<string, string> {
  const gap = opts?.gap ?? 4;
  const align = opts?.align ?? "start";
  const flip = opts?.flip !== false;
  const placement = opts?.placement ?? "bottom-start";
  const rect = trigger.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const minWidth = Math.max(rect.width, opts?.preferredWidth ?? 0);
  const estimatedHeight = 240;
  const estimatedWidth = minWidth;

  let top = rect.bottom + gap;
  let left =
    align === "end" || placement === "bottom-end"
      ? rect.right - minWidth
      : rect.left;

  if (placement === "right-start") {
    left = rect.right + gap;
    top = rect.top;
    if (left + estimatedWidth > vw - gap) {
      left = Math.max(gap, rect.left - gap - estimatedWidth);
    }
  } else if (placement === "left-start") {
    left = rect.left - gap - estimatedWidth;
    top = rect.top;
    if (left < gap) left = rect.right + gap;
  } else if (flip && top + estimatedHeight > vh && rect.top > estimatedHeight) {
    top = Math.max(gap, rect.top - gap - estimatedHeight);
  }

  left = Math.min(Math.max(gap, left), vw - minWidth - gap);
  top = Math.min(Math.max(gap, top), vh - gap);

  return {
    position: "fixed",
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    minWidth: `${Math.round(minWidth)}px`,
    zIndex: "var(--z-dropdown, 1050)",
  };
}

/** Clamp a fixed point into the viewport (context menus). */
export function clampToViewport(
  x: number,
  y: number,
  width: number,
  height: number,
  pad = 8,
): { x: number; y: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, vw - width - pad)),
    y: Math.min(Math.max(pad, y), Math.max(pad, vh - height - pad)),
  };
}
