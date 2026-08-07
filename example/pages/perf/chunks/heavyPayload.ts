/**
 * Intentionally heavy, separately chunked module for lazy-load lab.
 * Vite will emit a distinct async chunk when imported via dynamic import().
 */
const rows = Array.from({ length: 2_000 }, (_, i) => ({
  id: i,
  label: `lazy-row-${i}`,
  payload: `x${(i * 31) % 997}-${(i * 17) % 251}`
}))

export const HEAVY_CHUNK_ID = 'example-perf-lazy-heavy'

export function summarizeHeavyChunk() {
  let checksum = 0
  for (const row of rows) {
    checksum = (checksum + row.id * 13 + row.payload.length) % 1_000_003
  }
  return {
    id: HEAVY_CHUNK_ID,
    rows: rows.length,
    checksum,
    approxChars: rows.reduce((n, r) => n + r.label.length + r.payload.length, 0)
  }
}

export default summarizeHeavyChunk
