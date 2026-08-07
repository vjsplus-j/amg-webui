export type SortDirection = "asc" | "desc";

export function compareCellValues(
  av: unknown,
  bv: unknown,
  dir: 1 | -1,
): number {
  if (av == null && bv == null) return 0;
  if (av == null) return -1 * dir;
  if (bv == null) return 1 * dir;
  if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
  return (
    String(av).localeCompare(String(bv), undefined, { numeric: true }) * dir
  );
}

export function sortRowsSync<T extends Record<string, unknown>>(
  rows: readonly T[],
  field: string,
  order: SortDirection,
): T[] {
  const dir: 1 | -1 = order === "asc" ? 1 : -1;
  return [...rows].sort((a, b) =>
    compareCellValues(a?.[field], b?.[field], dir),
  );
}
