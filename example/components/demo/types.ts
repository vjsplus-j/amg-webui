/** One row in Props / Events / Slots API tables (reuse PropsTable). */
export interface PropRow {
  name: string
  description: string
  type: string
  defaultValue?: string
}

/** Alias for Events / Slots tables — same columns as Props. */
export type ApiRow = PropRow
