/** Read a CSS custom property as CSS pixels from an element (or documentElement). */
export function readCssPx(
  element: Element | null | undefined,
  varName: string,
  fallback: number,
): number {
  if (typeof window === "undefined" || !element) return fallback;
  const raw = getComputedStyle(element).getPropertyValue(varName).trim();
  if (!raw) return fallback;
  if (raw.endsWith("px")) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  if (raw.endsWith("rem")) {
    const rem = Number.parseFloat(raw);
    if (!Number.isFinite(rem)) return fallback;
    const root =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
      16;
    const px = rem * root;
    return px > 0 ? px : fallback;
  }
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Parse an inline width string (`120px` / `8rem` / bare number) to CSS pixels. */
export function parseWidthToPx(
  width: string | number | undefined,
  fallback: number,
  rootFontSize = 16,
): number {
  if (typeof width === "number" && Number.isFinite(width) && width > 0)
    return width;
  if (typeof width !== "string" || !width.trim()) return fallback;
  const raw = width.trim();
  if (raw.endsWith("%")) return fallback;
  if (raw.endsWith("px")) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }
  if (raw.endsWith("rem")) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) && n > 0 ? n * rootFontSize : fallback;
  }
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
